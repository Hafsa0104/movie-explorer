import { Link } from 'react-router-dom';

import type { Movie } from '../../types/Movie';
import { ROUTE_PATHS } from '../../routes/paths';

import FavouriteButton from './FavouriteButton';

import './MovieCard.css';

interface MovieCardProps {
  /**
   * When true, the FavouriteButton asks for confirmation
   * before removing an existing favourite.
   *
   * Only the Favourites page should pass true.
   */
  requireConfirmation?: boolean;

  movie: Movie;
}

function MovieCard({
  movie,
  requireConfirmation = false,
}: MovieCardProps) {
  const hasPoster =
    movie.Poster && movie.Poster !== 'N/A';

  return (
    <article className="movie-card">
      <div className="movie-card__poster-wrap">
        {hasPoster ? (
          <img
            className="movie-card__poster"
            src={movie.Poster}
            alt={`${movie.Title} poster`}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className="movie-card__poster-fallback"
            role="img"
            aria-label={`${movie.Title} — no poster available`}
          >
            <span>{movie.Title}</span>
          </div>
        )}

        <div
          className="movie-card__shine"
          aria-hidden="true"
        />

        <span className="movie-card__type">
          {movie.Type}
        </span>

        <div className="movie-card__favourite">
          <FavouriteButton
            movie={movie}
            size="sm"
            requireConfirmation={requireConfirmation}
          />
        </div>

        <Link
          to={ROUTE_PATHS.movieDetails(movie.imdbID)}
          className="movie-card__view-more"
          aria-label={`View details for ${movie.Title}`}
        >
          <span>View More</span>

          <span aria-hidden="true">
            →
          </span>
        </Link>
      </div>

      <div className="movie-card__info">
        <h3 className="movie-card__title">
          {movie.Title}
        </h3>

        <p className="movie-card__year">
          {movie.Year}
        </p>
      </div>
    </article>
  );
}

export default MovieCard;