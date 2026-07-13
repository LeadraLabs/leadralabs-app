import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';
import { getCapability } from '../../config/capabilities';
import CapabilityIcon from '../../components/CapabilityIcon/CapabilityIcon';
import styles from './Capabilities.module.css';

export default function CapabilityDetail() {
  const { key } = useParams();
  const navigate = useNavigate();
  const capability = getCapability(key);

  if (!capability) {
    return (
      <div className={styles.page}>
        <button type="button" className={styles.backLink} onClick={() => navigate(-1)}>
          <ArrowLeft size={14} weight="regular" color="currentColor" />
          Back
        </button>
        <p className={styles.intro}>We couldn't find that capability.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <button type="button" className={styles.backLink} onClick={() => navigate(-1)}>
        <ArrowLeft size={14} weight="regular" color="currentColor" />
        Back
      </button>

      <div className={styles.detailHeader}>
        <CapabilityIcon capabilityKey={capability.key} size="large" />
        <h1 className={styles.heading}>{capability.name}</h1>
      </div>
      <p className={styles.intro}>{capability.description}</p>

      <div className={styles.card}>
        <div className={styles.cardSection}>
          <span className={styles.cardLabel}>Why it matters</span>
          <p className={styles.cardText}>{capability.whyItMatters}</p>
        </div>
        <div className={styles.cardSection}>
          <span className={styles.cardLabel}>What you'll gain</span>
          <p className={styles.cardText}>{capability.whatYoullGain}</p>
        </div>
      </div>
    </div>
  );
}
