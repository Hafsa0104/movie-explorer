import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import type { Movie } from '../../types/Movie';

import type {
  MovieCollectionStatus,
} from '../../viewmodels/useMovieCollectionViewModel';

import MovieCard from '../movie/MovieCard';

import './MovieRow.css';

interface MovieRowProps {
  title: string;

  status: MovieCollectionStatus;

  movies: Movie[];

  /**
   * DOM id applied to the row's root <section>.
   */
  sectionId: string;
}

const SKELETON_CARD_COUNT = 8;

function MovieRow({
  title,
  status,
  movies,
  sectionId,
}: MovieRowProps) {
  const trackRef =
    useRef<HTMLDivElement>(null);

  const [canScrollPrev, setCanScrollPrev] =
    useState(false);

  const [canScrollNext, setCanScrollNext] =
    useState(false);

  /*
   * requestAnimationFrame ID.
   *
   * This prevents multiple scroll events from causing multiple
   * React state updates during the same browser frame.
   */
  const scrollFrameRef =
    useRef<number | null>(null);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;

    if (!track) {
      setCanScrollPrev(false);
      setCanScrollNext(false);

      return;
    }

    const maxScrollLeft = Math.max(
      0,
      track.scrollWidth -
        track.clientWidth,
    );

    const currentScrollLeft =
      track.scrollLeft;

    const SCROLL_TOLERANCE = 4;

    setCanScrollPrev(
      currentScrollLeft >
        SCROLL_TOLERANCE,
    );

    setCanScrollNext(
      currentScrollLeft <
        maxScrollLeft -
          SCROLL_TOLERANCE,
    );
  }, []);

  /*
   * Throttled scroll handler.
   *
   * Instead of updating React state for every native scroll event,
   * we wait for the next browser paint frame.
   *
   * This reduces unnecessary JavaScript and React work during
   * horizontal scrolling.
   */
  const handleScroll = useCallback(() => {
    if (
      scrollFrameRef.current !== null
    ) {
      return;
    }

    scrollFrameRef.current =
      requestAnimationFrame(() => {
        scrollFrameRef.current = null;

        updateScrollState();
      });
  }, [updateScrollState]);

  /*
   * Update arrows when:
   *
   * - movies change
   * - track size changes
   * - children are inserted/removed
   */
  useEffect(() => {
    updateScrollState();

    const track = trackRef.current;

    if (!track) {
      return;
    }

    const resizeObserver =
      new ResizeObserver(() => {
        handleScroll();
      });

    resizeObserver.observe(track);

    const mutationObserver =
      new MutationObserver(() => {
        handleScroll();
      });

    mutationObserver.observe(track, {
      childList: true,
      subtree: true,
    });

    return () => {
      resizeObserver.disconnect();

      mutationObserver.disconnect();

      if (
        scrollFrameRef.current !== null
      ) {
        cancelAnimationFrame(
          scrollFrameRef.current,
        );

        scrollFrameRef.current = null;
      }
    };
  }, [
    movies,
    handleScroll,
    updateScrollState,
  ]);

  /*
   * Scroll one screen-width section at a time.
   */
  const scrollByDirection =
    useCallback(
      (direction: 1 | -1) => {
        const track =
          trackRef.current;

        if (!track) {
          return;
        }

        track.scrollBy({
          left:
            track.clientWidth *
            0.8 *
            direction,
          behavior: 'smooth',
        });
      },
      [],
    );

  const hasMovies =
    status === 'success' &&
    movies.length > 0;

  return (
    <section
      id={sectionId}
      className="movie-row page-container"
      aria-label={title}
    >
      <div className="movie-row__header">
        <h2 className="movie-row__title">
          {title}
        </h2>
      </div>

      {/* Loading */}
      {status === 'loading' && (
        <div
          className="movie-row__track movie-row__track--skeleton"
          aria-hidden="true"
        >
          {Array.from({
            length:
              SKELETON_CARD_COUNT,
          }).map(
            (_, index) => (
              <div
                className="movie-row__skeleton-card"
                key={index}
              />
            ),
          )}
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <p
          className="movie-row__message"
          role="alert"
        >
          Unable to load{' '}
          {title.toLowerCase()}.
        </p>
      )}

      {/* Empty */}
      {status === 'empty' && (
        <p className="movie-row__message">
          No movies available right now.
        </p>
      )}

      {/* Movies */}
      {hasMovies && (
        <div
          className={[
            'movie-row__scroll-wrapper',

            canScrollPrev
              ? 'movie-row__scroll-wrapper--can-scroll-prev'
              : '',

            canScrollNext
              ? 'movie-row__scroll-wrapper--can-scroll-next'
              : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {/* PREVIOUS */}
          <button
            type="button"
            className="movie-row__nav-button movie-row__nav-button--prev"
            onClick={() =>
              scrollByDirection(-1)
            }
            disabled={!canScrollPrev}
            aria-label={`Previous ${title}`}
            aria-disabled={!canScrollPrev}
          >
            <span aria-hidden="true">
              ‹
            </span>
          </button>

          {/* MOVIE TRACK */}
          <div
            className="movie-row__track"
            ref={trackRef}
            onScroll={handleScroll}
          >
            {movies.map((movie) => (
              <div
                className="movie-row__item"
                key={movie.imdbID}
              >
                <MovieCard
                  movie={movie}
                />
              </div>
            ))}
          </div>

          {/* NEXT */}
          <button
            type="button"
            className="movie-row__nav-button movie-row__nav-button--next"
            onClick={() =>
              scrollByDirection(1)
            }
            disabled={!canScrollNext}
            aria-label={`Next ${title}`}
            aria-disabled={!canScrollNext}
          >
            <span aria-hidden="true">
              ›
            </span>
          </button>
        </div>
      )}
    </section>
  );
}

export default MovieRow;