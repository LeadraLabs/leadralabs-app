import { useEffect, useRef, useState } from 'react';
import { Bell } from '@phosphor-icons/react';
import { useApi } from '../../hooks/useApi';
import styles from './NotificationBell.module.css';

function formatNotificationText(notification) {
  return notification.message || notification.title || notification.body || 'You have a new notification.';
}

export default function NotificationBell() {
  const { getNotifications, markNotificationRead, markAllNotificationsRead } = useApi();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    getNotifications()
      .then((data) => {
        if (!cancelled) setNotifications(data || []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [getNotifications]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleRead = async (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await markNotificationRead(id);
    } catch {
      // notification will simply reappear next fetch if this failed
    }
  };

  const handleReadAll = async () => {
    setNotifications([]);
    try {
      await markAllNotificationsRead();
    } catch {
      // best effort
    }
  };

  return (
    <div className={styles.wrapper} ref={panelRef}>
      <button
        type="button"
        className={styles.bellButton}
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
      >
        <Bell size={22} weight="regular" color="var(--navy)" />
        {notifications.length > 0 && <span className={styles.dot} />}
      </button>
      {open && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span>Notifications</span>
            {notifications.length > 0 && (
              <button type="button" className={styles.readAll} onClick={handleReadAll}>
                Mark all read
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className={styles.empty}>You're all caught up.</p>
          ) : (
            <ul className={styles.list}>
              {notifications.map((n) => (
                <li key={n.id} className={styles.item} onClick={() => handleRead(n.id)}>
                  {formatNotificationText(n)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
