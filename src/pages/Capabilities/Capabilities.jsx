import { CAPABILITIES } from '../../config/capabilities';
import CapabilityIcon from '../../components/CapabilityIcon/CapabilityIcon';
import styles from './Capabilities.module.css';

export default function Capabilities() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Leadership capabilities</h1>
      <p className={styles.intro}>
        LEADRA is built around five capabilities that shape how you show up as a leader.
      </p>

      <div className={styles.list}>
        {CAPABILITIES.map((c) => (
          <div className={styles.card} key={c.key}>
            <div className={styles.cardHeader}>
              <CapabilityIcon capabilityKey={c.key} size="large" />
              <span className={styles.cardName}>{c.name}</span>
            </div>
            <div className={styles.cardSection}>
              <span className={styles.cardLabel}>Why it matters</span>
              {/* NOVA: edit copy here */}
              <p className={styles.cardText}>{c.whyItMatters}</p>
            </div>
            <div className={styles.cardSection}>
              <span className={styles.cardLabel}>What you'll gain</span>
              {/* NOVA: edit copy here */}
              <p className={styles.cardText}>{c.whatYoullGain}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
