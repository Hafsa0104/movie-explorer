// ViewModel for LoginView. Owns the form's local state and calls
// AuthContext.login — never calls authService or Firebase directly.

import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTE_PATHS } from '../routes/paths';

interface LoginViewModel {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  submitting: boolean;
  errorMessage: string | null;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useLoginViewModel(): LoginViewModel {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmailState] = useState('');
  const [password, setPasswordState] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function setEmail(value: string) {
    setEmailState(value);

    // Clear the previous validation/auth error as the user corrects the form.
    if (errorMessage) {
      setErrorMessage(null);
    }
  }

  function setPassword(value: string) {
    setPasswordState(value);

    // Clear the previous validation/auth error as the user corrects the form.
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
      setErrorMessage('Please enter a valid email address, e.g. name@example.com.');
      return;
    }

    if (password === '') {
      setErrorMessage('Please enter your password.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    login(trimmedEmail, password)
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
    submitting,
    errorMessage,
    handleSubmit,
  };
}