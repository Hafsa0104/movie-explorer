import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HomeView from '../views/HomeView';
import SearchView from '../views/SearchView';
import MovieDetailsView from '../views/MovieDetailsView';
import LoginView from '../views/LoginView';
import SignupView from '../views/SignupView';
import FavouritesView from '../views/FavouritesView';
import NotFoundView from '../views/NotFoundView';
import { ROUTE_PATHS } from './paths';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={ROUTE_PATHS.home} element={<HomeView />} />
        <Route path={ROUTE_PATHS.search} element={<SearchView />} />
        <Route path={ROUTE_PATHS.movieDetailsPattern} element={<MovieDetailsView />} />
        <Route path={ROUTE_PATHS.login} element={<LoginView />} />
        <Route path={ROUTE_PATHS.signup} element={<SignupView />} />
        <Route path={ROUTE_PATHS.favourites} element={<FavouritesView />} />
        <Route path="*" element={<NotFoundView />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;