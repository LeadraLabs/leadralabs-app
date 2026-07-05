import { CAPABILITIES } from '../../config/capabilities';
import { MOOD_OPTIONS } from '../../config/moods';
import CapabilityIcon from '../../components/CapabilityIcon/CapabilityIcon';
import styles from './Journal.module.css';

const MIN_LENGTH = 10;

export default function FreeWrite({
  capability,
  setCapability,
  moodRating,
  setMoodRating,
  content,
  setContent,
  submitting,
  error,
  loadingMessage,
  onSubmit,
  onBack,
}) {
  const canSubmit = content.trim().length >= MIN_LENGTH && !submitting;

  return (
    <div className={styles.writePage}>
      <button type="button" className={styles.backLink} onClick={onBack}>
        ← Change mode
      </button>

      <div className={styles.chipRow}>
        {CAPABILITIES.map((c) => (
          <button
            key={c.key}
            type="button"
            className={`${styles.chip} ${capability === c.key ? styles.chipSelected : ''}`}
            onClick={() => setCapability(capability === c.key ? null : c.key)}
          >
            <CapabilityIcon capabilityKey={c.key} size="large" />
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      <div className={styles.moodRow}>
        {MOOD_OPTIONS.map((m) => (
          <button
            key={m.value}
            type="button"
            className={`${styles.moodButton} ${moodRating === m.value ? styles.moodSelected : ''}`}
            onClick={() => setMoodRating(moodRating === m.value ? null : m.value)}
          >
            <m.icon
              size={24}
              weight="regular"
              color={moodRating === m.value ? 'var(--gold-hover)' : 'var(--text-muted)'}
            />
          </button>
        ))}
      </div>

      <textarea
        className={styles.textarea}
        placeholder="What moment stood out for you today? What happened, what did you feel, what did you do?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {error && <p className={styles.error}>{error}</p>}
      {submitting && <p className={styles.loadingMessage}>{loadingMessage}</p>}

      <button type="button" className={styles.submitButton} onClick={onSubmit} disabled={!canSubmit}>
        Get my insight
      </button>
    </div>
  );
}
