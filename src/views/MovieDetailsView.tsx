import FavouriteButton from '../components/movie/FavouriteButton';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMovieDetailsViewModel } from '../viewmodels/useMovieDetailsViewModel';
import { ROUTE_PATHS } from '../routes/paths';
import './MovieDetailsView.css';

/**
 * MovieDetailsView — rendering only.
 * All fetching/state comes from useMovieDetailsViewModel(); this component
 * never imports or calls movieService directly.
 */
function MovieDetailsView() {
  const { status, movie, errorMessage } = useMovieDetailsViewModel();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Resets scroll to the top whenever the URL for this page changes —
  // including navigating directly from one movie's details to another's,
  // since React Router keeps this component mounted and just re-renders
  // it rather than unmounting/remounting. Keyed on `pathname` (not on
  // `movie`) so it fires immediately on navigation, not only once the
  // OMDb fetch resolves. 'instant' avoids any visible scrolling
  // animation, per the requirement.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  function handleBack() {
    navigate(-1);
  }

  if (status === 'loading') {
    return (
      <section className="movie-details-view page-container">
        <p className="movie-details-view__status">Loading movie details…</p>
      </section>
    );
  }

  if (status === 'invalid') {
    return (
      <section className="movie-details-view page-container">
        <p className="movie-details-view__status movie-details-view__status--error" role="alert">
          This movie link isn&apos;t valid.
        </p>
        <Link to={ROUTE_PATHS.home} className="movie-details-view__back-link">
          Back to Home
        </Link>
      </section>
    );
  }

  if (status === 'not-found') {
    return (
      <section className="movie-details-view page-container">
        <p className="movie-details-view__status">This movie could not be found.</p>
        <Link to={ROUTE_PATHS.home} className="movie-details-view__back-link">
          Back to Home
        </Link>
      </section>
    );
  }

  if (status === 'error' || !movie) {
    return (
      <section className="movie-details-view page-container">
        <p className="movie-details-view__status movie-details-view__status--error" role="alert">
          {errorMessage ?? 'Something went wrong. Please try again.'}
        </p>
        <Link to={ROUTE_PATHS.home} className="movie-details-view__back-link">
          Back to Home
        </Link>
      </section>
    );
  }

  const hasPoster = movie.Poster && movie.Poster !== 'N/A';
  const genres = movie.Genre && movie.Genre !== 'N/A' ? movie.Genre.split(',').map((g) => g.trim()) : [];

  return (
    <section className="movie-details-view page-container">
      <button type="button" className="movie-details-view__back" onClick={handleBack}>
        <span aria-hidden="true">←</span> Back
      </button>

      <div className="movie-details-view__layout">
        <div className="movie-details-view__poster-wrap">
          {hasPoster ? (
            <img
              className="movie-details-view__poster"
              src={movie.Poster}
              alt={`${movie.Title} poster`}
            />
          ) : (
            <div
              className="movie-details-view__poster-fallback"
              role="img"
              aria-label={`${movie.Title} — no poster available`}
            >
              <span>{movie.Title}</span>
            </div>
          )}
        </div>

        <div className="movie-details-view__info">
          <div className="movie-details-view__title-row">
            <h1 className="movie-details-view__title">{movie.Title}</h1>
            <FavouriteButton movie={movie} size="md" />
          </div>

          <div className="movie-details-view__meta">
            <span>{movie.Year}</span>
            {movie.Runtime && movie.Runtime !== 'N/A' && <span>{movie.Runtime}</span>}
            {movie.Rated && movie.Rated !== 'N/A' && <span>{movie.Rated}</span>}
          </div>

          {movie.imdbRating && movie.imdbRating !== 'N/A' && (
            <div className="movie-details-view__rating">
              <span className="movie-details-view__rating-star" aria-hidden="true">
                ★
              </span>
              <span>{movie.imdbRating} / 10 IMDb</span>
            </div>
          )}

          {genres.length > 0 && (
            <div className="movie-details-view__genres">
              {genres.map((genre) => (
                <span key={genre} className="movie-details-view__genre-tag">
                  {genre}
                </span>
              ))}
            </div>
          )}

          {movie.Plot && movie.Plot !== 'N/A' && <p className="movie-details-view__plot">{movie.Plot}</p>}

          <dl className="movie-details-view__details-list">
            {movie.Director && movie.Director !== 'N/A' && (
              <div className="movie-details-view__detail-row">
                <dt>Director</dt>
                <dd>{movie.Director}</dd>
              </div>
            )}
            {movie.Actors && movie.Actors !== 'N/A' && (
              <div className="movie-details-view__detail-row">
                <dt>Actors</dt>
                <dd>{movie.Actors}</dd>
              </div>
            )}
            {movie.Released && movie.Released !== 'N/A' && (
              <div className="movie-details-view__detail-row">
                <dt>Released</dt>
                <dd>{movie.Released}</dd>
              </div>
            )}
            {movie.Language && movie.Language !== 'N/A' && (
              <div className="movie-details-view__detail-row">
                <dt>Language</dt>
                <dd>{movie.Language}</dd>
              </div>
            )}
            {movie.Country && movie.Country !== 'N/A' && (
              <div className="movie-details-view__detail-row">
                <dt>Country</dt>
                <dd>{movie.Country}</dd>
              </div>
            )}
            <div className="movie-details-view__detail-row">
              <dt>IMDb ID</dt>
              <dd>{movie.imdbID}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

export default MovieDetailsView;