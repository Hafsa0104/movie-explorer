import { useEffect } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchViewModel } from '../viewmodels/useSearchViewModel';
import MovieCard from '../components/movie/MovieCard';
import './SearchView.css';

/**
 * SearchView — rendering only.
 * All state and API calls come from useSearchViewModel(). This component
 * never imports or calls movieService directly.
 */
function SearchView() {
  const [searchParams] = useSearchParams();
  const {
    query,
    setQuery,
    results,
    status,
    errorMessage,
    page,
    runSearch,
    goToNextPage,
    goToPreviousPage,
  } = useSearchViewModel();

  // If the user arrived here from the navbar (Enter/search icon), the
  // query is passed as ?q=... — run that search once, on arrival.
  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery && initialQuery.trim() !== '') {
      runSearch(initialQuery);
    }
    // Intentionally run only once on mount — this seeds the page from the
    // URL a user arrived with; it should not re-run on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runSearch();
  }

  return (
    <section className="search-view page-container">
      <h1 className="search-view__title">Search Movies</h1>

      <form className="search-view__form" onSubmit={handleSubmit} role="search">
        <label htmlFor="search-input" className="search-view__label">
          Movie title
        </label>
        <div className="search-view__input-row">
          <input
            id="search-input"
            type="text"
            className="search-view__input"
            placeholder="e.g. Inception"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
          />
          <button type="submit" className="search-view__submit">
            Search
          </button>
        </div>
      </form>

      <div className="search-view__results" aria-live="polite">
        {status === 'loading' && (
          <p className="search-view__status search-view__status--loading">Searching…</p>
        )}

        {status === 'error' && (
          <p className="search-view__status search-view__status--error" role="alert">
            <span className="search-view__status-icon" aria-hidden="true">
              ⚠
            </span>
            {errorMessage}
          </p>
        )}

        {status === 'empty' && (
          <p className="search-view__status search-view__status--empty">
            No movies found. Try a different title.
          </p>
        )}

        {status === 'idle' && (
          <p className="search-view__status search-view__status--idle">
            Search for a movie title to get started.
          </p>
        )}

        {status === 'success' && (
          <>
            <div className="search-view__grid">
              {results.map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}
            </div>

            <div className="search-view__pagination">
              <button
                type="button"
                className="search-view__page-button"
                onClick={goToPreviousPage}
                disabled={page <= 1}
              >
                Previous
              </button>
              <span className="search-view__page-indicator">Page {page}</span>
              <button
                type="button"
                className="search-view__page-button"
                onClick={goToNextPage}
                disabled={results.length < 10}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default SearchView;