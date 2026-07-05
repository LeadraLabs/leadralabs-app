import { CAPABILITIES, getCapability } from '../../config/capabilities';
import CapabilityIcon from '../../components/CapabilityIcon/CapabilityIcon';
import styles from './Journal.module.css';

const MIN_LENGTH = 10;

export default function GuidedWrite({
  capability,
  setCapability,
  content,
  setContent,
  submitting,
  error,
  loadingMessage,
  onSubmit,
  onBack,
}) {
  const selected = getCapability(capability);
  const canSubmit = !!capability && content.trim().length >= MIN_LENGTH && !submitting;

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
            onClick={() => setCapability(c.key)}
          >
            <CapabilityIcon capabilityKey={c.key} size="large" />
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      {selected && (
        <>
          <div className={styles.promptCard}>{selected.prompt}</div>

          <textarea
            className={styles.textarea}
            placeholder="Write your response here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {error && <p className={styles.error}>{error}</p>}
          {submitting && <p className={styles.loadingMessage}>{loadingMessage}</p>}

          <button type="button" className={styles.submitButton} onClick={onSubmit} disabled={!canSubmit}>
            Get my insight
          </button>
        </>
      )}
    </div>
  );
}
