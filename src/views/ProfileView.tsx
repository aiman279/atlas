import { motion } from 'framer-motion';
import { useWaypoint } from '../hooks/useWaypoint';

export function ProfileView() {
  const { profile } = useWaypoint();

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="profile-hero">
        <div className="home-avatar lg">{profile.name.charAt(0)}</div>
        <h1 className="page-title">{profile.name}</h1>
        <p className="page-lead">{profile.role}</p>
      </div>

      <section className="chapter-chip mb">
        <p className="chip-label">Current chapter</p>
        <p className="chip-title">{profile.lifeChapter}</p>
        <p className="chip-note">{profile.chapterNote}</p>
      </section>

      <div className="profile-grid">
        <div className="fund-card">
          <p className="label">Travel style</p>
          <p className="profile-value">{profile.travelStyle}</p>
        </div>
        <div className="fund-card">
          <p className="label">Preferences</p>
          <div className="place-chips">
            {profile.preferences.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
        </div>
      </div>

      <section className="home-section">
        <div className="section-head">
          <h2>Statistics</h2>
        </div>
        <div className="stat-cards">
          <div className="stat-card">
            <p className="stat-num">{profile.countriesVisited}</p>
            <p className="stat-lbl">Countries</p>
          </div>
          <div className="stat-card">
            <p className="stat-num">{profile.totalJourneys}</p>
            <p className="stat-lbl">Journeys</p>
          </div>
          <div className="stat-card">
            <p className="stat-num">{profile.travelDays}</p>
            <p className="stat-lbl">Days</p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
