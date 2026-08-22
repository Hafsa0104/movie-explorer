// Shared movie-related types.
//
// These types mirror the shape of data returned by the OMDb API
// (https://www.omdbapi.com/). Every part of the app (services,
// viewmodels, views, components) should import Movie types from here
// instead of re-declaring their own — that keeps the whole codebase
// working with a single, consistent shape.

/**
 * A single movie result, as returned by OMDb's search endpoint
 * (the "s=" search parameter).
 */
export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: MovieType;
}

/**
 * OMDb sometimes returns "N/A" instead of omitting a field or using null.
 * This alias documents that intentionally, so it's easy to search for.
 */
export type OmdbNotAvailable = 'N/A';

export type MovieType = 'movie' | 'series' | 'episode';

/**
 * Full movie details, as returned by OMDb's lookup endpoint
 * (the "i=" or "t=" parameter). Includes everything in Movie plus
 * additional metadata used for the details page and recommendations.
 */
export interface MovieDetails extends Movie {
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Ratings: MovieRatingSource[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
}

export interface MovieRatingSource {
  Source: string;
  Value: string;
}

/**
 * Raw shape of a successful OMDb search response
 * (GET /?s=batman&apikey=...).
 */
export interface OmdbSearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: 'True';
}

/**
 * Raw shape of a successful OMDb details response
 * (GET /?i=tt1234567&apikey=...).
 */
export interface OmdbDetailsResponse extends MovieDetails {
  Response: 'True';
}

/**
 * OMDb returns HTTP 200 even for logical errors (e.g. "Movie not found!"),
 * so callers must check the `Response` field, not just the HTTP status.
 */
export interface OmdbErrorResponse {
  Response: 'False';
  Error: string;
}

export type OmdbApiResponse<T> = (T & { Response: 'True' }) | OmdbErrorResponse;

/**
 * A favourited movie as stored in Firestore, at
 * users/{userId}/favourites/{imdbID}. Deliberately extends Movie instead
 * of duplicating its fields, so a favourite can be handed straight to
 * <MovieCard movie={...} /> with no mapping step. `addedAt` is the only
 * field favourites add beyond the base Movie shape.
 */
export interface FavouriteMovie extends Movie {
  /** Epoch milliseconds when the movie was favourited (Date.now()). */
  addedAt: number;
}