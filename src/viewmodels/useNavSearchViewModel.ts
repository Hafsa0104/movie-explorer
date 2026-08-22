// ViewModel for the navbar autocomplete search.
//
// This is deliberately separate from useSearchViewModel.ts (which powers
// the full /search page: submit-based, paginated). The navbar experience
// has different rules — debounced-as-you-type, a 3-character minimum, no
// pagination, and it owns whether the dropdown UI is open — so giving it
// its own hook keeps both hooks simple instead of one hook trying to
// serve two different interaction models.
//
// Header.tsx (the View) only reads state and calls actions from here.
// It never calls movieService or fetch directly.

import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchMovies, MovieServiceError } from '../services/movieService';
import type { Movie } from '../types/Movie';
import { ROUTE_PATHS } from '../routes/paths';

export type NavSearchStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_MS = 350;

interface NavSearchViewModel {
  /** Current text in the navbar search input. */
  query: string;
  /** Updates the query text as the user types; scheduling a debounced search. */
  setQuery: (value: string) => void;
  /** Movies returned by the most recent successful search. */
  results: Movie[];
  /** Current phase of the search. */
  status: NavSearchStatus;
  /** Human-readable, non-technical error message, or null when there is none. */
  errorMessage: string | null;
  /** Whether the navbar search input/dropdown is currently active. */
  isOpen: boolean;
  /** Switches the navbar from the "Search" trigger to the active input. */
  openSearch: () => void;
  /** Closes the navbar search and resets query/results/status. */
  closeSearch: () => void;
  /** Call when the user picks a result: closes search and navigates to it. */
  selectMovie: (imdbID: string) => void;
  /**
   * Call when the user presses Enter or clicks the search icon: closes
   * the navbar search and navigates to the full search results page
   * (SearchView) with the current query. Does nothing if the query is
   * empty/whitespace-only.
   */
  submitSearch: () => void;
}

export function useNavSearchViewModel(): NavSearchViewModel {
  const navigate = useNavigate();

  const [query, setQueryState] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [status, setStatus] = useState<NavSearchStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Guards against a slow, older request overwriting a newer one's results.
  const latestRequestIdRef = useRef(0);

  const clearPendingSearch = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  const setQuery = useCallback((value: string) => {
    setQueryState(value);
  }, []);

  // Debounced search: runs MIN_QUERY_LENGTH+ character queries DEBOUNCE_MS
  // after the user stops typing. Shorter/empty queries never call the API.
  useEffect(() => {
    clearPendingSearch();
    const trimmed = query.trim();

    if (trimmed.length < MIN_QUERY_LENGTH) {
      setStatus('idle');
      setResults([]);
      setErrorMessage(null);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      const requestId = ++latestRequestIdRef.current;
      setStatus('loading');
      setErrorMessage(null);

      searchMovies(trimmed)
        .then((movies) => {
          if (requestId !== latestRequestIdRef.current) return; // stale response
          setResults(movies);
          setStatus('success');
        })
        .catch((error: unknown) => {
          if (requestId !== latestRequestIdRef.current) return; // stale response
          setResults([]);

          if (error instanceof MovieServiceError && error.code === 'NO_RESULTS') {
            setStatus('empty');
            setErrorMessage(null);
            return;
          }

          // Deliberately generic and non-technical — the navbar should
          // never surface raw error codes/messages to the user.
          setStatus('error');
          setErrorMessage('Unable to search movies. Try again.');
        });
    }, DEBOUNCE_MS);

    return clearPendingSearch;
  }, [query, clearPendingSearch]);

  const openSearch = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    clearPendingSearch();
    setIsOpen(false);
    setQueryState('');
    setResults([]);
    setStatus('idle');
    setErrorMessage(null);
  }, [clearPendingSearch]);

  const selectMovie = useCallback(
    (imdbID: string) => {
      closeSearch();
      navigate(ROUTE_PATHS.movieDetails(imdbID));
    },
    [closeSearch, navigate],
  );

  const submitSearch = useCallback(() => {
    const trimmed = query.trim();

    if (trimmed === '') {
      setStatus('error');
      setErrorMessage('Please write a movie name.');
      setResults([]);
      setIsOpen(true);
      return;
    }

    closeSearch();
    navigate(`${ROUTE_PATHS.search}?q=${encodeURIComponent(trimmed)}`);
  }, [query, closeSearch, navigate]);

  return {
    query,
    setQuery,
    results,
    status,
    errorMessage,
    isOpen,
    openSearch,
    closeSearch,
    selectMovie,
    submitSearch,
  };
}