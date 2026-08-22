export const ROUTE_PATHS = {
  home: '/',
  search: '/search',
  login: '/login',
  signup: '/signup',
  favourites: '/favourites',
  movieDetails: (imdbID: string) => `/movie/${imdbID}`,
  movieDetailsPattern: '/movie/:imdbID',
} as const;

/**
 * Stable DOM ids for the scrollable sections on HomeView, so the header
 * nav and the sections themselves (via MovieRow's sectionId prop) always
 * agree on the same string — defined once here rather than duplicated.
 */
export const HOME_SECTION_IDS = {
  trending: 'section-trending',
  popular: 'section-popular',
  topRated: 'section-top-rated',
  newReleases: 'section-new-releases',
} as const;