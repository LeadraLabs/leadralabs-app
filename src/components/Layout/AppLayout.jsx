import { Outlet } from 'react-router-dom';
import BottomNav from '../BottomNav/BottomNav';
import FeedbackButton from '../FeedbackButton/FeedbackButton';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  return (
    <div className={styles.shell}>
      <BottomNav />
      <main className={styles.content}>
        <div className={styles.inner}>
          <Outlet />
        </div>
      </main>
      <FeedbackButton />
    </div>
  );
}
