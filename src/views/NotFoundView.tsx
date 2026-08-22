import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../routes/paths';
import './NotFoundView.css';

/**
 * Shown whenever the URL does not match any declared route.
 */
function NotFoundView() {
  return (
    <section className="not-found-view page-container">
      <h1 className="not-found-view__code">404</h1>
      <p className="not-found-view__message">This page doesn&apos;t exist.</p>
      <Link to={ROUTE_PATHS.home} className="not-found-view__link">
        Back to Home
      </Link>
    </section>
  );
}

export default NotFoundView;
