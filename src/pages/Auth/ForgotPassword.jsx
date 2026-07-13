import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Login.module.css';

export default function ForgotPassword() {
  const { sendPasswordResetEmail } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setSubmitting(true);

    const { error: resetError } = await sendPasswordResetEmail(email);
    setSubmitting(false);

    if (resetError) {
      setError("We couldn't send that reset email, double-check your address and try again.");
      return;
    }

    setInfo("Check your email for a link to reset your password.");
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          LEADRA<span className={styles.arrow}>›</span>LABS
        </div>
        <p className={styles.tagline}>Reset your password.</p>

        <form className={styles.form} onSubmit={handleSubmit}>
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

          {error && <p className={styles.error}>{error}</p>}
          {info && <p className={styles.error} style={{ color: 'var(--navy)' }}>{info}</p>}

          <button type="submit" className={styles.submitButton} disabled={submitting}>
            {submitting ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <p className={styles.footerLink}>
          <Link to="/login">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
