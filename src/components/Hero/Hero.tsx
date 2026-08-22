import { Link } from 'react-router-dom';

import type {
  FeaturedMovie,
  HeroStatus,
} from '../../viewmodels/useHomeViewModel';

import { ROUTE_PATHS } from '../../routes/paths';

import './Hero.css';

interface HeroProps {
  status: HeroStatus;

  movies: FeaturedMovie[];

  activeIndex: number;

  activeMovie: FeaturedMovie | null;

  onNext: () => void;

  onPrevious: () => void;

  onSelectIndex: (index: number) => void;

  onPausedChange: (paused: boolean) => void;
}

/*
 * Hero — presentational only.
 *
 * Performance:
 *
 * - The active movie uses a real <img>.
 * - The first Hero image receives high fetch priority.
 * - The image is decoded asynchronously.
 * - Inactive images are loaded lazily.
 *
 * This gives the browser much better information about which
 * image is important for the initial paint.
 */
function Hero({
  status,
  movies,
  activeIndex,
  activeMovie,
  onNext,
  onPrevious,
  onSelectIndex,
  onPausedChange,
}: HeroProps) {
  if (status === 'loading') {
    return (
      <section
        className="hero hero--loading"
        aria-busy="true"
      >
        <div className="hero__content">
          <p className="hero__loading-text">
            Loading featured movies…
          </p>
        </div>
      </section>
    );
  }

  if (status === 'error' || !activeMovie) {
    return (
      <section className="hero hero--fallback">
        <div
          className="hero__overlay"
          aria-hidden="true"
        />

        <div className="hero__content">
          <h1 className="hero__fallback-title">
            Movie Explorer
          </h1>

          <p className="hero__fallback-tagline">
            Discover your next favorite movie.
          </p>

          <Link
            to={ROUTE_PATHS.search}
            className="hero__button hero__button--primary"
          >
            Explore Movies
          </Link>
        </div>
      </section>
    );
  }

  const genres =
    activeMovie.genre &&
    activeMovie.genre !== 'N/A'
      ? activeMovie.genre
      : null;

  const rating =
    activeMovie.imdbRating &&
    activeMovie.imdbRating !== 'N/A'
      ? activeMovie.imdbRating
      : null;

  const plot =
    activeMovie.plot &&
    activeMovie.plot !== 'N/A'
      ? activeMovie.plot
      : null;

  return (
    <section
      className="hero"
      onMouseEnter={() =>
        onPausedChange(true)
      }
      onMouseLeave={() =>
        onPausedChange(false)
      }
      onFocus={() =>
        onPausedChange(true)
      }
      onBlur={() =>
        onPausedChange(false)
      }
    >
      {/*
       * -----------------------------------------------------------
       * HERO IMAGE
       * -----------------------------------------------------------
       *
       * Real <img> instead of CSS background-image.
       *
       * The active image gets high priority because it is the
       * most important visual element during the initial load.
       */}
      <div
        className="hero__backgrounds"
        aria-hidden="true"
      >
        {movies.map((movie, index) => {
          const isActive =
            index === activeIndex;

          return (
            <img
              key={movie.imdbID}
              className={`hero__background${
                isActive
                  ? ' is-active'
                  : ''
              }`}
              src={movie.posterUrl}
              alt=""
              /*
               * The first active Hero image is the critical
               * image for LCP.
               */
              loading={
                index === 0
                  ? 'eager'
                  : 'lazy'
              }
              fetchPriority={
                index === 0
                  ? 'high'
                  : 'auto'
              }
              decoding="async"
            />
          );
        })}
      </div>

      <div
        className="hero__overlay"
        aria-hidden="true"
      />

      <div className="hero__content">
        <h1 className="hero__title">
          {activeMovie.title}
        </h1>

        <div className="hero__meta">
          <span>{activeMovie.year}</span>

          {genres && (
            <span>{genres}</span>
          )}

          {rating && (
            <span className="hero__rating">
              <span aria-hidden="true">
                ★
              </span>{' '}
              {rating} IMDb
            </span>
          )}
        </div>

        {plot && (
          <p className="hero__plot">
            {plot}
          </p>
        )}

        <div className="hero__actions">
          <Link
            to={ROUTE_PATHS.movieDetails(
              activeMovie.imdbID,
            )}
            className="hero__button hero__button--primary"
          >
            View Details
          </Link>

          <Link
            to={ROUTE_PATHS.search}
            className="hero__button hero__button--secondary"
          >
            Explore Movies
          </Link>
        </div>
      </div>

      {movies.length > 1 && (
        <div className="hero__controls">
          <button
            type="button"
            className="hero__nav-button"
            onClick={onPrevious}
            aria-label="Previous featured movie"
          >
            ‹
          </button>

          <div
            className="hero__dots"
            role="tablist"
            aria-label="Featured movies"
          >
            {movies.map(
              (movie, index) => (
                <button
                  key={movie.imdbID}
                  type="button"
                  role="tab"
                  aria-selected={
                    index ===
                    activeIndex
                  }
                  aria-label={`Show ${movie.title}`}
                  className={`hero__dot${
                    index ===
                    activeIndex
                      ? ' is-active'
                      : ''
                  }`}
                  onClick={() =>
                    onSelectIndex(
                      index,
                    )
                  }
                />
              ),
            )}
          </div>

          <button
            type="button"
            className="hero__nav-button"
            onClick={onNext}
            aria-label="Next featured movie"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}

export default Hero;