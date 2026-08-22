import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { useFavourites } from '../../contexts/FavouritesContext';
import { ROUTE_PATHS } from '../../routes/paths';
import type { Movie } from '../../types/Movie';

import './FavouriteButton.css';

interface FavouriteButtonProps {
  movie: Movie;

  /**
   * Visual size:
   * - sm for MovieCard
   * - md for Movie Details
   */
  size?: 'sm' | 'md';

  /**
   * When true, clicking an already-favourited movie
   * opens a confirmation dialog before removing it.
   *
   * This should only be true on the Favourites page.
   */
  requireConfirmation?: boolean;
}

function FavouriteButton({
  movie,
  size = 'sm',
  requireConfirmation = false,
}: FavouriteButtonProps) {
  const { user } = useAuth();
  const { isFavourite, toggleFavourite } = useFavourites();

  const [isPending, setIsPending] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const loginCloseButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const removeButtonRef = useRef<HTMLButtonElement>(null);

  const confirmTitleId = useId();
  const confirmDescriptionId = useId();

  const favourited = isFavourite(movie.imdbID);

  /**
   * The single favourite action used everywhere.
   * This keeps Firestore logic inside FavouritesContext.
   */
  async function performToggle() {
    setIsPending(true);

    try {
      await toggleFavourite(movie);
    } finally {
      setIsPending(false);
    }
  }

  /**
   * Heart button click.
   */
  async function handleClick(
    event: MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();
    event.stopPropagation();

    // Guest user:
    // Do not disable the button. Show login/signup prompt.
    if (!user) {
      setShowLoginPrompt(true);
      setIsConfirmOpen(false);
      return;
    }

    // Favourites page:
    // Filled heart requires confirmation before removal.
    if (requireConfirmation && favourited) {
      setIsConfirmOpen(true);
      setShowLoginPrompt(false);
      return;
    }

    // Everywhere else:
    // Add/remove immediately.
    await performToggle();
  }

  /**
   * Close login/signup prompt.
   */
  function closeLoginPrompt() {
    setShowLoginPrompt(false);
    triggerRef.current?.focus();
  }

  /**
   * Confirm removal.
   */
  async function handleConfirmRemove() {
    await performToggle();

    setIsConfirmOpen(false);
    triggerRef.current?.focus();
  }

  /**
   * Cancel removal.
   * Nothing is changed.
   */
  function closeConfirm() {
    setIsConfirmOpen(false);
    triggerRef.current?.focus();
  }

  /**
   * Keyboard behavior for removal dialog.
   */
  function handleConfirmKeyDown(
    event: KeyboardEvent<HTMLDivElement>,
  ) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeConfirm();
      return;
    }

    if (event.key === 'Tab') {
      const removeEl = removeButtonRef.current;
      const cancelEl = cancelButtonRef.current;

      if (!removeEl || !cancelEl) {
        return;
      }

      if (
        event.shiftKey &&
        document.activeElement === removeEl
      ) {
        event.preventDefault();
        cancelEl.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === cancelEl
      ) {
        event.preventDefault();
        removeEl.focus();
      }
    }
  }

  /**
   * Keyboard behavior for login/signup prompt.
   */
  function handleLoginPromptKeyDown(
    event: KeyboardEvent<HTMLDivElement>,
  ) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeLoginPrompt();
    }
  }

  /**
   * Move focus into login dialog when opened.
   */
  useEffect(() => {
    if (showLoginPrompt) {
      loginCloseButtonRef.current?.focus();
    }
  }, [showLoginPrompt]);

  /**
   * Move focus into confirmation dialog when opened.
   */
  useEffect(() => {
    if (isConfirmOpen) {
      cancelButtonRef.current?.focus();
    }
  }, [isConfirmOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={[
          'favourite-button',
          `favourite-button--${size}`,
          favourited ? 'is-favourited' : '',
          !user ? 'favourite-button--guest' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={handleClick}
        disabled={isPending}
        aria-pressed={favourited}
        aria-label={
          user
            ? favourited
              ? `Remove ${movie.Title} from favourites`
              : `Add ${movie.Title} to favourites`
            : `Log in to add ${movie.Title} to favourites`
        }
      >
        <svg
          viewBox="0 0 24 24"
          className="favourite-button__icon"
          aria-hidden="true"
        >
          <path
            d="M12 20.5s-7.5-4.6-10-9.2C.6 8.1 2 4.5 5.6 3.6 8 3 10.4 4.1 12 6.4 13.6 4.1 16 3 18.4 3.6 22 4.5 23.4 8.1 22 11.3c-2.5 4.6-10 9.2-10 9.2z"
            fill={favourited ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Login / Signup prompt for guests */}
      {showLoginPrompt &&
        createPortal(
          <div
            className="favourite-confirm-backdrop"
            onClick={closeLoginPrompt}
          >
            <div
              className="favourite-login-prompt"
              role="dialog"
              aria-modal="true"
              aria-label="Log in required to save favourites"
              onClick={(event) => event.stopPropagation()}
              onKeyDown={handleLoginPromptKeyDown}
            >
              <button
                ref={loginCloseButtonRef}
                type="button"
                className="favourite-login-prompt__close"
                onClick={closeLoginPrompt}
                aria-label="Close message"
              >
                ×
              </button>

              <p className="favourite-login-prompt__title">
                Want to save this movie? ❤️
              </p>

              <p className="favourite-login-prompt__text">
                Log in or sign up to add it to your favourites.
              </p>

              <div className="favourite-login-prompt__actions">
                <Link
                  to={ROUTE_PATHS.signup}
                  className="favourite-login-prompt__button favourite-login-prompt__button--primary"
                  onClick={closeLoginPrompt}
                >
                  Sign Up
                </Link>

                <Link
                  to={ROUTE_PATHS.login}
                  className="favourite-login-prompt__button favourite-login-prompt__button--secondary"
                  onClick={closeLoginPrompt}
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Remove confirmation for Favourites page */}
      {isConfirmOpen &&
        createPortal(
          <div
            className="favourite-confirm-backdrop"
            onClick={closeConfirm}
          >
            <div
              className="favourite-confirm-dialog"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby={confirmTitleId}
              aria-describedby={confirmDescriptionId}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={handleConfirmKeyDown}
            >
              <h2
                id={confirmTitleId}
                className="favourite-confirm-dialog__title"
              >
                Remove from Favourites?
              </h2>

              <p
                id={confirmDescriptionId}
                className="favourite-confirm-dialog__description"
              >
                Remove &quot;{movie.Title}&quot; from your
                favourite movies?
              </p>

              <div className="favourite-confirm-dialog__actions">
                <button
                  ref={removeButtonRef}
                  type="button"
                  className="favourite-confirm-dialog__button favourite-confirm-dialog__button--confirm"
                  onClick={handleConfirmRemove}
                  disabled={isPending}
                >
                  {isPending ? 'Removing…' : 'Remove'}
                </button>

                <button
                  ref={cancelButtonRef}
                  type="button"
                  className="favourite-confirm-dialog__button favourite-confirm-dialog__button--cancel"
                  onClick={closeConfirm}
                  disabled={isPending}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

export default FavouriteButton;