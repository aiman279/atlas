import { motion } from 'framer-motion';
import { useWaypoint } from '../hooks/useWaypoint';

export function ProfileView() {
  const { profile } = useWaypoint();

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="page-title">{profile.name}</h1>
      <p className="page-lead">{profile.role}</p>

      <hr className="rule" />

      <section>
        <p className="label">Travel style</p>
        <p className="profile-value">{profile.travelStyle}</p>
      </section>

      <hr className="rule" />

      <section>
        <p className="label">Preferences</p>
        <p className="profile-value">{profile.preferences.join(' · ')}</p>
      </section>

      <hr className="rule" />

      <section>
        <p className="label">Statistics</p>
        <ul className="stat-lines">
          <li>
            <span>{profile.countriesVisited}</span> countries
          </li>
          <li>
            <span>{profile.totalJourneys}</span> journeys
          </li>
          <li>
            <span>{profile.travelDays}</span> travel days
          </li>
        </ul>
      </section>
    </motion.div>
  );
}
