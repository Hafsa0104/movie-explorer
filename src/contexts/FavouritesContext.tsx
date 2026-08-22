// FavouritesContext — app-wide favourites state.
//
// Runs exactly ONE Firestore listener for the whole app (not one per
// movie card), scoped to the current user. Any component that needs to
// know "is this movie favourited" or wants to toggle it reads from this
// context instead of calling favouritesService directly.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  addFavourite,
  removeFavourite,
  subscribeFavourites,
  type FavouritesServiceError,
} from '../services/favouritesService';
import type { FavouriteMovie, Movie } from '../types/Movie';
import { useAuth } from './AuthContext';

interface FavouritesContextValue {
  favourites: FavouriteMovie[];
  loading: boolean;
  errorMessage: string | null;
  isFavourite: (imdbID: string) => boolean;
  toggleFavourite: (movie: Movie) => Promise<void>;
}

const FavouritesContext = createContext<FavouritesContextValue | null>(null);

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favourites, setFavourites] = useState<FavouriteMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // One listener, scoped to the current user. Cleaned up whenever the
  // user changes (including logging out) or the provider unmounts.
  useEffect(() => {
    if (!user) {
      setFavourites([]);
      setLoading(false);
      setErrorMessage(null);
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const unsubscribe = subscribeFavourites(
      user.uid,
      (nextFavourites) => {
        setFavourites(nextFavourites);
        setLoading(false);
      },
      (error: FavouritesServiceError) => {
        setErrorMessage(error.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [user]);

  const isFavourite = useCallback(
    (imdbID: string) => favourites.some((favourite) => favourite.imdbID === imdbID),
    [favourites],
  );

  const toggleFavourite = useCallback(
    async (movie: Movie) => {
      if (!user) {
        setErrorMessage('Log in to save favourites.');
        return;
      }

      try {
        if (isFavourite(movie.imdbID)) {
          await removeFavourite(user.uid, movie.imdbID);
        } else {
          await addFavourite(user.uid, movie);
        }
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
      }
    },
    [user, isFavourite],
  );

  const value = useMemo<FavouritesContextValue>(
    () => ({ favourites, loading, errorMessage, isFavourite, toggleFavourite }),
    [favourites, loading, errorMessage, isFavourite, toggleFavourite],
  );

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
}

/** Read/toggle favourites anywhere in the app. Must be used inside <FavouritesProvider>. */
export function useFavourites(): FavouritesContextValue {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
}