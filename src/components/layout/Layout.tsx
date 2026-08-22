import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

/**
 * Shared page shell: Header + routed page content (via <Outlet />) + Footer.
 * React Router renders whichever view matches the current route inside
 * <Outlet />, so Header/Footer never need to be repeated per-view.
 */
function Layout() {
  return (
    <>
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
