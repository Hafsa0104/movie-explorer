import { Link } from 'react-router-dom';
import { useLoginViewModel } from '../viewmodels/useLoginViewModel';
import { ROUTE_PATHS } from '../routes/paths';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './AuthView.css';

/**
 * LoginView — rendering only. All state/logic comes from
 * useLoginViewModel(); this component never calls authService directly.
 */
function LoginView() {
  const { email, setEmail, password, setPassword, submitting, errorMessage, handleSubmit } = useLoginViewModel();
  useDocumentTitle('Log In');

  return (
    <section className="auth-view">
      <div className="auth-view__card">
        <h1 className="auth-view__title">Log In</h1>
        <p className="auth-view__subtitle">Welcome back to Movie Explorer.</p>

        <form className="auth-view__form" onSubmit={handleSubmit} noValidate>
          <div
            className={`auth-view__error-slot${errorMessage ? ' auth-view__error-slot--visible' : ''}`}
            role="alert"
          >
            {errorMessage && <span className="auth-view__error-text">{errorMessage}</span>}
          </div>

          <div className="auth-view__field">
            <label htmlFor="login-email" className="auth-view__label">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              className="auth-view__input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="auth-view__field">
            <label htmlFor="login-password" className="auth-view__label">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className="auth-view__input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="auth-view__submit" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <p className="auth-view__footer">
          Don&apos;t have an account?{' '}
          <Link to={ROUTE_PATHS.signup} className="auth-view__footer-link">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}

export default LoginView;