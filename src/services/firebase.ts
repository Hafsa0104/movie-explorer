// Firebase app initialization.
//
// This is the ONLY file in the project allowed to call initializeApp().
// authService.ts and favouritesService.ts import `auth`/`db` from here
// rather than initializing Firebase themselves.
//
// IMPORTANT: this must never throw at module-load time. If Firebase env
// vars are missing/blank (e.g. before the person has set up a Firebase
// project yet), the rest of the app — movie search, the hero, movie
// details — must keep working normally. `isFirebaseConfigured` lets
// authService/AuthContext detect this and fail gracefully instead.

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId,
);

if (!isFirebaseConfigured) {
  const missing = [
    !firebaseConfig.apiKey && 'VITE_FIREBASE_API_KEY',
    !firebaseConfig.authDomain && 'VITE_FIREBASE_AUTH_DOMAIN',
    !firebaseConfig.projectId && 'VITE_FIREBASE_PROJECT_ID',
    !firebaseConfig.appId && 'VITE_FIREBASE_APP_ID',
  ].filter(Boolean);
  // Developer-facing diagnostic only — never shown to the user. Makes it
  // immediately obvious which .env values are missing, instead of having
  // to guess from the generic "Sign-in is not available" message.
  console.warn(
    `Firebase is not configured — missing: ${missing.join(', ')}. ` +
      'Set these in your .env file, then restart "npm run dev" (Vite only reads .env on startup).',
  );
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    // Swallow init errors here too — a malformed config should degrade
    // to "auth unavailable", not crash the whole app.
    console.error('Firebase failed to initialize:', error);
    app = null;
    auth = null;
    db = null;
  }
}

export { app, auth, db };