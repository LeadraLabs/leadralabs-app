import { Link, useLocation } from 'react-router-dom';
import { Sparkle } from '@phosphor-icons/react';
import InsightCard from '../../components/InsightCard/InsightCard';
import styles from './Journal.module.css';

export default function JournalSuccess() {
  const location = useLocation();
  const insight = location.state?.insight;

  if (!insight) {
    return (
      <div className={styles.savedNotice}>
        <p className={styles.savedHeading}>We lost track of that insight</p>
        <p className={styles.savedBody}>
          Refreshing this page clears it from memory for now, you can find it in your recent reflections
          instead.
        </p>
        <Link to="/insights" className={styles.savedButton}>
          Go to reflections
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.writePage}>
      <h1 className={styles.heading}>
        Insight ready <Sparkle size={20} weight="regular" color="var(--gold)" />
      </h1>
      <InsightCard insight={insight} />
      <Link to="/dashboard" className={styles.savedButton}>
        Back to dashboard
      </Link>
      <Link to="/journal" className={styles.backLink} style={{ alignSelf: 'center' }}>
        Write another entry
      </Link>
    </div>
  );
}
