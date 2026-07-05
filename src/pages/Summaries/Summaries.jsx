import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import CapabilityBadge from '../../components/CapabilityBadge/CapabilityBadge';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import styles from './Summaries.module.css';

function formatWeekStart(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function WeeklyTab() {
  const { getAllSummaries } = useApi();
  const [loading, setLoading] = useState(true);
  const [summaries, setSummaries] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getAllSummaries()
      .then((data) => {
        if (!cancelled) setSummaries(data || []);
      })
      .catch(() => {
        if (!cancelled) setSummaries([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [getAllSummaries]);

  if (loading) return <LoadingSpinner />;

  if (summaries.length === 0) {
    return (
      <p className={styles.emptyText}>
        Your first weekly summary will arrive after your first full week of journaling.
      </p>
    );
  }

  const [latest, ...older] = summaries;

  return (
    <div className={styles.weeklyList}>
      <SummaryCard summary={latest} expanded />
      {older.map((s) => (
        <div key={s.id}>
          {expandedId === s.id ? (
            <SummaryCard summary={s} expanded />
          ) : (
            <button
              type="button"
              className={styles.collapsedRow}
              onClick={() => setExpandedId(s.id)}
            >
              Week of {formatWeekStart(s.week_start)}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function SummaryCard({ summary, expanded }) {
  return (
    <div className={styles.summaryCard}>
      <p className={styles.weekLabel}>Week of {formatWeekStart(summary.week_start)}</p>
      {expanded && (
        <>
          <p className={styles.summaryText}>{summary.summary}</p>
          {summary.key_themes && summary.key_themes.length > 0 && (
            <div className={styles.themes}>
              {summary.key_themes.map((theme) => (
                <span key={theme} className={styles.themePill}>
                  {theme}
                </span>
              ))}
            </div>
          )}
          {summary.focus_recommendation && (
            <p className={styles.focusNote}>
              <strong>Focus for next week:</strong> {summary.focus_recommendation}
            </p>
          )}
          {summary.progress_note && <p className={styles.progressNote}>{summary.progress_note}</p>}
        </>
      )}
    </div>
  );
}

function MonthlyTab() {
  const { getMonthlyPatterns } = useApi();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const load = () => {
    setLoading(true);
    getMonthlyPatterns()
      .then((result) => setData(result))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  };

  useEffect(load, [getMonthlyPatterns]);

  if (loading) return <LoadingSpinner />;

  if (!data) {
    return <p className={styles.emptyText}>We couldn't load your monthly patterns right now.</p>;
  }

  return (
    <div className={styles.monthlyWrapper}>
      <div className={styles.refreshRow}>
        <button type="button" className={styles.refreshButton} onClick={load}>
          ↻ Refresh patterns
        </button>
      </div>

      <div className={styles.overallCard}>
        <p>{data.overall_theme}</p>
      </div>

      {data.patterns && data.patterns.length > 0 && (
        <div className={styles.patternList}>
          {data.patterns.map((pattern) => (
            <div key={pattern.title} className={styles.patternCard}>
              <div className={styles.patternHeader}>
                <p className={styles.patternTitle}>{pattern.title}</p>
                {pattern.capability && <CapabilityBadge capabilityKey={pattern.capability} size="small" />}
              </div>
              <p className={styles.patternObservation}>{pattern.observation}</p>
            </div>
          ))}
        </div>
      )}

      {data.encouragement && <div className={styles.encouragementCard}>{data.encouragement}</div>}
    </div>
  );
}

export default function Summaries() {
  const [tab, setTab] = useState('weekly');

  return (
    <div className={styles.page}>
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${tab === 'weekly' ? styles.tabActive : ''}`}
          onClick={() => setTab('weekly')}
        >
          Weekly
        </button>
        <button
          type="button"
          className={`${styles.tab} ${tab === 'monthly' ? styles.tabActive : ''}`}
          onClick={() => setTab('monthly')}
        >
          Monthly patterns
        </button>
      </div>

      {tab === 'weekly' ? <WeeklyTab /> : <MonthlyTab />}
    </div>
  );
}
