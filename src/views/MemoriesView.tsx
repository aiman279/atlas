import { motion } from 'framer-motion';
import { useAtlas } from '../hooks/useAtlas';

function formatMonth(date: string) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function MemoriesView({
  onOpen,
}: {
  onOpen: (id: string) => void;
}) {
  const { data } = useAtlas();
  const sorted = [...data.memories].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="page memories-page">
      <header className="page-head">
        <h1>Memories</h1>
        <p className="page-lead">Moments that stay with you.</p>
      </header>

      <ul className="memory-feed">
        {sorted.map((mem, i) => (
          <motion.li
            key={mem.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.35 }}
          >
            <button
              type="button"
              className="memory-card"
              onClick={() => onOpen(mem.id)}
            >
              <p className="memory-when">{formatMonth(mem.date)}</p>
              <div className="memory-media">
                <img src={mem.image} alt="" />
              </div>
              <div className="memory-meta">
                <h2>{mem.title}</h2>
                <p>{mem.location}</p>
              </div>
              <p className="memory-feeling">{mem.feeling}</p>
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
