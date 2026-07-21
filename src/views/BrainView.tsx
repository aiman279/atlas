import { motion } from 'framer-motion';
import { useNorth } from '../hooks/useNorth';

export function BrainView() {
  const { data } = useNorth();

  return (
    <div className="page">
      <header className="page-head">
        <h1>Brain</h1>
        <p className="page-lead">Your personal knowledge vault.</p>
      </header>

      <ul className="brain-list">
        {data.brain.map((item, i) => (
          <motion.li
            key={item.id}
            className="glass brain-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <div className="brain-meta">
              <span className="chip">{item.category}</span>
              {item.potential && (
                <span className="chip soft">{item.potential}</span>
              )}
              <span className="brain-date">{item.date}</span>
            </div>
            <h2>{item.title}</h2>
            <p>{item.content}</p>
            {(item.related || item.tags.length > 0) && (
              <div className="brain-tags">
                {item.related && <span>Related · {item.related}</span>}
                {item.tags.map((t) => (
                  <span key={t}>#{t}</span>
                ))}
              </div>
            )}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
