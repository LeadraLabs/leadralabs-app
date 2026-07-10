import { NavLink } from 'react-router-dom';
import { House, PencilSimple, Lightbulb, CalendarBlank, UserCircle } from '@phosphor-icons/react';
import styles from './BottomNav.module.css';

const TABS = [
  { icon: House, label: 'Dashboard', to: '/dashboard' },
  { icon: PencilSimple, label: 'Journal', to: '/journal' },
  { icon: Lightbulb, label: 'Insights', to: '/insights' },
  { icon: CalendarBlank, label: 'Summaries', to: '/summaries' },
  { icon: UserCircle, label: 'Profile', to: '/profile' },
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
          <tab.icon size={22} weight="regular" color="currentColor" className={styles.icon} />
          <span className={styles.label}>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
