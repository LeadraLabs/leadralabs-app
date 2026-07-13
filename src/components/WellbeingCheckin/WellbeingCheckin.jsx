import { Star } from '@phosphor-icons/react';
import styles from './WellbeingCheckin.module.css';

const MOOD_TAGS = ['Energized', 'Focused', 'Challenged', 'Reflective', 'Frustrated'];

const WELLBEING_SLIDERS = [
  { key: 'wellbeing_sleep_quality', label: 'Sleep Quality' },
  { key: 'wellbeing_nutrition', label: 'Nutrition' },
  { key: 'wellbeing_movement', label: 'Movement' },
  { key: 'wellbeing_stress_load', label: 'Stress Load' },
  { key: 'wellbeing_physical_health', label: 'Physical Health' },
  { key: 'wellbeing_relationships', label: 'Relationships' },
];

export default function WellbeingCheckin({ moodTags, setMoodTags, growthRating, setGrowthRating, wellbeing, setWellbeing }) {
  const toggleMoodTag = (tag) => {
    setMoodTags(moodTags.includes(tag) ? moodTags.filter((t) => t !== tag) : [...moodTags, tag]);
  };

  const setWellbeingValue = (key, value) => {
    setWellbeing((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={styles.checkin}>
      <div className={styles.moodTagRow}>
        {MOOD_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`${styles.moodTag} ${moodTags.includes(tag) ? styles.moodTagSelected : ''}`}
            onClick={() => toggleMoodTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className={styles.growthRating}>
        <span className={styles.growthLabel}>Growth Rating</span>
        <div className={styles.stars}>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              type="button"
              className={styles.starButton}
              onClick={() => setGrowthRating(growthRating === n ? null : n)}
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
            >
              <Star
                size={24}
                weight={growthRating && n <= growthRating ? 'fill' : 'regular'}
                color={growthRating && n <= growthRating ? 'var(--gold)' : 'var(--text-light)'}
              />
            </button>
          ))}
        </div>
      </div>

      <div className={styles.wellbeingBlock}>
        <p className={styles.wellbeingHeading}>Today's Wellbeing (optional, informs AI insights)</p>
        <div className={styles.wellbeingList}>
          {WELLBEING_SLIDERS.map((w) => (
            <div className={styles.wellbeingRow} key={w.key}>
              <div className={styles.wellbeingRowHeader}>
                <span className={styles.wellbeingName}>{w.label}</span>
                <span className={styles.wellbeingValue}>{wellbeing[w.key] ?? '-'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                className={styles.slider}
                value={wellbeing[w.key] ?? 3}
                onChange={(e) => setWellbeingValue(w.key, Number(e.target.value))}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
