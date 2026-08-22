// ViewModel for MovieDetailsView.
//
// Reads the imdbID from the current route, calls movieService.getMovieDetails,
// and exposes loading/success/not-found/error/invalid state. The View only
// reads this hook's return values — it never calls movieService directly.

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, MovieServiceError } from '../services/movieService';
import type { MovieDetails } from '../types/Movie';

export type MovieDetailsStatus = 'loading' | 'success' | 'not-found' | 'error' | 'invalid';

interface MovieDetailsViewModel {
  /** Current phase of the details fetch. */
  status: MovieDetailsStatus;
  /** The loaded movie, or null until status is 'success'. */
  movie: MovieDetails | null;
  /** Human-readable error message to display, or null when there is none. */
  errorMessage: string | null;
}

export function useMovieDetailsViewModel(): MovieDetailsViewModel {
  const { imdbID } = useParams<{ imdbID: string }>();
  const [status, setStatus] = useState<MovieDetailsStatus>('loading');
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const trimmedId = (imdbID ?? '').trim();

    // Guards against a malformed/empty :imdbID segment in the URL
    // (e.g. someone manually typing "/movie/") without ever calling the API.
    if (trimmedId === '') {
      setStatus('invalid');
      setMovie(null);
      setErrorMessage(null);
      return;
    }

    setStatus('loading');
    setErrorMessage(null);

    getMovieDetails(trimmedId)
      .then((details) => {
        if (!isMounted) return;
        setMovie(details);
        setStatus('success');
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        setMovie(null);

        if (error instanceof MovieServiceError) {
          if (error.code === 'NO_RESULTS') {
            setStatus('not-found');
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

    return () => {
      isMounted = false;
    };
  }, [imdbID]);

  return { status, movie, errorMessage };
}