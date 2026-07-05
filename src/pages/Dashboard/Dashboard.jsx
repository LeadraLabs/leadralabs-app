import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PencilSimple } from '@phosphor-icons/react';
import { useAuth } from '../../hooks/useAuth';
import { useApi } from '../../hooks/useApi';
import { formatEntryDate, getTimeOfDayGreeting } from '../../utils/date';
import { MOOD_OPTIONS } from '../../config/moods';
import CapabilityBadge from '../../components/CapabilityBadge/CapabilityBadge';
import NotificationBell from '../../components/NotificationBell/NotificationBell';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import styles from './Dashboard.module.css';

function isToday(dateString) {
  const d = new Date(dateString);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
  );
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function Dashboard() {
  const { user } = useAuth();
  const { getJournalEntries, getRecentInsights, getLatestSummary, getJournalEntry, refreshMicroAction } =
    useApi();

  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [todayInsight, setTodayInsight] = useState(null);
  const [todayEntry, setTodayEntry] = useState(null);
  const [summary, setSummary] = useState(null);
  const [hasSummary, setHasSummary] = useState(false);
  const [mood, setMood] = useState(() => {
    try {
      return localStorage.getItem(`leadra_mood_${todayKey()}`);
    } catch {
      return null;
    }
  });
  const [expandedId, setExpandedId] = useState(null);
  const [expandedDetail, setExpandedDetail] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      const [entriesResult, insightsResult, summaryResult] = await Promise.allSettled([
        getJournalEntries(),
        getRecentInsights(),
        getLatestSummary(),
      ]);

      if (cancelled) return;

      const loadedEntries = entriesResult.status === 'fulfilled' ? entriesResult.value : [];
      setEntries(loadedEntries);

      const todaysEntry = loadedEntries.find((e) => isToday(e.created_at)) || null;
      setTodayEntry(todaysEntry);

      if (todaysEntry && insightsResult.status === 'fulfilled') {
        const matched = insightsResult.value.find((i) => i.journal_entry_id === todaysEntry.id);
        setTodayInsight(matched || null);
      }

      if (summaryResult.status === 'fulfilled') {
        setSummary(summaryResult.value);
        setHasSummary(true);
      } else {
        setHasSummary(false);
      }

      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [getJournalEntries, getRecentInsights, getLatestSummary]);

  const handleMoodTap = (value) => {
    setMood(String(value));
    try {
      localStorage.setItem(`leadra_mood_${todayKey()}`, String(value));
    } catch {
      // ignore storage failures
    }
  };

  const handleRefreshAction = async () => {
    if (!todayInsight) return;
    setRefreshing(true);
    try {
      const result = await refreshMicroAction(todayInsight.id);
      setTodayInsight((prev) => ({
        ...prev,
        current_suggested_action: result.current_suggested_action,
        refreshes_remaining: result.refreshes_remaining,
      }));
    } catch {
      // keep current action if refresh fails
    } finally {
      setRefreshing(false);
    }
  };

  const toggleExpand = useCallback(
    async (entryId) => {
      if (expandedId === entryId) {
        setExpandedId(null);
        setExpandedDetail(null);
        return;
      }
      setExpandedId(entryId);
      setExpandedDetail(null);
      try {
        const detail = await getJournalEntry(entryId);
        setExpandedDetail(detail);
      } catch {
        setExpandedDetail(null);
      }
    },
    [expandedId, getJournalEntry]
  );

  if (loading) return <LoadingSpinner />;

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';
  const recentEntries = entries.slice(0, 3);
  const summaryPreview = summary?.summary
    ? summary.summary.split('. ').slice(0, 2).join('. ') + (summary.summary.includes('.') ? '.' : '')
    : '';

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.greeting}>
          {getTimeOfDayGreeting()}, {firstName} 👋
        </h1>
        <NotificationBell />
      </div>

      {todayInsight ? (
        <div className={styles.focusCard}>
          <p className={styles.focusLabel}>Today's micro-action</p>
          <p className={styles.focusAction}>{todayInsight.current_suggested_action}</p>
          {todayInsight.refreshes_remaining > 0 && (
            <button type="button" className={styles.refreshLink} onClick={handleRefreshAction} disabled={refreshing}>
              ↻ Try a different one ({todayInsight.refreshes_remaining} left)
            </button>
          )}
        </div>
      ) : todayEntry ? (
        <div className={styles.focusCard}>
          <p className={styles.focusLabel}>Today's micro-action</p>
          <p className={styles.focusAction}>
            Your entry is saved — we're still putting together today's insight.
          </p>
        </div>
      ) : (
        <div className={styles.promptCard}>
          <p className={styles.promptText}>What moment shaped your day so far?</p>
          <Link to="/journal" className={styles.promptLink}>
            Write about it →
          </Link>
        </div>
      )}

      <div className={styles.moodSection}>
        <p className={styles.sectionLabel}>How are you feeling right now?</p>
        <div className={styles.moodRow}>
          {MOOD_OPTIONS.map((m) => (
            <button
              key={m.value}
              type="button"
              className={`${styles.moodButton} ${mood === String(m.value) ? styles.moodSelected : ''}`}
              onClick={() => handleMoodTap(m.value)}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.summarySection}>
        <p className={styles.sectionLabel}>This week's summary</p>
        {hasSummary ? (
          <div className={styles.summaryCard}>
            <p className={styles.summaryText}>{summaryPreview}</p>
            <Link to="/summaries" className={styles.summaryLink}>
              Read more →
            </Link>
          </div>
        ) : (
          <div className={styles.summaryEmpty}>
            Your first weekly summary will appear after your first full week.
          </div>
        )}
      </div>

      <div className={styles.entriesSection}>
        <p className={styles.sectionLabel}>Recent journal entries</p>
        {recentEntries.length === 0 && <p className={styles.emptyNote}>No entries yet.</p>}
        {recentEntries.map((entry) => (
          <div key={entry.id} className={styles.entryCard} onClick={() => toggleExpand(entry.id)}>
            <div className={styles.entryHeader}>
              {entry.capability && <CapabilityBadge capabilityKey={entry.capability} size="small" />}
              <span className={styles.entryDate}>{formatEntryDate(entry.created_at)}</span>
            </div>
            <p className={styles.entryPreview}>
              {entry.content.length > 80 ? `${entry.content.slice(0, 80)}...` : entry.content}
            </p>
            {expandedId === entry.id && (
              <div className={styles.entryExpanded}>
                {expandedDetail ? (
                  <>
                    <p className={styles.entryFull}>{expandedDetail.entry.content}</p>
                    {expandedDetail.insight && (
                      <p className={styles.entryInsightNote}>{expandedDetail.insight.coaching_note}</p>
                    )}
                  </>
                ) : (
                  <LoadingSpinner />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <Link to="/journal" className={styles.journalButton}>
        <PencilSimple size={18} weight="bold" color="currentColor" />
        Write today's entry
      </Link>
    </div>
  );
}
