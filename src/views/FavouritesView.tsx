import { Link } from 'react-router-dom';

import { useFavouritesViewModel } from '../viewmodels/useFavouritesViewModel';
import MovieCard from '../components/movie/MovieCard';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ROUTE_PATHS } from '../routes/paths';

import './FavouritesView.css';

/**
 * FavouritesView — rendering only.
 *
 * All favourite state comes from useFavouritesViewModel().
 * Removing a favourite is handled by FavouriteButton through
 * FavouritesContext, using the same toggleFavourite() function
 * used throughout the application.
 */
function FavouritesView() {
  const {
    isLoggedIn,
    authLoading,
    favourites,
    loading,
    errorMessage,
  } = useFavouritesViewModel();
  useDocumentTitle('My Favourites');

  if (authLoading) {
    return (
      <section className="favourites-view page-container">
        <p className="favourites-view__status">
          Loading…
        </p>
      </section>
    );
  }

  if (!isLoggedIn) {
    return (
      <section className="favourites-view page-container">
        <div className="favourites-view__login-prompt">
          <h1 className="favourites-view__title">
            Favourites
          </h1>

          <p className="favourites-view__status">
            Log in to see and save your favourite movies.
          </p>

          <Link
            to={ROUTE_PATHS.login}
            className="favourites-view__login-button"
          >
            Log In
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="favourites-view page-container">
      <h1 className="favourites-view__title">
        Favourites
      </h1>

      {loading && (
        <p className="favourites-view__status">
          Loading your favourites…
        </p>
      )}

      {errorMessage && (
        <p
          className="favourites-view__status favourites-view__status--error"
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      {!loading &&
        !errorMessage &&
        favourites.length === 0 && (
          <p className="favourites-view__status">
            You haven&apos;t favourited any movies yet. Browse{' '}
            <Link
              to={ROUTE_PATHS.search}
              className="favourites-view__inline-link"
            >
              Search
            </Link>{' '}
            to find some.
          </p>
        )}

      {!loading && favourites.length > 0 && (
        <div className="favourites-view__grid">
          {favourites.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              requireConfirmation
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default FavouritesView;