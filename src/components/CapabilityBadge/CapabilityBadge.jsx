import { getCapability } from '../../config/capabilities';
import styles from './CapabilityBadge.module.css';

export default function CapabilityBadge({ capabilityKey, size = 'medium' }) {
  const capability = getCapability(capabilityKey);

  if (!capability) return null;

  return (
    <span
      className={`${styles.badge} ${size === 'small' ? styles.small : ''}`}
      style={{ background: capability.tint }}
    >
      <span className={styles.icon}>{capability.icon}</span>
      <span className={styles.name}>{capability.name}</span>
    </span>
  );
}
