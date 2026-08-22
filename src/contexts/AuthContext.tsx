// AuthContext — app-wide authentication state.
//
// Exposes exactly { user, authLoading, login, signup, logout }. This is
// the single source of truth for "who is logged in" — Header,
// FavouritesContext, and any protected views all read from this instead
// of talking to authService or Firebase directly.

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { logIn, logOut, signUp, subscribeToAuthChanges } from '../services/authService';
import type { AppUser } from '../types/User';

interface AuthContextValue {
  user: AppUser | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Exactly one Firebase auth listener for the whole app, set up once and
  // cleaned up on unmount.
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      authLoading,
      login: async (email, password) => {
        const loggedInUser = await logIn(email, password);
        setUser(loggedInUser);
      },
      signup: async (email, password) => {
        const newUser = await signUp(email, password);
        setUser(newUser);
      },
      logout: async () => {
        await logOut();
        setUser(null);
      },
    }),
    [user, authLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Read auth state/actions anywhere in the app. Must be used inside <AuthProvider>. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}