import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import FreeWrite from './FreeWrite';
import GuidedWrite from './GuidedWrite';
import styles from './Journal.module.css';

const LOADING_MESSAGES = ['Reading your entry...', 'Finding the insight...'];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function Journal() {
  const navigate = useNavigate();
  const { submitJournalEntry } = useApi();

  const [mode, setMode] = useState(null);
  const [capability, setCapability] = useState(null);
  const [moodRating, setMoodRating] = useState(() => {
    try {
      const stored = localStorage.getItem(`leadra_mood_${todayKey()}`);
      return stored ? Number(stored) : null;
    } catch {
      return null;
    }
  });
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [error, setError] = useState('');
  const [savedNoInsight, setSavedNoInsight] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (submitting) {
      intervalRef.current = setInterval(() => {
        setLoadingMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
      }, 2000);
    } else {
      clearInterval(intervalRef.current);
      setLoadingMessageIndex(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [submitting]);

  const handleSubmit = async () => {
    setError('');
    setSavedNoInsight(false);
    setSubmitting(true);
    try {
      const result = await submitJournalEntry({
        content,
        module: mode === 'guided' ? 'guided' : 'free_write',
        capability: capability || undefined,
        mood_rating: moodRating || undefined,
      });

      if (result.insight) {
        navigate(`/journal/success/${result.insight.id}`, { state: { insight: result.insight } });
      } else {
        setSavedNoInsight(true);
      }
    } catch {
      setError(
        "Your words are safe — something went a little sideways generating your insight. Try submitting again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (savedNoInsight) {
    return (
      <div className={styles.savedNotice}>
        <p className={styles.savedHeading}>Your entry is saved ✨</p>
        <p className={styles.savedBody}>
          Our thinking cap is taking a quick breather. We'll generate your insight shortly — check back on
          your dashboard soon.
        </p>
        <button type="button" className={styles.savedButton} onClick={() => navigate('/dashboard')}>
          Back to dashboard
        </button>
      </div>
    );
  }

  if (!mode) {
    return (
      <div className={styles.modeSelect}>
        <h1 className={styles.heading}>What kind of entry today?</h1>
        <div className={styles.modeCards}>
          <button type="button" className={styles.modeCard} onClick={() => setMode('free')}>
            <span className={styles.modeIcon}>✍️</span>
            <span className={styles.modeTitle}>Free write</span>
            <span className={styles.modeSubtitle}>Write whatever's on your mind</span>
          </button>
          <button type="button" className={styles.modeCard} onClick={() => setMode('guided')}>
            <span className={styles.modeIcon}>🧭</span>
            <span className={styles.modeTitle}>Guided</span>
            <span className={styles.modeSubtitle}>Answer a prompt for your chosen capability</span>
          </button>
        </div>
      </div>
    );
  }

  const sharedProps = {
    capability,
    setCapability,
    moodRating,
    setMoodRating,
    content,
    setContent,
    submitting,
    error,
    loadingMessage: LOADING_MESSAGES[loadingMessageIndex],
    onSubmit: handleSubmit,
    onBack: () => setMode(null),
  };

  return mode === 'free' ? <FreeWrite {...sharedProps} /> : <GuidedWrite {...sharedProps} />;
}
