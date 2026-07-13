import { ArrowLeft } from '@phosphor-icons/react';
import { CAPABILITIES, getCapability } from '../../config/capabilities';
import { getDailyPrompt } from '../../config/guidedPrompts';
import CapabilityIcon from '../../components/CapabilityIcon/CapabilityIcon';
import WellbeingCheckin from '../../components/WellbeingCheckin/WellbeingCheckin';
import styles from './Journal.module.css';

const MIN_LENGTH = 10;

export default function GuidedWrite({
  capability,
  setCapability,
  content,
  setContent,
  moodTags,
  setMoodTags,
  growthRating,
  setGrowthRating,
  wellbeing,
  setWellbeing,
  submitting,
  error,
  loadingMessage,
  onSubmit,
  onBack,
}) {
  const selected = getCapability(capability);
  const prompt = capability ? getDailyPrompt(capability) : null;
  const canSubmit = !!capability && content.trim().length >= MIN_LENGTH && !submitting;

  return (
    <div className={styles.writePage}>
      <button type="button" className={styles.backLink} onClick={onBack}>
        <ArrowLeft size={14} weight="regular" color="currentColor" />
        Change mode
      </button>

      <div className={styles.chipRow}>
        {CAPABILITIES.map((c) => (
          <button
            key={c.key}
            type="button"
            className={`${styles.chip} ${capability === c.key ? styles.chipSelected : ''}`}
            onClick={() => setCapability(c.key)}
          >
            <CapabilityIcon capabilityKey={c.key} size="medium" />
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      {selected && (
        <>
          <div className={styles.promptCard}>{prompt}</div>

          <textarea
            className={styles.textarea}
            placeholder="Write your response here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <WellbeingCheckin
            moodTags={moodTags}
            setMoodTags={setMoodTags}
            growthRating={growthRating}
            setGrowthRating={setGrowthRating}
            wellbeing={wellbeing}
            setWellbeing={setWellbeing}
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
