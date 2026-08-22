// ViewModel for SignupView. Owns the form's local state and calls
// AuthContext.signup — never calls authService or Firebase directly.

import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTE_PATHS } from '../routes/paths';

interface SignupViewModel {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  submitting: boolean;
  errorMessage: string | null;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useSignupViewModel(): SignupViewModel {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmailState] = useState('');
  const [password, setPasswordState] = useState('');
  const [confirmPassword, setConfirmPasswordState] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function setEmail(value: string) {
    setEmailState(value);

    if (errorMessage) {
      setErrorMessage(null);
    }
  }

  function setPassword(value: string) {
    setPasswordState(value);

    if (errorMessage) {
      setErrorMessage(null);
    }
  }

  function setConfirmPassword(value: string) {
    setConfirmPasswordState(value);

    // Specifically fixes:
    // Password: abc123
    // Confirm:  abc
    // -> "Passwords do not match."
    //
    // Then the user changes Confirm to abc123.
    // -> The old error disappears immediately.
    if (errorMessage) {
      setErrorMessage(null);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (trimmedEmail === '') {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setErrorMessage(
        'Please enter a valid email address, e.g. name@example.com.',
      );
      return;
    }

    if (password === '') {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (confirmPassword === '') {
      setErrorMessage('Please confirm your password.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    signup(trimmedEmail, password)
      .then(() => {
        navigate(ROUTE_PATHS.home);
      })
      .catch((error: unknown) => {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.',
        );
        setSubmitting(false);
      });
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    submitting,
    errorMessage,
    handleSubmit,
  };
}