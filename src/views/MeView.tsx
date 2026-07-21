import { motion } from 'framer-motion';
import { useAtlas } from '../hooks/useAtlas';

export function MeView() {
  const { data } = useAtlas();
  const { profile, goals, achievements } = data;

  return (
    <div className="page me-page">
      <header className="page-head me-head">
        <p className="brand-mark soft">Atlas</p>
        {profile.photo ? (
          <img src={profile.photo} alt="" className="me-avatar" />
        ) : (
          <div className="me-avatar me-avatar-fallback" aria-hidden>
            {profile.name.slice(0, 1)}
          </div>
        )}
        <h1>{profile.name}</h1>
        <p className="philosophy">“{profile.philosophy}”</p>
      </header>

      <motion.section
        className="me-section"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <p className="eyebrow">Things I value</p>
        <ul className="value-list">
          {profile.values.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      </motion.section>

      <motion.section
        className="me-section"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
      >
        <p className="eyebrow">Current goals</p>
        <ul className="goal-list">
          {goals.map((g) => (
            <li key={g.id} className="goal-item">
              <div className="goal-top">
                <span aria-hidden>{g.icon}</span>
                <h3>{g.title}</h3>
              </div>
              <p className="goal-desc">{g.description}</p>
              <div
                className="goal-bar"
                role="progressbar"
                aria-valuenow={Math.round(g.progress * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span style={{ width: `${g.progress * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </motion.section>

      <motion.section
        className="me-section"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26 }}
      >
        <p className="eyebrow">Achievements</p>
        <ul className="achievement-list">
          {achievements.map((a) => (
            <li key={a.id} className="achievement-item">
              <h3>{a.title}</h3>
              <p className="moment-date">{a.date}</p>
              <p>{a.description}</p>
              {a.reflection && (
                <p className="moment-reflection">“{a.reflection}”</p>
              )}
            </li>
          ))}
        </ul>
      </motion.section>
    </div>
  );
}
