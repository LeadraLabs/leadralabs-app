import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { formatEntryDate } from '../../utils/date';
import CapabilityBadge from '../../components/CapabilityBadge/CapabilityBadge';
import InsightCard from '../../components/InsightCard/InsightCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import styles from './Insights.module.css';

const SENTIMENT_CLASS = {
  positive: styles.positive,
  neutral: styles.neutral,
  challenging: styles.challenging,
};

export default function Insights() {
  const { getRecentInsights, getJournalEntries } = useApi();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const [insightsResult, entriesResult] = await Promise.allSettled([
        getRecentInsights(),
        getJournalEntries(),
      ]);

      if (cancelled) return;

      const insights = insightsResult.status === 'fulfilled' ? insightsResult.value : [];
      const entries = entriesResult.status === 'fulfilled' ? entriesResult.value : [];
      const entryById = new Map(entries.map((e) => [e.id, e]));

      const merged = insights.map((insight) => ({
        insight,
        entry: entryById.get(insight.journal_entry_id) || null,
      }));

      setRows(merged);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [getRecentInsights, getJournalEntries]);

  if (loading) return <LoadingSpinner />;

  if (rows.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>
          Your insights will appear here after your first journal entry.
        </p>
        <Link to="/journal" className={styles.emptyLink}>
          Write your first entry →
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {rows.map(({ insight, entry }) => (
        <div key={insight.id} className={styles.row}>
          <div className={styles.rowHeader} onClick={() => setExpandedId(expandedId === insight.id ? null : insight.id)}>
            <div className={styles.rowMeta}>
              <span className={styles.date}>{formatEntryDate(insight.generated_at)}</span>
              {entry?.capability && <CapabilityBadge capabilityKey={entry.capability} size="small" />}
            </div>
            <span className={`${styles.sentimentDot} ${SENTIMENT_CLASS[insight.sentiment] || styles.neutral}`} />
          </div>
          {entry && (
            <p className={styles.preview}>
              {entry.content.length > 60 ? `${entry.content.slice(0, 60)}...` : entry.content}
            </p>
          )}
          {expandedId === insight.id && (
            <div className={styles.expanded}>
              <InsightCard insight={insight} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
