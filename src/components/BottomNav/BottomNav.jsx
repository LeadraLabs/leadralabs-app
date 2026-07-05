import { NavLink } from 'react-router-dom';
import styles from './BottomNav.module.css';

const TABS = [
  { icon: '🏠', label: 'Home', to: '/dashboard' },
  { icon: '✍️', label: 'Journal', to: '/journal' },
  { icon: '💡', label: 'Insights', to: '/insights' },
  { icon: '📋', label: 'Summaries', to: '/summaries' },
  { icon: '👤', label: 'Profile', to: '/profile' },
];

export default function BottomNav() {
  return (
    <nav className={styles.nav}>
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
        >
          <span className={styles.icon}>{tab.icon}</span>
          <span className={styles.label}>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
