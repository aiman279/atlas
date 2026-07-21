import { motion } from 'framer-motion';
import { useAtlas } from '../hooks/useAtlas';

const kindLabel = {
  achievement: 'Achievement',
  decision: 'Decision',
  experience: 'Experience',
  lesson: 'Lesson',
} as const;

export function ChapterDetailView({
  chapterId,
  onBack,
}: {
  chapterId: string;
  onBack: () => void;
}) {
  const { data } = useAtlas();
  const chapter = data.chapters.find((c) => c.id === chapterId);
  if (!chapter) {
    return (
      <div className="page">
        <button type="button" className="back-link" onClick={onBack}>
          Back
        </button>
        <p>Chapter not found.</p>
      </div>
    );
  }

  return (
    <div className="page chapter-detail">
      <button type="button" className="back-link" onClick={onBack}>
        Back
      </button>

      <motion.div
        className="chapter-detail-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <img src={chapter.coverImage} alt="" />
      </motion.div>

      <div className="chapter-detail-copy">
        <p className="eyebrow">Chapter {chapter.number}</p>
        <h1>{chapter.title}</h1>
        <p className="period">{chapter.period}</p>
      </div>

      <section className="chapter-story-block">
        <p className="editorial">{chapter.story}</p>
      </section>

      <section className="moments-section">
        <h2>Moments</h2>
        <ul className="moment-list">
          {chapter.moments.map((m, i) => (
            <motion.li
              key={m.id}
              className="moment-item"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.04 }}
            >
              <p className="eyebrow">{kindLabel[m.kind]}</p>
              <h3>{m.title}</h3>
              <p className="moment-date">{m.date}</p>
              <p className="moment-reflection">{m.reflection}</p>
            </motion.li>
          ))}
        </ul>
      </section>
    </div>
  );
}
