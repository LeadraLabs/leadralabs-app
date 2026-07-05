import { getCapability } from '../../config/capabilities';
import styles from './CapabilityIcon.module.css';

const ICON_SIZE = {
  large: 28,
  small: 16,
};

export default function CapabilityIcon({ capabilityKey, size = 'large' }) {
  const capability = getCapability(capabilityKey);

  if (!capability) return null;

  const Icon = capability.icon;

  return (
    <span
      className={`${styles.container} ${size === 'small' ? styles.small : styles.large}`}
      style={{ background: capability.tint }}
    >
      <Icon size={ICON_SIZE[size]} weight="regular" color={capability.color} />
    </span>
  );
}
