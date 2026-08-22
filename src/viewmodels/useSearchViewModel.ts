// ViewModel for SearchView.
//
// Owns all search-related UI state (query text, results, loading, error,
// current page) and is the ONLY thing in the app allowed to call
// movieService for search purposes. SearchView reads state and calls
// actions from this hook — it never imports movieService itself.

import { useCallback, useState } from 'react';
import { searchMovies, MovieServiceError } from '../services/movieService';
import type { Movie } from '../types/Movie';

export type SearchStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

interface SearchViewModel {
  /** Current text in the search input (controlled input value). */
  query: string;
  /** Updates the query text as the user types. Does not trigger a search. */
  setQuery: (value: string) => void;
  /** Movies returned by the most recent successful search. */
  results: Movie[];
  /** Current phase of the search: idle | loading | success | empty | error. */
  status: SearchStatus;
  /** Human-readable error message to display, or null when there is none. */
  errorMessage: string | null;
  /** The OMDb page currently loaded. */
  page: number;
  /**
   * Runs a search. If `overrideQuery` is provided, that value is used
   * (and the input is synced to it) — this lets SearchView trigger a
   * search immediately on mount using a query passed in from elsewhere
   * (e.g. the navbar search) without waiting on state update timing.
   * Otherwise runs a search using whatever is currently in `query`.
   * Does nothing (no API call) if the resulting query is empty/whitespace.
   */
  runSearch: (overrideQuery?: string) => void;
  /** Loads the next page of results for the current query, if any results are loaded. */
  goToNextPage: () => void;
  /** Loads the previous page of results for the current query, if not already on page 1. */
  goToPreviousPage: () => void;
}

export function useSearchViewModel(): SearchViewModel {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const performSearch = useCallback((searchQuery: string, searchPage: number) => {
    const trimmed = searchQuery.trim();

    // Guard against calling the API for an empty query — OMDb would
    // reject it anyway, so there is no reason to spend a network request.
    if (trimmed === '') {
      return;
    }

    setStatus('loading');
    setErrorMessage(null);

    searchMovies(trimmed, searchPage)
      .then((movies) => {
        setResults(movies);
        setSubmittedQuery(trimmed);
        setPage(searchPage);
        setStatus('success');
      })
      .catch((error: unknown) => {
        setResults([]);
        setPage(searchPage);
        setSubmittedQuery(trimmed);

        if (error instanceof MovieServiceError) {
          if (error.code === 'NO_RESULTS') {
            setStatus('empty');
            setErrorMessage(null);
            return;
          }
          setStatus('error');
          setErrorMessage(error.message);
          return;
        }

        setStatus('error');
        setErrorMessage('Something went wrong. Please try again.');
      });
  }, []);

  const runSearch = useCallback(
    (overrideQuery?: string) => {
      const target = overrideQuery !== undefined ? overrideQuery : query;
      if (overrideQuery !== undefined) {
        setQuery(overrideQuery);
      }
      performSearch(target, 1);
    },
    [performSearch, query],
  );

  const goToNextPage = useCallback(() => {
    if (status !== 'success' && status !== 'empty') {
      return;
    }
    performSearch(submittedQuery, page + 1);
  }, [performSearch, submittedQuery, page, status]);

  const goToPreviousPage = useCallback(() => {
    if (page <= 1) {
      return;
    }
    performSearch(submittedQuery, page - 1);
  }, [performSearch, submittedQuery, page]);

  return {
    query,
    setQuery,
    results,
    status,
    errorMessage,
    page,
    runSearch,
    goToNextPage,
    goToPreviousPage,
  };
}