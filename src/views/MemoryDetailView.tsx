import { motion } from 'framer-motion';
import { useAtlas } from '../hooks/useAtlas';

function formatFull(date: string) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function MemoryDetailView({
  memoryId,
  onBack,
}: {
  memoryId: string;
  onBack: () => void;
}) {
  const { data } = useAtlas();
  const memory = data.memories.find((m) => m.id === memoryId);

  if (!memory) {
    return (
      <div className="page">
        <button type="button" className="back-link" onClick={onBack}>
          Back
        </button>
        <p>Memory not found.</p>
      </div>
    );
  }

  return (
    <div className="page memory-detail">
      <button type="button" className="back-link" onClick={onBack}>
        Back
      </button>

      <motion.div
        className="memory-detail-media"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <img src={memory.image} alt="" />
      </motion.div>

      <motion.div
        className="memory-detail-body"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
      >
        <p className="eyebrow">{formatFull(memory.date)}</p>
        <h1>{memory.title}</h1>
        <p className="memory-loc">{memory.location}</p>
        <p className="editorial">{memory.story}</p>
        <p className="feeling-tag">Feeling · {memory.feeling}</p>
      </motion.div>
    </div>
  );
}
