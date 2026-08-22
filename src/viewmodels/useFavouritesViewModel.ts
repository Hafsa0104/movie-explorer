// ViewModel for FavouritesView. Adapts AuthContext + FavouritesContext
// for this specific page — the View reads only from this hook.

import { useAuth } from '../contexts/AuthContext';
import { useFavourites } from '../contexts/FavouritesContext';
import type { FavouriteMovie } from '../types/Movie';

interface FavouritesViewModel {
  isLoggedIn: boolean;
  authLoading: boolean;
  favourites: FavouriteMovie[];
  loading: boolean;
  errorMessage: string | null;
}

export function useFavouritesViewModel(): FavouritesViewModel {
  const { user, authLoading } = useAuth();
  const { favourites, loading, errorMessage } = useFavourites();

  return {
    isLoggedIn: user !== null,
    authLoading,
    favourites,
    loading,
    errorMessage,
  };
}