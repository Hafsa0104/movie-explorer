// Auth Service
// --------------------------------------------------------------------------
// Talks to Firebase Authentication. Plain TypeScript — no React hooks, no
// component state. AuthContext is the only thing that calls this file.
//
// Like movieService.ts's MovieServiceError, every function here throws a
// single AuthServiceError with a stable `code` and a readable `message`,
// so the ViewModel/UI layer never has to branch on raw Firebase error
// strings like "auth/email-already-in-use" directly.

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';
import type { AppUser } from '../types/User';

export type AuthServiceErrorCode =
  | 'NOT_CONFIGURED'
  | 'EMAIL_ALREADY_IN_USE'
  | 'WEAK_PASSWORD'
  | 'INVALID_EMAIL'
  | 'INVALID_CREDENTIALS'
  | 'NETWORK_ERROR'
  | 'UNKNOWN';

export class AuthServiceError extends Error {
  public readonly code: AuthServiceErrorCode;

  constructor(code: AuthServiceErrorCode, message: string) {
    super(message);
    this.name = 'AuthServiceError';
    this.code = code;
  }
}

function toAppUser(user: User): AppUser {
  return { uid: user.uid, email: user.email };
}

function requireAuth() {
  if (!isFirebaseConfigured || !auth) {
    throw new AuthServiceError(
      'NOT_CONFIGURED',
      'Sign-in is not available right now. Please try again later.',
    );
  }
  return auth;
}

/**
 * Maps Firebase Auth's error codes to a stable AuthServiceError. Firebase
 * error objects have a `.code` string like "auth/weak-password" — we
 * check with `includes` on the raw error rather than importing Firebase's
 * error-code constants, since the SDK doesn't export a clean union type
 * for these.
 */
function toAuthServiceError(error: unknown): AuthServiceError {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String((error as { code: unknown }).code) : '';

  if (code.includes('email-already-in-use')) {
    return new AuthServiceError('EMAIL_ALREADY_IN_USE', 'An account with this email already exists.');
  }
  if (code.includes('weak-password')) {
    return new AuthServiceError('WEAK_PASSWORD', 'Password should be at least 6 characters.');
  }
  if (code.includes('invalid-email')) {
    return new AuthServiceError('INVALID_EMAIL', 'Enter a valid email address.');
  }
  if (
    code.includes('invalid-credential') ||
    code.includes('user-not-found') ||
    code.includes('wrong-password')
  ) {
    return new AuthServiceError('INVALID_CREDENTIALS', 'Incorrect email or password.');
  }
  if (code.includes('network-request-failed')) {
    return new AuthServiceError('NETWORK_ERROR', 'Network error. Check your connection and try again.');
  }

  return new AuthServiceError('UNKNOWN', 'Something went wrong. Please try again.');
}

export async function signUp(email: string, password: string): Promise<AppUser> {
  const authInstance = requireAuth();
  try {
    const credential = await createUserWithEmailAndPassword(authInstance, email, password);
    return toAppUser(credential.user);
  } catch (error) {
    throw toAuthServiceError(error);
  }
}

export async function logIn(email: string, password: string): Promise<AppUser> {
  const authInstance = requireAuth();
  try {
    const credential = await signInWithEmailAndPassword(authInstance, email, password);
    return toAppUser(credential.user);
  } catch (error) {
    throw toAuthServiceError(error);
  }
}

export async function logOut(): Promise<void> {
  const authInstance = requireAuth();
  try {
    await signOut(authInstance);
  } catch (error) {
    throw toAuthServiceError(error);
  }
}

/**
 * Subscribes to Firebase's own auth-state changes (handles persistence
 * across page reloads). Returns an unsubscribe function — the caller
 * (AuthContext) is responsible for calling it on unmount.
 * If Firebase isn't configured, immediately reports "no user" and
 * returns a no-op unsubscribe, so the app never hangs in a loading state.
 */
export function subscribeToAuthChanges(
  onChange: (user: AppUser | null) => void,
): () => void {
  if (!isFirebaseConfigured || !auth) {
    onChange(null);
    return () => {};
  }

  return onAuthStateChanged(auth, (user) => {
    onChange(user ? toAppUser(user) : null);
  });
}