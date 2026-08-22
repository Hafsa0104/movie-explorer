// Shared authenticated-user type. Deliberately small — just what the UI
// needs to display (email) and what favouritesService needs to key data
// on (uid). Services map Firebase's own User object down to this shape
// so the rest of the app never depends on the Firebase SDK's types.
export interface AppUser {
  uid: string;
  email: string | null;
}