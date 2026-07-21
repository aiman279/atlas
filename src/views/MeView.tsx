import { motion } from 'framer-motion';
import { useAtlas } from '../hooks/useAtlas';

export function MeView() {
  const { data } = useAtlas();
  const { profile, goals, achievements } = data;

  return (
    <div className="page me-page">
      <header className="page-head me-head">
        {profile.photo ? (
          <img src={profile.photo} alt="" className="me-avatar" />
        ) : (
          <div className="me-avatar me-avatar-fallback" aria-hidden>
            {profile.name.slice(0, 1)}
          </div>
        )}
        <h1>{profile.name}</h1>
        <p className="philosophy">{profile.philosophy}</p>
      </header>

      <motion.section
        className="me-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.08 }}
      >
        <p className="eyebrow">Values</p>
        <ul className="value-list">
          {profile.values.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      </motion.section>

      <motion.section
        className="me-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.14 }}
      >
        <p className="eyebrow">Goals</p>
        <ul className="goal-list">
          {goals.map((g) => (
            <li key={g.id} className="goal-item">
              <div className="goal-top">
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="eyebrow">Achievements</p>
        <ul className="achievement-list">
          {achievements.map((a) => (
            <li key={a.id} className="achievement-item">
              <h3>{a.title}</h3>
              <p className="moment-date">{a.date}</p>
              <p>{a.description}</p>
              {a.reflection && (
                <p className="moment-reflection">{a.reflection}</p>
              )}
            </li>
          ))}
        </ul>
      </motion.section>
    </div>
  );
}
