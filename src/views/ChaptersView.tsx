import { motion } from 'framer-motion';
import { useAtlas } from '../hooks/useAtlas';

export function ChaptersView({
  onOpen,
}: {
  onOpen: (id: string) => void;
}) {
  const { data } = useAtlas();
  const sorted = [...data.chapters].sort((a, b) => b.number - a.number);

  return (
    <div className="page chapters-page">
      <header className="page-head">
        <p className="brand-mark soft">Atlas</p>
        <h1>Chapters</h1>
        <p className="page-lead">
          Periods of your life, told like a book.
        </p>
      </header>

      <ul className="chapter-list">
        {sorted.map((ch, i) => (
          <motion.li
            key={ch.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
          >
            <button
              type="button"
              className="chapter-card"
              onClick={() => onOpen(ch.id)}
            >
              <div className="chapter-cover">
                <img src={ch.coverImage} alt="" />
              </div>
              <div className="chapter-meta">
                <p className="eyebrow">Chapter {ch.number}</p>
                <h2>{ch.title}</h2>
                <p className="chapter-period">{ch.period}</p>
                <p className="chapter-story">{ch.story}</p>
              </div>
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
