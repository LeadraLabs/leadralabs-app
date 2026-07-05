import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChatCenteredDots, X, Bug, Lightbulb, ChatText, CheckCircle } from '@phosphor-icons/react';
import { useApi } from '../../hooks/useApi';
import styles from './FeedbackButton.module.css';

const TYPES = [
  { key: 'bug', label: 'Bug', icon: Bug },
  { key: 'suggestion', label: 'Suggestion', icon: Lightbulb },
  { key: 'general', label: 'General feedback', icon: ChatText },
];

const MIN_LENGTH = 5;

export default function FeedbackButton() {
  const location = useLocation();
  const { submitFeedback } = useApi();

  const [open, setOpen] = useState(false);
  const [type, setType] = useState(null);
  const [whatWereYouDoing, setWhatWereYouDoing] = useState('');
  const [whatHappened, setWhatHappened] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const canSubmit =
    !!type &&
    whatWereYouDoing.trim().length >= MIN_LENGTH &&
    whatHappened.trim().length >= MIN_LENGTH &&
    !submitting;

  const resetAndClose = () => {
    setOpen(false);
    setType(null);
    setWhatWereYouDoing('');
    setWhatHappened('');
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');
    try {
      await submitFeedback({
        route: location.pathname,
        type,
        what_were_you_doing: whatWereYouDoing.trim(),
        what_happened: whatHappened.trim(),
      });
      setSuccess(true);
    } catch {
      setError("That didn't quite make it through — mind trying again?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={styles.fab}
        onClick={() => setOpen(true)}
        aria-label="Send feedback"
      >
        <ChatCenteredDots size={22} weight="regular" color="var(--warm-white)" />
      </button>

      {open && (
        <div className={styles.overlay} onClick={resetAndClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={styles.closeButton} onClick={resetAndClose} aria-label="Close">
              <X size={18} weight="regular" color="var(--text-muted)" />
            </button>

            {success ? (
              <div className={styles.successState}>
                <CheckCircle size={40} weight="regular" color="var(--success)" />
                <p className={styles.successHeading}>Thanks for the feedback</p>
                <p className={styles.successBody}>We've got it and we'll take a look.</p>
                <button type="button" className={styles.primaryButton} onClick={resetAndClose}>
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className={styles.heading}>Send feedback</h2>

                <div className={styles.typeRow}>
                  {TYPES.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      className={`${styles.typeChip} ${type === t.key ? styles.typeSelected : ''}`}
                      onClick={() => setType(t.key)}
                    >
                      <t.icon size={18} weight="regular" color="currentColor" />
                      {t.label}
                    </button>
                  ))}
                </div>

                <label className={styles.fieldLabel} htmlFor="feedback-doing">
                  What were you trying to do?
                </label>
                <textarea
                  id="feedback-doing"
                  className={styles.textarea}
                  value={whatWereYouDoing}
                  onChange={(e) => setWhatWereYouDoing(e.target.value)}
                />

                <label className={styles.fieldLabel} htmlFor="feedback-happened">
                  What happened instead?
                </label>
                <textarea
                  id="feedback-happened"
                  className={styles.textarea}
                  value={whatHappened}
                  onChange={(e) => setWhatHappened(e.target.value)}
                />

                {error && <p className={styles.error}>{error}</p>}

                <button type="submit" className={styles.primaryButton} disabled={!canSubmit}>
                  {submitting ? 'Sending...' : 'Send feedback'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
