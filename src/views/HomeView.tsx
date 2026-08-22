import { useHomeViewModel } from '../viewmodels/useHomeViewModel';
import { useMovieCollectionViewModel } from '../viewmodels/useMovieCollectionViewModel';
import Hero from '../components/Hero/Hero';
import MovieRow from '../components/MovieRow/MovieRow';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { HOME_SECTION_IDS } from '../routes/paths';

// Curated, real movie titles per section, searched via the existing
// OMDb searchMovies() service. Defined at module scope (outside the
// component) so these arrays are stable references across renders, not
// recreated on every render — recreating them inline would cause
// useMovieCollectionViewModel's effect to re-run every render.
const TRENDING_TITLES = [
  'Oppenheimer',
  'Barbie',
  'Dune',
  'The Batman',
  'Top Gun Maverick',
  'John Wick',
  'Spider-Man',
  'Avatar',
];

const POPULAR_TITLES = [
  'Avengers Endgame',
  'Star Wars',
  'Jurassic Park',
  'The Lion King',
  'Titanic',
  'Frozen',
  'Harry Potter',
  'The Matrix',
];

const TOP_RATED_TITLES = [
  'The Shawshank Redemption',
  'The Godfather',
  'The Dark Knight',
  "Schindler's List",
  'Pulp Fiction',
  '12 Angry Men',
  'Fight Club',
  'Goodfellas',
];

const NEW_RELEASES_TITLES = [
  'Wonka',
  'Poor Things',
  'Killers of the Flower Moon',
  'Napoleon',
  'The Killer',
  'Dune Part Two',
  'Barbie',
  'Oppenheimer',
];

/** How many of Trending's resolved movies the Hero carousel should feature. */
const HERO_MOVIE_COUNT = 6;

/**
 * HomeView — composition only. The Hero now sources its movies directly
 * from the Trending section's resolved results (first HERO_MOVIE_COUNT
 * of them), instead of its own separate fixed list — so the two always
 * show the same movies. Each discovery row below the Hero still gets its
 * own independent useMovieCollectionViewModel() instance, so one
 * section loading/failing never affects the others.
 */
function HomeView() {
  useDocumentTitle();
  const trending = useMovieCollectionViewModel(TRENDING_TITLES);
  const popular = useMovieCollectionViewModel(POPULAR_TITLES);
  const topRated = useMovieCollectionViewModel(TOP_RATED_TITLES);
  const newReleases = useMovieCollectionViewModel(NEW_RELEASES_TITLES);

  const heroSourceIds = trending.movies.slice(0, HERO_MOVIE_COUNT).map((movie) => movie.imdbID);
  const { heroStatus, featuredMovies, activeIndex, activeMovie, goToNext, goToPrevious, goToIndex, setPaused } =
    useHomeViewModel(heroSourceIds);

  return (
    <>
      <Hero
        status={heroStatus}
        movies={featuredMovies}
        activeIndex={activeIndex}
        activeMovie={activeMovie}
        onNext={goToNext}
        onPrevious={goToPrevious}
        onSelectIndex={goToIndex}
        onPausedChange={setPaused}
      />

      <MovieRow
        sectionId={HOME_SECTION_IDS.trending}
        title="Trending Movies"
        status={trending.status}
        movies={trending.movies}
      />
      <MovieRow
        sectionId={HOME_SECTION_IDS.popular}
        title="Popular Movies"
        status={popular.status}
        movies={popular.movies}
      />
      <MovieRow
        sectionId={HOME_SECTION_IDS.topRated}
        title="Top Rated Movies"
        status={topRated.status}
        movies={topRated.movies}
      />
      <MovieRow
        sectionId={HOME_SECTION_IDS.newReleases}
        title="New Releases"
        status={newReleases.status}
        movies={newReleases.movies}
      />
    </>
  );
}

export default HomeView;