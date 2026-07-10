import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import { CAPABILITIES } from '../../config/capabilities';
import CapabilityIcon from '../../components/CapabilityIcon/CapabilityIcon';
import styles from './Onboarding.module.css';

const TOTAL_STEPS = 4;

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

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createOrUpdateProfile } = useApi();

  const [step, setStep] = useState(0);
  const [selectedCapabilities, setSelectedCapabilities] = useState([]);
  const [careerLevel, setCareerLevel] = useState(null);
  const [managesOthers, setManagesOthers] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toggleCapability = (key) => {
    setSelectedCapabilities((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleFinish = async () => {
    if (!selectedCapabilities.length || !careerLevel || managesOthers === null) return;
    setSaving(true);
    setError('');
    try {
      await createOrUpdateProfile({
        email: user?.email,
        primary_capabilities: selectedCapabilities,
        career_level: careerLevel,
        manages_others: managesOthers,
      });
      navigate('/dashboard');
    } catch {
      setError("We couldn't save your details — you can also set them later from your profile.");
      navigate('/dashboard');
    } finally {
      setSaving(false);
    }
  };

  const isLastStep = step === TOTAL_STEPS - 1;
  const canAdvance =
    step !== 2 || selectedCapabilities.length > 0;
  const canFinish = selectedCapabilities.length > 0 && careerLevel && managesOthers !== null;

  return (
    <div className={styles.page}>
      <div className={styles.dots}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <span key={i} className={`${styles.dot} ${i === step ? styles.dotActive : ''}`} />
        ))}
      </div>

      <div className={styles.card}>
        {step === 0 && (
          <div>
            <h1 className={styles.heading}>Welcome to LEADRA.</h1>
            <p className={styles.body}>
              You're here because leadership matters to you. This app will help you build it — one moment
              at a time.
            </p>
            <div className={styles.iconGrid}>
              {CAPABILITIES.map((c) => (
                <CapabilityIcon key={c.key} capabilityKey={c.key} size="large" />
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className={styles.heading}>How LEADRA works</h1>
            <ul className={styles.pointList}>
              <li>
                <span className={styles.bullet} />
                Write about a real moment from your day
              </li>
              <li>
                <span className={styles.bullet} />
                Get a personal insight and micro-action
              </li>
              <li>
                <span className={styles.bullet} />
                Build patterns over time
              </li>
            </ul>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className={styles.heading}>What would you like to work on first?</h1>
            <p className={styles.body}>Choose one or more — you can change this any time in your profile.</p>
            <div className={styles.capabilityList}>
              {CAPABILITIES.map((c) => (
                <button
                  type="button"
                  key={c.key}
                  className={`${styles.capabilityCard} ${
                    selectedCapabilities.includes(c.key) ? styles.capabilitySelected : ''
                  }`}
                  onClick={() => toggleCapability(c.key)}
                >
                  <CapabilityIcon capabilityKey={c.key} size="large" />
                  <span className={styles.capabilityText}>
                    <span className={styles.capabilityName}>{c.name}</span>
                    <span className={styles.capabilityDescription}>{c.description}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className={styles.heading}>A bit more about where you're at</h1>

            <p className={styles.fieldLabel}>Career level</p>
            <div className={styles.pillRow}>
              {CAREER_LEVELS.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  className={`${styles.pill} ${careerLevel === option.value ? styles.pillSelected : ''}`}
                  onClick={() => setCareerLevel(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <p className={styles.fieldLabel}>People management</p>
            <div className={styles.pillRow}>
              {MANAGEMENT_OPTIONS.map((option) => (
                <button
                  type="button"
                  key={option.label}
                  className={`${styles.pill} ${managesOthers === option.value ? styles.pillSelected : ''}`}
                  onClick={() => setManagesOthers(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}
      </div>

      <div className={styles.actions}>
        {!isLastStep ? (
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleFinish}
            disabled={!canFinish || saving}
          >
            {saving ? 'Saving...' : "Let's go"}
          </button>
        )}
      </div>
    </div>
  );
}
