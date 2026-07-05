import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import { CAPABILITIES } from '../../config/capabilities';
import CapabilityIcon from '../../components/CapabilityIcon/CapabilityIcon';
import styles from './Onboarding.module.css';

const TOTAL_STEPS = 3;

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createOrUpdateProfile } = useApi();

  const [step, setStep] = useState(0);
  const [selectedCapability, setSelectedCapability] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleFinish = async () => {
    if (!selectedCapability) return;
    setSaving(true);
    setError('');
    try {
      await createOrUpdateProfile({
        email: user?.email,
        primary_capability: selectedCapability,
      });
      navigate('/dashboard');
    } catch {
      setError("We couldn't save your focus area — you can also set it later from your profile.");
      navigate('/dashboard');
    } finally {
      setSaving(false);
    }
  };

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
            <div className={styles.capabilityList}>
              {CAPABILITIES.map((c) => (
                <button
                  type="button"
                  key={c.key}
                  className={`${styles.capabilityCard} ${
                    selectedCapability === c.key ? styles.capabilitySelected : ''
                  }`}
                  onClick={() => setSelectedCapability(c.key)}
                >
                  <CapabilityIcon capabilityKey={c.key} size="large" />
                  <span className={styles.capabilityText}>
                    <span className={styles.capabilityName}>{c.name}</span>
                    <span className={styles.capabilityDescription}>{c.description}</span>
                  </span>
                </button>
              ))}
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        {step < TOTAL_STEPS - 1 ? (
          <button type="button" className={styles.primaryButton} onClick={() => setStep((s) => s + 1)}>
            Next
          </button>
        ) : (
          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleFinish}
            disabled={!selectedCapability || saving}
          >
            {saving ? 'Saving...' : "Let's go"}
          </button>
        )}
      </div>
    </div>
  );
}
