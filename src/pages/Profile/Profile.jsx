import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
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

const CAREER_LEVELS = [
  { value: 'entry_level', label: 'Entry-level' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'mid_level', label: 'Mid-level' },
  { value: 'senior_level', label: 'Senior-level' },
];

const MANAGEMENT_OPTIONS = [
  { value: false, label: 'Individual contributor' },
  { value: true, label: 'I have direct reports' },
];

export default function Profile() {
  const { user, signOut } = useAuth();
  const { getProfile, createOrUpdateProfile } = useApi();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingField, setSavingField] = useState(null);

  const [developmentGoals, setDevelopmentGoals] = useState('');
  const [currentContext, setCurrentContext] = useState('');
  const [selfRatings, setSelfRatings] = useState({});
  const savedGoalsRef = useRef('');
  const savedContextRef = useRef('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await getProfile();
        if (cancelled) return;
        setProfile(data);
        setFullName(data.full_name || '');
        setDevelopmentGoals(data.development_goals || '');
        setCurrentContext(data.current_context || '');
        savedGoalsRef.current = data.development_goals || '';
        savedContextRef.current = data.current_context || '';
        const ratings = {};
        CAPABILITIES.forEach((c) => {
          ratings[c.key] = data.capability_self_ratings?.[c.key] ?? 3;
        });
        setSelfRatings(ratings);
      } catch {
        // leave profile null; screen still renders with sign-out available
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [getProfile]);

  const saveProfile = async (overrides) => {
    const updated = await createOrUpdateProfile({
      email: user?.email,
      full_name: profile?.full_name,
      primary_capabilities: profile?.primary_capabilities,
      career_level: profile?.career_level,
      manages_others: profile?.manages_others,
      development_goals: profile?.development_goals,
      current_context: profile?.current_context,
      capability_self_ratings: profile?.capability_self_ratings,
      ...overrides,
    });
    setProfile(updated);
    return updated;
  };

  const handleSaveName = async () => {
    setSaving(true);
    try {
      await saveProfile({ full_name: fullName });
      setEditingName(false);
    } catch {
      // keep editing open if it failed
    } finally {
      setSaving(false);
    }
  };

  const handleToggleCapability = async (key) => {
    const current = profile?.primary_capabilities || [];
    const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
    setSavingField(`capability:${key}`);
    try {
      await saveProfile({ primary_capabilities: next });
    } catch {
      // leave previous selection in place if it failed
    } finally {
      setSavingField(null);
    }
  };

  const handleSelectCareerLevel = async (value) => {
    setSavingField('career_level');
    try {
      await saveProfile({ career_level: value });
    } catch {
      // leave previous value in place if it failed
    } finally {
      setSavingField(null);
    }
  };

  const handleSelectManagesOthers = async (value) => {
    setSavingField('manages_others');
    try {
      await saveProfile({ manages_others: value });
    } catch {
      // leave previous value in place if it failed
    } finally {
      setSavingField(null);
    }
  };

  const handleGoalsBlur = async () => {
    if (developmentGoals === savedGoalsRef.current) return;
    setSavingField('development_goals');
    try {
      await saveProfile({ development_goals: developmentGoals });
      savedGoalsRef.current = developmentGoals;
    } catch {
      // leave the typed value in place if it failed
    } finally {
      setSavingField(null);
    }
  };

  const handleContextBlur = async () => {
    if (currentContext === savedContextRef.current) return;
    setSavingField('current_context');
    try {
      await saveProfile({ current_context: currentContext });
      savedContextRef.current = currentContext;
    } catch {
      // leave the typed value in place if it failed
    } finally {
      setSavingField(null);
    }
  };

  const handleRatingChange = (key, value) => {
    setSelfRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleRatingCommit = async (key) => {
    setSavingField(`rating:${key}`);
    try {
      await saveProfile({ capability_self_ratings: { ...profile?.capability_self_ratings, ...selfRatings } });
    } catch {
      // leave the local rating in place if it failed
    } finally {
      setSavingField(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  const plan = profile?.plan ? PLAN_LABELS[profile.plan] || profile.plan : 'Essentials';
  const selectedCapabilities = profile?.primary_capabilities || [];

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
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>My development</h2>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Priority focus areas</span>
          <div className={styles.capabilityGrid}>
            {CAPABILITIES.map((c) => (
              <button
                type="button"
                key={c.key}
                className={`${styles.capabilityCard} ${
                  selectedCapabilities.includes(c.key) ? styles.capabilitySelected : ''
                }`}
                onClick={() => handleToggleCapability(c.key)}
                disabled={savingField === `capability:${c.key}`}
              >
                <CapabilityIcon capabilityKey={c.key} size="large" />
                <span className={styles.capabilityName}>{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Career level</span>
          <div className={styles.pillRow}>
            {CAREER_LEVELS.map((option) => (
              <button
                type="button"
                key={option.value}
                className={`${styles.pill} ${profile?.career_level === option.value ? styles.pillSelected : ''}`}
                onClick={() => handleSelectCareerLevel(option.value)}
                disabled={savingField === 'career_level'}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>People management</span>
          <div className={styles.pillRow}>
            {MANAGEMENT_OPTIONS.map((option) => (
              <button
                type="button"
                key={option.label}
                className={`${styles.pill} ${
                  profile?.manages_others === option.value ? styles.pillSelected : ''
                }`}
                onClick={() => handleSelectManagesOthers(option.value)}
                disabled={savingField === 'manages_others'}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>What do you want to get better at?</span>
          <textarea
            className={styles.textarea}
            value={developmentGoals}
            onChange={(e) => setDevelopmentGoals(e.target.value)}
            onBlur={handleGoalsBlur}
            rows={3}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>What's going on for you right now?</span>
          <p className={styles.fieldHelper}>
            Flag anything that's coming up so your growth moments can be tailored to you, e.g. starting a
            new job, finishing my degree, prepping for senior-level interviews, working with a difficult
            colleague.
          </p>
          <textarea
            className={styles.textarea}
            value={currentContext}
            onChange={(e) => setCurrentContext(e.target.value)}
            onBlur={handleContextBlur}
            rows={3}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Where are you at right now?</span>
          <p className={styles.fieldHelper}>Rate yourself as honestly as you can.</p>
          <div className={styles.ratingList}>
            {CAPABILITIES.map((c) => (
              <div className={styles.ratingRow} key={c.key}>
                <div className={styles.ratingHeader}>
                  <CapabilityIcon capabilityKey={c.key} size="small" />
                  <Link to={`/capabilities/${c.key}`} className={styles.ratingName}>
                    {c.name}
                  </Link>
                  <span className={styles.ratingValue}>{selfRatings[c.key] ?? 3}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  className={styles.slider}
                  style={{ accentColor: c.color }}
                  value={selfRatings[c.key] ?? 3}
                  onChange={(e) => handleRatingChange(c.key, Number(e.target.value))}
                  onMouseUp={() => handleRatingCommit(c.key)}
                  onTouchEnd={() => handleRatingCommit(c.key)}
                />
                <div className={styles.sliderScaleLabels}>
                  <span>Very poor</span>
                  <span>Excellent</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link to="/capabilities" className={styles.capabilitiesLink}>
          Learn about Leadership Capabilities
          <ArrowRight size={14} weight="regular" color="currentColor" />
        </Link>
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
