import { motion } from 'framer-motion';
import { formatMoney } from '../data/atlas';
import { useAtlas } from '../hooks/useAtlas';
import { BackButton, PageHeader } from '../components/ui';

const priorityLabel = {
  high: 'High priority',
  medium: 'Medium',
  low: 'Someday',
};

export function DreamsView({ onBack }: { onBack: () => void }) {
  const { data } = useAtlas();
  const dreams = [...data.dreams].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <div className="view">
      <BackButton onClick={onBack} label="Home" />
      <PageHeader
        eyebrow="Future dream board"
        title="Dreams"
        subtitle="Not just places — reasons your heart leans forward."
      />
      <div className="stack-lg">
        {dreams.map((dream, i) => (
          <motion.article
            key={dream.id}
            className="dream-card card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div
              className="dream-cover"
              style={{ backgroundImage: `url(${dream.coverImage})` }}
            />
            <div className="dream-body">
              <p className="eyebrow">{priorityLabel[dream.priority]}</p>
              <h3>
                {dream.flag} {dream.country}
              </h3>
              <p className="dream-why">“{dream.why}”</p>
              <div className="journey-meta-row">
                <span>{formatMoney(dream.estimatedBudget)}</span>
                <span>Target {dream.targetYear}</span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
