/*
 * ViewModel for HomeView / the Hero component.
 *
 * Performance strategy:
 *
 * 1. The first Hero movie is loaded first.
 * 2. As soon as the first movie is available, Hero can render.
 * 3. Remaining Hero movies are loaded in the background.
 * 4. Movie details are cached so remounting does not repeat requests.
 * 5. Carousel rotation happens entirely locally after data is loaded.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { getMovieDetails } from '../services/movieService';

import type { MovieDetails } from '../types/Movie';

const ROTATION_INTERVAL_MS = 7000;

/*
 * Module-level cache.
 *
 * The cache survives HomeView remounts during the current page lifetime.
 * This prevents unnecessary OMDb requests.
 */
const detailsCache = new Map<string, MovieDetails>();

/*
 * Prevent two simultaneous requests for the same IMDb ID.
 */
const inFlightRequests = new Map<
  string,
  Promise<MovieDetails>
>();

function getCachedMovieDetails(
  imdbID: string,
): Promise<MovieDetails> {
  const cached = detailsCache.get(imdbID);

  if (cached) {
    return Promise.resolve(cached);
  }

  const inFlight = inFlightRequests.get(imdbID);

  if (inFlight) {
    return inFlight;
  }

  const request = getMovieDetails(imdbID)
    .then((details) => {
      detailsCache.set(imdbID, details);
      inFlightRequests.delete(imdbID);

      return details;
    })
    .catch((error: unknown) => {
      inFlightRequests.delete(imdbID);

      throw error;
    });

  inFlightRequests.set(imdbID, request);

  return request;
}

export type HeroStatus =
  | 'loading'
  | 'ready'
  | 'error';

export interface FeaturedMovie {
  imdbID: string;
  title: string;
  year: string;
  genre: string;
  imdbRating: string;
  plot: string;

  /*
   * OMDb provides a poster URL.
   *
   * The Hero uses this image as its visual background.
   */
  posterUrl: string;
}

interface HomeViewModel {
  heroStatus: HeroStatus;

  featuredMovies: FeaturedMovie[];

  activeIndex: number;

  activeMovie: FeaturedMovie | null;

  goToNext: () => void;

  goToPrevious: () => void;

  goToIndex: (index: number) => void;

  setPaused: (paused: boolean) => void;
}

/*
 * Convert OMDb details into the smaller object the Hero actually needs.
 */
function toFeaturedMovie(
  details: MovieDetails,
): FeaturedMovie | null {
  if (
    !details.Poster ||
    details.Poster === 'N/A'
  ) {
    return null;
  }

  return {
    imdbID: details.imdbID,
    title: details.Title,
    year: details.Year,
    genre: details.Genre,
    imdbRating: details.imdbRating,
    plot: details.Plot,
    posterUrl: details.Poster,
  };
}

export function useHomeViewModel(
  sourceImdbIDs: string[],
): HomeViewModel {
  const [heroStatus, setHeroStatus] =
    useState<HeroStatus>('loading');

  const [featuredMovies, setFeaturedMovies] =
    useState<FeaturedMovie[]>([]);

  const [activeIndex, setActiveIndex] =
    useState(0);

  const [isPaused, setIsPaused] =
    useState(false);

  /*
   * sourceImdbIDs can be recreated by HomeView.
   *
   * Joining them gives us a stable dependency based on their
   * actual contents instead of their array reference.
   */
  const sourceKey = sourceImdbIDs.join('|');

  /*
   * ---------------------------------------------------------------
   * HERO DATA LOADING
   * ---------------------------------------------------------------
   *
   * Critical path:
   *
   * First movie → Hero ready
   *
   * Non-critical path:
   *
   * Remaining movies → loaded afterward
   */
  useEffect(() => {
    let isMounted = true;

    if (sourceImdbIDs.length === 0) {
      setHeroStatus('loading');
      setFeaturedMovies([]);
      setActiveIndex(0);

      return;
    }

    setHeroStatus('loading');
    setFeaturedMovies([]);
    setActiveIndex(0);

    const firstId = sourceImdbIDs[0];

    /*
     * FIRST HERO MOVIE
     *
     * This is the only movie that blocks the initial Hero render.
     */
    getCachedMovieDetails(firstId)
      .then((details) => {
        if (!isMounted) {
          return;
        }

        const firstMovie =
          toFeaturedMovie(details);

        if (!firstMovie) {
          setHeroStatus('error');
          return;
        }

        /*
         * Show the Hero immediately.
         *
         * We do NOT wait for the other movies.
         */
        setFeaturedMovies([firstMovie]);
        setActiveIndex(0);
        setHeroStatus('ready');

        /*
         * ---------------------------------------------------------
         * BACKGROUND LOAD
         * ---------------------------------------------------------
         *
         * The remaining movies are deliberately loaded after
         * the first Hero movie has become available.
         */
        const remainingIds =
          sourceImdbIDs.slice(1);

        if (remainingIds.length === 0) {
          return;
        }

        Promise.allSettled(
          remainingIds.map((imdbID) =>
            getCachedMovieDetails(imdbID),
          ),
        ).then((outcomes) => {
          if (!isMounted) {
            return;
          }

          const additionalMovies: FeaturedMovie[] = [];

          for (const outcome of outcomes) {
            if (
              outcome.status === 'fulfilled'
            ) {
              const movie =
                toFeaturedMovie(
                  outcome.value,
                );

              if (movie) {
                additionalMovies.push(movie);
              }
            }
          }

          /*
           * Add background-loaded movies without replacing
           * the first movie that is already visible.
           */
          if (additionalMovies.length > 0) {
            setFeaturedMovies(
              (currentMovies) => [
                ...currentMovies,
                ...additionalMovies,
              ],
            );
          }
        });
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setFeaturedMovies([]);
        setActiveIndex(0);
        setHeroStatus('error');
      });

    return () => {
      isMounted = false;
    };

    // sourceKey intentionally represents the dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceKey]);

  /*
   * ---------------------------------------------------------------
   * LOCAL CAROUSEL ROTATION
   * ---------------------------------------------------------------
   *
   * No network request happens here.
   *
   * The Hero simply changes which already-loaded movie is visible.
   */
  const featuredCount =
    featuredMovies.length;

  const intervalRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null,
    );

  useEffect(() => {
    if (
      featuredCount < 2 ||
      isPaused
    ) {
      return;
    }

    intervalRef.current =
      setInterval(() => {
        setActiveIndex((current) =>
          (current + 1) % featuredCount,
        );
      }, ROTATION_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(
          intervalRef.current,
        );

        intervalRef.current = null;
      }
    };
  }, [
    featuredCount,
    isPaused,
  ]);

  const goToIndex = useCallback(
    (index: number) => {
      if (featuredCount === 0) {
        return;
      }

      setActiveIndex(
        ((index % featuredCount) +
          featuredCount) %
          featuredCount,
      );
    },
    [featuredCount],
  );

  const goToNext = useCallback(() => {
    setActiveIndex((current) =>
      featuredCount === 0
        ? current
        : (current + 1) %
          featuredCount,
    );
  }, [featuredCount]);

  const goToPrevious =
    useCallback(() => {
      setActiveIndex((current) =>
        featuredCount === 0
          ? current
          : (current - 1 +
              featuredCount) %
              featuredCount,
      );
    }, [featuredCount]);

  const setPaused = useCallback(
    (paused: boolean) => {
      setIsPaused(paused);
    },
    [],
  );

  return {
    heroStatus,

    featuredMovies,

    activeIndex,

    activeMovie:
      featuredMovies[activeIndex] ??
      null,

    goToNext,

    goToPrevious,

    goToIndex,

    setPaused,
  };
}