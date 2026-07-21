import { motion } from 'framer-motion';
import { useNorth } from '../hooks/useNorth';

export function GoalsView({ onOpen }: { onOpen: (id: string) => void }) {
  const { data } = useNorth();

  return (
    <div className="page">
      <header className="page-head">
        <h1>Goals</h1>
        <p className="page-lead">Dreams turned into missions.</p>
      </header>

      <ul className="goal-mission-list">
        {data.goals.map((g, i) => (
          <motion.li
            key={g.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <button
              type="button"
              className="glass goal-mission"
              onClick={() => onOpen(g.id)}
            >
              <div className="goal-mission-top">
                <span aria-hidden>{g.icon}</span>
                <h2>{g.title}</h2>
              </div>
              <p className="goal-vision">“{g.vision}”</p>
              <div className="goal-stats">
                <span>{g.currentLabel}</span>
                <span className="dim">→</span>
                <span>{g.targetLabel}</span>
              </div>
              <div className="meter">
                <span style={{ width: `${g.progress * 100}%` }} />
              </div>
              <p className="goal-pct">{Math.round(g.progress * 100)}%</p>
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
