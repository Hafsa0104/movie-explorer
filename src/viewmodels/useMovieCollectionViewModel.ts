// Reusable ViewModel for a titled row of movies (Trending, Popular, Top
// Rated, New Releases). Each section is a curated list of real movie
// titles, searched via the existing OMDb service — OMDb has no
// trending/popular/top-rated/new-releases endpoint, so this is the same
// honest strategy already used for the Hero (a curated list standing in
// for a missing API feature), applied to searchMovies() instead of
// getMovieDetails().
//
// Every section calls this hook separately (one instance per row), so
// one section loading slowly or failing never affects the others.

import { useEffect, useState } from 'react';
import { searchMovies } from '../services/movieService';
import type { Movie } from '../types/Movie';

export type MovieCollectionStatus = 'loading' | 'success' | 'empty' | 'error';

interface MovieCollectionViewModel {
  status: MovieCollectionStatus;
  movies: Movie[];
}

// Module-level (not component-level) cache + in-flight de-duplication,
// shared across every section that uses this hook. If the same title
// appears in two sections' curated lists (allowed — a movie can be both
// "Trending" and "Top Rated"), this ensures OMDb is only asked for it
// once, not once per section. Keyed by the lowercased, trimmed title.
const searchResultCache = new Map<string, Movie[]>();
const searchInFlight = new Map<string, Promise<Movie[]>>();

function getCachedFirstSearchResult(title: string): Promise<Movie[]> {
  const key = title.trim().toLowerCase();

  const cached = searchResultCache.get(key);
  if (cached) {
    return Promise.resolve(cached);
  }

  const inFlight = searchInFlight.get(key);
  if (inFlight) {
    return inFlight;
  }

  const request = searchMovies(title, 1)
    .then((movies) => {
      searchResultCache.set(key, movies);
      searchInFlight.delete(key);
      return movies;
    })
    .catch((error: unknown) => {
      searchInFlight.delete(key);
      throw error;
    });

  searchInFlight.set(key, request);
  return request;
}

/**
 * @param titles - a curated, fixed list of real movie titles to search
 *   for (one OMDb search per title; the first result is used). Pass a
 *   module-level constant array, not an inline literal, so the effect
 *   doesn't re-run on every render.
 */
export function useMovieCollectionViewModel(titles: string[]): MovieCollectionViewModel {
  const [status, setStatus] = useState<MovieCollectionStatus>('loading');
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    let isMounted = true;
    setStatus('loading');

    Promise.allSettled(titles.map((title) => getCachedFirstSearchResult(title))).then((outcomes) => {
      if (!isMounted) {
        return;
      }

      // Take the first (best) match per title, de-duplicated by imdbID
      // in case two curated titles resolve to the same movie — never
      // show the same card twice in one row.
      const seenIds = new Set<string>();
      const collected: Movie[] = [];

      for (const outcome of outcomes) {
        if (outcome.status === 'fulfilled' && outcome.value.length > 0) {
          const movie = outcome.value[0];
          if (!seenIds.has(movie.imdbID)) {
            seenIds.add(movie.imdbID);
            collected.push(movie);
          }
        }
      }

      setMovies(collected);
      setStatus(collected.length > 0 ? 'success' : 'empty');
    });

    return () => {
      isMounted = false;
    };
  }, [titles]);

  return { status, movies };
}