import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useApi } from '../../hooks/useApi';
import styles from './Signup.module.css';

export default function Signup() {
  const { signUpWithPassword, signInWithGoogle } = useAuth();
  const { createOrUpdateProfile } = useApi();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (password.length < 8) {
      setError('Your password needs to be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError("Those passwords don't match — mind trying again?");
      return;
    }

    setSubmitting(true);
    const { data, error: signUpError } = await signUpWithPassword(email, password);
    setSubmitting(false);

    if (signUpError) {
      setError("We couldn't create your account — double-check your details and try again.");
      return;
    }

    if (!data.session) {
      setInfo("Almost there — check your email to confirm your account, then sign in.");
      return;
    }

    try {
      await createOrUpdateProfile({ email, full_name: fullName });
    } catch {
      // profile can be created/updated later from the Profile screen if this fails
    }

    navigate('/onboarding');
  };

  const handleGoogle = async () => {
    setError('');
    const { error: googleError } = await signInWithGoogle();
    if (googleError) {
      setError("We couldn't sign you in — double-check your email and password and try again.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          LEADRA<span className={styles.arrow}>›</span>LABS
        </div>
        <p className={styles.tagline}>Leadership is built in moments.</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.fieldLabel} htmlFor="fullName">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            className={styles.input}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <label className={styles.fieldLabel} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className={styles.fieldLabel} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />

          <label className={styles.fieldLabel} htmlFor="confirmPassword">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            required
          />

          {error && <p className={styles.error}>{error}</p>}
          {info && <p className={styles.info}>{info}</p>}

          <button type="submit" className={styles.submitButton} disabled={submitting}>
            {submitting ? 'Creating your account...' : 'Create my account'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <button type="button" className={styles.googleButton} onClick={handleGoogle}>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.56 2.7-3.87 2.7-6.62z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.9v2.33A9 9 0 0 0 9 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.17.28-1.7V4.97H.9A9 9 0 0 0 0 9c0 1.45.35 2.83.9 4.03l3.05-2.33z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .9 4.97l3.05 2.33C4.66 5.17 6.65 3.58 9 3.58z"
            />
          </svg>
          Continue with Google
        </button>

        <p className={styles.footerLink}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
