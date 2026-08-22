// Favourites Service
// --------------------------------------------------------------------------
// Talks to Firestore, at users/{userId}/favourites/{imdbID}. Plain
// TypeScript — no React hooks, no reading auth.currentUser. `userId` is
// always passed in explicitly by the caller (FavouritesContext), never
// read from Firebase Auth state inside this file.

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  type FirestoreError,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import type { FavouriteMovie, Movie } from '../types/Movie';

export type FavouritesServiceErrorCode = 'NOT_CONFIGURED' | 'PERMISSION_DENIED' | 'NETWORK_ERROR' | 'UNKNOWN';

export class FavouritesServiceError extends Error {
  public readonly code: FavouritesServiceErrorCode;

  constructor(code: FavouritesServiceErrorCode, message: string) {
    super(message);
    this.name = 'FavouritesServiceError';
    this.code = code;
  }
}

function requireDb() {
  if (!isFirebaseConfigured || !db) {
    throw new FavouritesServiceError(
      'NOT_CONFIGURED',
      'Favourites are not available right now. Please try again later.',
    );
  }
  return db;
}

function toFavouritesServiceError(error: unknown): FavouritesServiceError {
  const firestoreError = error as FirestoreError;
  if (firestoreError?.code === 'permission-denied') {
    return new FavouritesServiceError('PERMISSION_DENIED', "You don't have permission to do that.");
  }
  if (firestoreError?.code === 'unavailable') {
    return new FavouritesServiceError('NETWORK_ERROR', 'Network error. Check your connection and try again.');
  }
  return new FavouritesServiceError('UNKNOWN', 'Something went wrong. Please try again.');
}

function favouritesCollection(userId: string) {
  return collection(requireDb(), 'users', userId, 'favourites');
}

/** Adds (or overwrites) a favourite. Using imdbID as the document ID means the same movie can never be saved twice. */
export async function addFavourite(userId: string, movie: Movie): Promise<void> {
  try {
    const favouriteDoc = doc(favouritesCollection(userId), movie.imdbID);
    const favourite: FavouriteMovie = { ...movie, addedAt: Date.now() };
    await setDoc(favouriteDoc, favourite);
  } catch (error) {
    throw toFavouritesServiceError(error);
  }
}

export async function removeFavourite(userId: string, imdbID: string): Promise<void> {
  try {
    const favouriteDoc = doc(favouritesCollection(userId), imdbID);
    await deleteDoc(favouriteDoc);
  } catch (error) {
    throw toFavouritesServiceError(error);
  }
}

/** One-time fetch, newest first. */
export async function getFavourites(userId: string): Promise<FavouriteMovie[]> {
  try {
    const favouritesQuery = query(favouritesCollection(userId), orderBy('addedAt', 'desc'));
    const snapshot = await getDocs(favouritesQuery);
    return snapshot.docs.map((docSnapshot) => docSnapshot.data() as FavouriteMovie);
  } catch (error) {
    throw toFavouritesServiceError(error);
  }
}

/**
 * Live subscription to a user's favourites, newest first. Returns an
 * unsubscribe function — the caller (FavouritesContext) must call it on
 * unmount / when the user logs out, so exactly one listener exists per
 * logged-in session, not one per component that needs favourite data.
 */
export function subscribeFavourites(
  userId: string,
  onChange: (favourites: FavouriteMovie[]) => void,
  onError: (error: FavouritesServiceError) => void,
): () => void {
  if (!isFirebaseConfigured || !db) {
    onError(new FavouritesServiceError('NOT_CONFIGURED', 'Favourites are not available right now.'));
    return () => {};
  }

  const favouritesQuery = query(favouritesCollection(userId), orderBy('addedAt', 'desc'));

  return onSnapshot(
    favouritesQuery,
    (snapshot) => {
      onChange(snapshot.docs.map((docSnapshot) => docSnapshot.data() as FavouriteMovie));
    },
    (error) => {
      onError(toFavouritesServiceError(error));
    },
  );
}