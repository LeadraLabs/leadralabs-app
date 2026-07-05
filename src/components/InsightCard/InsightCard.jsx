import { useState } from 'react';
import { ArrowClockwise } from '@phosphor-icons/react';
import { useApi } from '../../hooks/useApi';
import styles from './InsightCard.module.css';

const SENTIMENT_LABELS = {
  positive: 'Positive',
  neutral: 'Neutral',
  challenging: 'Challenging',
};

export default function InsightCard({ insight }) {
  const { refreshMicroAction } = useApi();
  const [action, setAction] = useState(insight.current_suggested_action);
  const [refreshesRemaining, setRefreshesRemaining] = useState(insight.refreshes_remaining ?? 0);
  const [exhausted, setExhausted] = useState(refreshesRemaining <= 0 && !insight.can_refresh);
  const [refreshing, setRefreshing] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const result = await refreshMicroAction(insight.id);
      setAction(result.current_suggested_action);
      setRefreshesRemaining(result.refreshes_remaining);
      setAnimKey((k) => k + 1);
      if (result.refreshes_remaining <= 0) setExhausted(true);
    } catch {
      // leave current action in place if the refresh call fails
    } finally {
      setRefreshing(false);
    }
  };

  const sentimentLabel = SENTIMENT_LABELS[insight.sentiment] || 'Neutral';

  return (
    <div className={styles.card}>
      <div className={styles.sentimentRow}>
        <span className={`${styles.sentimentDot} ${styles[insight.sentiment] || styles.neutral}`} />
        <span className={styles.sentimentLabel}>{sentimentLabel}</span>
      </div>

      {insight.themes && insight.themes.length > 0 && (
        <div className={styles.themes}>
          {insight.themes.slice(0, 3).map((theme) => (
            <span key={theme} className={styles.themePill}>
              {theme}
            </span>
          ))}
        </div>
      )}

      <div className={styles.divider} />

      <p className={styles.label}>Your micro-action for today</p>
      <p key={animKey} className={styles.action}>
        {action}
      </p>

      {!exhausted && refreshesRemaining > 0 && (
        <button type="button" className={styles.refreshLink} onClick={handleRefresh} disabled={refreshing}>
          <ArrowClockwise size={14} weight="regular" color="currentColor" />
          <span>
            This doesn't quite fit — show me another
            <span className={styles.remaining}>
              {' '}
              ({refreshesRemaining} option{refreshesRemaining === 1 ? '' : 's'} remaining)
            </span>
          </span>
        </button>
      )}

      {exhausted && (
        <p className={styles.exhaustedNote}>
          You've explored all three — pick the one that feels most doable.
        </p>
      )}

      <div className={styles.divider} />

      <p className={styles.label}>A note from your coach</p>
      <p className={styles.coachingNote}>{insight.coaching_note}</p>
    </div>
  );
}
