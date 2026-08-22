import { useEffect, useRef, type KeyboardEvent, type MouseEvent as ReactMouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HOME_SECTION_IDS, ROUTE_PATHS } from '../../routes/paths';
import { useNavSearchViewModel } from '../../viewmodels/useNavSearchViewModel';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

function Header() {
  const {
    query,
    setQuery,
    results,
    status,
    errorMessage,
    isOpen,
    openSearch,
    closeSearch,
    selectMovie,
    submitSearch,
  } = useNavSearchViewModel();

  const { user, authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout().then(() => navigate(ROUTE_PATHS.home));
  }

  // Holds a section id that should be scrolled to once we've landed on
  // the Home route, for the case where a section link is clicked from a
  // different page (e.g. /search). Cleared as soon as it's used.
  const pendingSectionRef = useRef<string | null>(null);

  function scrollToId(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // "Home" nav/logo: if already on Home, scroll to the top instead of
  // letting the Link do a no-op navigation. Otherwise let the Link
  // navigate to '/' normally.
  function handleHomeClick(event: ReactMouseEvent<HTMLAnchorElement>) {
    if (location.pathname === ROUTE_PATHS.home) {
      event.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }

  // Section links (Trending/Popular/Top Rated/New Releases): if already
  // on Home, intercept the click and smooth-scroll directly. Otherwise
  // let the Link navigate to '/', and record the target so the effect
  // below scrolls to it once HomeView has mounted.
  function handleSectionClick(event: ReactMouseEvent<HTMLAnchorElement>, sectionId: string) {
    if (location.pathname === ROUTE_PATHS.home) {
      event.preventDefault();
      scrollToId(sectionId);
    } else {
      pendingSectionRef.current = sectionId;
    }
  }

  useEffect(() => {
    if (location.pathname === ROUTE_PATHS.home && pendingSectionRef.current) {
      const id = pendingSectionRef.current;
      pendingSectionRef.current = null;
      scrollToId(id);
    }
  }, [location.pathname]);

  const searchAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (searchAreaRef.current && !searchAreaRef.current.contains(event.target as Node)) {
        closeSearch();
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen, closeSearch]);

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      closeSearch();
    } else if (event.key === 'Enter') {
      submitSearch();
    }
  }

  const showDropdown = isOpen && status !== 'idle';

  return (
    <header className="header">
      <div className="header__inner page-container">
        <div className="header__left">
          <Link to={ROUTE_PATHS.home} className="header__brand" onClick={handleHomeClick}>
            <span className="header__brand-mark">MOVIE</span>
            <span className="header__brand-accent">EXPLORER</span>
          </Link>

          <nav className="header__page-nav" aria-label="Page sections">
            <Link to={ROUTE_PATHS.home} className="header__nav-link" onClick={handleHomeClick}>
              Home
            </Link>
            <Link
              to={ROUTE_PATHS.home}
              className="header__nav-link"
              onClick={(event) => handleSectionClick(event, HOME_SECTION_IDS.trending)}
            >
              Trending
            </Link>
            <Link
              to={ROUTE_PATHS.home}
              className="header__nav-link"
              onClick={(event) => handleSectionClick(event, HOME_SECTION_IDS.popular)}
            >
              Popular
            </Link>
            <Link
              to={ROUTE_PATHS.home}
              className="header__nav-link"
              onClick={(event) => handleSectionClick(event, HOME_SECTION_IDS.topRated)}
            >
              Top Rated
            </Link>
            <Link
              to={ROUTE_PATHS.home}
              className="header__nav-link"
              onClick={(event) => handleSectionClick(event, HOME_SECTION_IDS.newReleases)}
            >
              New Releases
            </Link>
            {!authLoading && user && (
              <Link to={ROUTE_PATHS.favourites} className="header__nav-link">
                Favourites
              </Link>
            )}
          </nav>
        </div>

        <div className="header__right">
          <div className="header__search" ref={searchAreaRef}>
          {isOpen ? (
            <div className="header__search-field">
              <input
                ref={inputRef}
                type="text"
                className="header__search-input"
                placeholder="Search movies…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleInputKeyDown}
                aria-label="Search movies"
                autoComplete="off"
              />
              {status === 'loading' ? (
                <span className="header__search-spinner" aria-hidden="true" />
              ) : (
                <button
                  type="button"
                  className="header__search-icon-button"
                  onClick={submitSearch}
                  aria-label="Search movies"
                >
                  <svg
                    className="header__search-icon"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.6" />
                    <line
                      x1="13.1"
                      y1="13.1"
                      x2="17.5"
                      y2="17.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}

              {showDropdown && (
                <div className="header__search-dropdown">
                  {status === 'loading' && <p className="header__search-message">Searching…</p>}

                  {status === 'error' && (
                    <p className="header__search-message header__search-message--error" role="alert">
                      {errorMessage}
                    </p>
                  )}

                  {status === 'empty' && <p className="header__search-message">No movies found.</p>}

                  {status === 'success' && (
                    <ul className="header__search-results" aria-label="Search results">
                      {results.map((movie) => {
                        const hasPoster = movie.Poster && movie.Poster !== 'N/A';
                        return (
                          <li key={movie.imdbID}>
                            <button
                              type="button"
                              role="option"
                              aria-selected="false"
                              className="header__search-result"
                              onClick={() => selectMovie(movie.imdbID)}
                            >
                              {hasPoster ? (
                                <img
                                  className="header__search-result-poster"
                                  src={movie.Poster}
                                  alt=""
                                  loading="lazy"
                                />
                              ) : (
                                <span
                                  className="header__search-result-poster header__search-result-poster--fallback"
                                  aria-hidden="true"
                                />
                              )}
                              <span className="header__search-result-info">
                                <span className="header__search-result-title">{movie.Title}</span>
                                <span className="header__search-result-year">{movie.Year}</span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="header__search-trigger"
              onClick={openSearch}
              aria-label="Open movie search"
            >
              Search
            </button>
          )}
          </div>

          <div className="header__auth">
            {authLoading ? null : user ? (
              <button type="button" className="header__auth-button" onClick={handleLogout}>
                Log Out
              </button>
            ) : (
              <Link to={ROUTE_PATHS.login} className="header__auth-button header__auth-button--link">
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;