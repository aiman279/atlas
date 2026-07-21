import { motion } from 'framer-motion';
import { NorthLogo } from '../components/NorthLogo';
import { useNorth } from '../hooks/useNorth';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function CommandView() {
  const { data } = useNorth();
  const { profile, lifeAreas, today } = data;

  return (
    <div className="page command-page">
      <header className="os-brand">
        <motion.div
          className="brand-row"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <NorthLogo size={30} />
          <p className="brand-mark">North OS</p>
        </motion.div>
        <motion.p
          className="os-greeting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.06 }}
        >
          {greeting()}, {profile.name}
        </motion.p>
      </header>

      <motion.section
        className="glass state-panel"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <p className="eyebrow">Current state</p>
        <h1>{profile.currentState}</h1>
        <p className="state-note">“{profile.stateNote}”</p>
      </motion.section>

      <motion.section
        className="balance-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.18 }}
      >
        <p className="eyebrow">Life balance</p>
        <ul className="balance-list">
          {lifeAreas.map((area) => (
            <li key={area.id} className="balance-row">
              <div className="balance-label">
                <span aria-hidden>{area.icon}</span>
                <span>{area.label}</span>
                <strong>{Math.round(area.progress * 100)}%</strong>
              </div>
              <div className="meter" aria-hidden>
                <span style={{ width: `${area.progress * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </motion.section>

      <motion.section
        className="glass focus-panel"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26 }}
      >
        <p className="eyebrow">Today’s focus</p>
        <p className="focus-label">Main mission</p>
        <h2>{today.mission}</h2>
        <div className="pulse-row">
          <div>
            <p className="focus-label">Energy</p>
            <p className="pulse-num">
              {today.energy}
              <span>/10</span>
            </p>
          </div>
          <div>
            <p className="focus-label">Mood</p>
            <p className="pulse-mood">{today.mood}</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
