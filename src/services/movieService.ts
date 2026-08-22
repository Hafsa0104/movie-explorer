// Movie Service
// --------------------------------------------------------------------------
// Talks to the OMDb API (https://www.omdbapi.com/) and returns typed,
// already-validated data. This is the "Service/Model" layer of MVVM:
// - plain TypeScript, no React hooks, no React state, no JSX
// - ViewModels call these functions and turn the results into UI state
// - Views never call this file directly
//
// OMDb-specific behaviour this file accounts for:
// - OMDb ALWAYS responds with HTTP 200, even for logical errors (e.g. an
//   unknown title, missing/invalid API key, empty query). The only way to
//   know if a request logically succeeded is to check the `Response`
//   field in the JSON body ("True" | "False"). We never treat a 200 as
//   success on its own.
// - The search endpoint ("s=") returns a fixed page size of 10 results and
//   requires a `page` parameter to move through further pages — OMDb does
//   not let the page size itself be changed.
// - The search endpoint only accepts titles 3+ characters long; shorter
//   queries return a logical error ("Too many results." or similar),
//   which is surfaced as a normal MovieServiceError, not a crash.

import type { Movie, MovieDetails, OmdbApiResponse, OmdbSearchResponse } from '../types/Movie';

/**
 * Machine-readable error categories so a ViewModel can branch on `code`
 * (e.g. show a "try a different search" message for NO_RESULTS vs a
 * "check your connection" message for NETWORK_ERROR) while `message`
 * stays human-readable enough to show directly if the ViewModel doesn't
 * need anything fancier.
 */
export type MovieServiceErrorCode =
  | 'MISSING_CONFIG'
  | 'EMPTY_QUERY'
  | 'NETWORK_ERROR'
  | 'HTTP_ERROR'
  | 'API_ERROR'
  | 'NO_RESULTS'
  | 'MALFORMED_RESPONSE';

/**
 * A single, readable error type thrown by every function in this module.
 * ViewModels can catch this specifically to know the error came from the
 * movie service (as opposed to a bug elsewhere) and to read a stable
 * `code` for branching logic.
 */
export class MovieServiceError extends Error {
  public readonly code: MovieServiceErrorCode;

  constructor(code: MovieServiceErrorCode, message: string) {
    super(message);
    this.name = 'MovieServiceError';
    this.code = code;
  }
}

/**
 * Reads and validates the OMDb environment configuration.
 * Called at the start of every exported function so a missing/blank
 * .env value fails fast with a clear message instead of silently
 * producing a broken request URL.
 */
function getOmdbConfig(): { apiKey: string; baseUrl: string } {
  const apiKey = import.meta.env.VITE_OMDB_API_KEY;
  const baseUrl = import.meta.env.VITE_OMDB_BASE_URL;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_omdb_api_key_here') {
    throw new MovieServiceError(
      'MISSING_CONFIG',
      'OMDb API key is missing. Set VITE_OMDB_API_KEY in your .env file.',
    );
  }

  if (!baseUrl || baseUrl.trim() === '') {
    throw new MovieServiceError(
      'MISSING_CONFIG',
      'OMDb base URL is missing. Set VITE_OMDB_BASE_URL in your .env file.',
    );
  }

  return { apiKey, baseUrl };
}

/**
 * Builds a safe, correctly encoded OMDb request URL.
 * Using URLSearchParams (instead of manual string concatenation) makes
 * sure special characters in a search query — spaces, "&", "?", etc. —
 * can never corrupt the URL or get misread as extra parameters.
 */
function buildOmdbUrl(baseUrl: string, apiKey: string, params: Record<string, string>): string {
  const searchParams = new URLSearchParams({ apikey: apiKey, ...params });
  // baseUrl is guaranteed to end in "/" per the .env.example comment,
  // but this still works correctly either way.
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}?${searchParams.toString()}`;
}

/**
 * Performs the actual network request and returns the parsed JSON body,
 * typed as T — but does NOT yet check OMDb's own `Response: "False"`
 * logical-error field. That check happens in the caller, because the
 * expected shape of T differs between the search and details endpoints.
 *
 * Handles:
 * - network failures (offline, DNS failure, CORS, etc.)
 * - non-OK HTTP status codes
 * - responses that aren't valid JSON
 */
async function fetchOmdb<T>(url: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url);
  } catch {
    throw new MovieServiceError(
      'NETWORK_ERROR',
      'Could not reach OMDb. Check your internet connection and try again.',
    );
  }

  if (!response.ok) {
    throw new MovieServiceError(
      'HTTP_ERROR',
      `OMDb request failed with status ${response.status}.`,
    );
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new MovieServiceError(
      'MALFORMED_RESPONSE',
      'OMDb returned a response that could not be read.',
    );
  }
}

/**
 * OMDb returns HTTP 200 for logical errors too, so every response body
 * must be checked for `Response: "False"` before it's trusted. This type
 * guard makes that check explicit and reusable across endpoints.
 */
function isOmdbErrorResponse(
  data: unknown,
): data is { Response: 'False'; Error: string } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'Response' in data &&
    (data as { Response: unknown }).Response === 'False'
  );
}

/**
 * Searches OMDb for movies matching a title.
 *
 * @param query - search text (must be at least 1 non-whitespace character;
 *   OMDb itself requires 3+ characters and will return a logical error for
 *   shorter queries, which surfaces as a normal MovieServiceError)
 * @param page - OMDb page number (each page is a fixed 10 results; OMDb
 *   does not support a custom page size). Defaults to 1.
 */
export async function searchMovies(query: string, page: number = 1): Promise<Movie[]> {
  const trimmedQuery = query.trim();

  if (trimmedQuery === '') {
    throw new MovieServiceError('EMPTY_QUERY', 'Enter a movie title to search for.');
  }

  const { apiKey, baseUrl } = getOmdbConfig();
  const url = buildOmdbUrl(baseUrl, apiKey, {
    s: trimmedQuery,
    page: String(page),
    type: 'movie',
  });

  const data = await fetchOmdb<OmdbApiResponse<OmdbSearchResponse>>(url);

  if (isOmdbErrorResponse(data)) {
    // OMDb's own "no matches" error message is "Movie not found!" — we
    // recognize it specifically so the ViewModel can show a friendlier,
    // more specific UI state (e.g. an empty-results illustration) instead
    // of a generic error banner.
    if (data.Error.toLowerCase().includes('not found')) {
      throw new MovieServiceError('NO_RESULTS', `No movies found for "${trimmedQuery}".`);
    }
    throw new MovieServiceError('API_ERROR', data.Error);
  }

  if (!Array.isArray(data.Search)) {
    throw new MovieServiceError(
      'MALFORMED_RESPONSE',
      'OMDb returned an unexpected search response shape.',
    );
  }

  if (data.Search.length === 0) {
    throw new MovieServiceError('NO_RESULTS', `No movies found for "${trimmedQuery}".`);
  }

  return data.Search;
}

/**
 * Fetches full details for a single movie by its IMDb ID (e.g. "tt1234567").
 */
export async function getMovieDetails(imdbID: string): Promise<MovieDetails> {
  const trimmedId = imdbID.trim();

  if (trimmedId === '') {
    throw new MovieServiceError('EMPTY_QUERY', 'A movie ID is required to fetch its details.');
  }

  const { apiKey, baseUrl } = getOmdbConfig();
  const url = buildOmdbUrl(baseUrl, apiKey, { i: trimmedId, plot: 'full' });

  const data = await fetchOmdb<OmdbApiResponse<MovieDetails>>(url);

  if (isOmdbErrorResponse(data)) {
    if (data.Error.toLowerCase().includes('not found')) {
      throw new MovieServiceError('NO_RESULTS', 'This movie could not be found.');
    }
    throw new MovieServiceError('API_ERROR', data.Error);
  }

  // Sanity-check the fields the app actually depends on elsewhere
  // (details page, recommendations). Anything missing here means OMDb's
  // response shape changed or is otherwise not what we expect.
  if (!data.imdbID || !data.Title || !data.Genre) {
    throw new MovieServiceError(
      'MALFORMED_RESPONSE',
      'OMDb returned an unexpected movie details shape.',
    );
  }

  return data;
}