import { Link } from 'react-router-dom';
import { useSignupViewModel } from '../viewmodels/useSignupViewModel';
import { ROUTE_PATHS } from '../routes/paths';
import './AuthView.css';

/**
 * SignupView — rendering only. All state/logic comes from
 * useSignupViewModel(); this component never calls authService directly.
 */
function SignupView() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    submitting,
    errorMessage,
    handleSubmit,
  } = useSignupViewModel();

  return (
    <section className="auth-view">
      <div className="auth-view__card">
        <h1 className="auth-view__title">Sign Up</h1>
        <p className="auth-view__subtitle">Create an account to save your favourite movies.</p>

        <form className="auth-view__form" onSubmit={handleSubmit} noValidate>
          <div
            className={`auth-view__error-slot${errorMessage ? ' auth-view__error-slot--visible' : ''}`}
            role="alert"
          >
            {errorMessage && <span className="auth-view__error-text">{errorMessage}</span>}
          </div>

          <div className="auth-view__field">
            <label htmlFor="signup-email" className="auth-view__label">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              className="auth-view__input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="auth-view__field">
            <label htmlFor="signup-password" className="auth-view__label">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              className="auth-view__input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className="auth-view__field">
            <label htmlFor="signup-confirm-password" className="auth-view__label">
              Confirm Password
            </label>
            <input
              id="signup-confirm-password"
              type="password"
              className="auth-view__input"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="auth-view__submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-view__footer">
          Already have an account?{' '}
          <Link to={ROUTE_PATHS.login} className="auth-view__footer-link">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}

export default SignupView;