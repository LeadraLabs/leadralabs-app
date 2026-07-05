import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useApi } from '../../hooks/useApi';
import { CAPABILITIES } from '../../config/capabilities';
import CapabilityIcon from '../../components/CapabilityIcon/CapabilityIcon';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import styles from './Profile.module.css';

const PLAN_LABELS = {
  essentials: 'Essentials',
  professional: 'Professional',
  enhanced: 'Enhanced',
};

function formatMemberSince(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
}

function dayHasEntry(entries, dayOffset) {
  const target = new Date();
  target.setDate(target.getDate() - dayOffset);
  return entries.some((e) => {
    const d = new Date(e.created_at);
    return d.getFullYear() === target.getFullYear() && d.getMonth() === target.getMonth() && d.getDate() === target.getDate();
  });
}

export default function Profile() {
  const { user, signOut } = useAuth();
  const { getProfile, createOrUpdateProfile, getJournalEntries } = useApi();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [entries, setEntries] = useState([]);
  const [fullName, setFullName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const [profileResult, entriesResult] = await Promise.allSettled([getProfile(), getJournalEntries()]);

      if (cancelled) return;

      if (profileResult.status === 'fulfilled') {
        setProfile(profileResult.value);
        setFullName(profileResult.value.full_name || '');
      }
      setEntries(entriesResult.status === 'fulfilled' ? entriesResult.value : []);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [getProfile, getJournalEntries]);

  const handleSaveName = async () => {
    setSaving(true);
    try {
      const updated = await createOrUpdateProfile({
        email: user?.email,
        full_name: fullName,
        primary_capability: profile?.primary_capability,
      });
      setProfile(updated);
      setEditingName(false);
    } catch {
      // keep editing open if it failed
    } finally {
      setSaving(false);
    }
  };

  const handleSelectCapability = async (key) => {
    setSaving(true);
    try {
      const updated = await createOrUpdateProfile({
        email: user?.email,
        full_name: profile?.full_name,
        primary_capability: key,
      });
      setProfile(updated);
    } catch {
      // leave previous selection in place if it failed
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const plan = profile?.plan ? PLAN_LABELS[profile.plan] || profile.plan : 'Essentials';

  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>My details</h2>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Full name</span>
          {editingName ? (
            <div className={styles.editRow}>
              <input
                className={styles.input}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <button type="button" className={styles.saveLink} onClick={handleSaveName} disabled={saving}>
                Save
              </button>
            </div>
          ) : (
            <div className={styles.editRow}>
              <span className={styles.fieldValue}>{profile?.full_name || 'Add your name'}</span>
              <button type="button" className={styles.saveLink} onClick={() => setEditingName(true)}>
                Edit
              </button>
            </div>
          )}
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Email</span>
          <span className={styles.fieldValue}>{user?.email}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Primary capability</span>
          <div className={styles.capabilityGrid}>
            {CAPABILITIES.map((c) => (
              <button
                type="button"
                key={c.key}
                className={`${styles.capabilityCard} ${
                  profile?.primary_capability === c.key ? styles.capabilitySelected : ''
                }`}
                onClick={() => handleSelectCapability(c.key)}
                disabled={saving}
              >
                <CapabilityIcon capabilityKey={c.key} size="large" />
                <span className={styles.capabilityName}>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>My streak</h2>
        <div className={styles.streakDots}>
          {Array.from({ length: 7 }).map((_, i) => {
            const offset = 6 - i;
            const filled = dayHasEntry(entries, offset);
            return <span key={i} className={`${styles.streakDot} ${filled ? styles.streakFilled : ''}`} />;
          })}
        </div>
        <p className={styles.streakStat}>{entries.length} total entries</p>
        {profile?.created_at && (
          <p className={styles.streakStat}>Member since {formatMemberSince(profile.created_at)}</p>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Subscription</h2>
        <span className={styles.planBadge}>{plan}</span>
        {/* TODO: build subscription management UI */}
        <a href="#" className={styles.manageLink}>
          Manage subscription
        </a>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Account</h2>
        <button type="button" className={styles.signOutButton} onClick={signOut}>
          Sign out
        </button>
      </section>
    </div>
  );
}
