import { motion } from 'framer-motion';
import { formatMoney } from '../data/waypoint';
import { useWaypoint } from '../hooks/useWaypoint';
import { PageHeader, Pill } from '../components/ui';

const tone = {
  High: 'amber' as const,
  Medium: 'blue' as const,
  Low: 'neutral' as const,
};

export function ExploreView() {
  const { data } = useWaypoint();
  const destinations = [...data.destinations].sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <div className="view">
      <PageHeader
        eyebrow="Adventure board"
        title="Explore"
        subtitle="Destinations with a reason — not just a pin on a map."
      />
      <div className="explore-grid">
        {destinations.map((d, i) => (
          <motion.article
            key={d.id}
            className="explore-card"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div
              className="explore-cover"
              style={{ backgroundImage: `url(${d.coverImage})` }}
            >
              <Pill tone={tone[d.priority]}>{d.priority}</Pill>
            </div>
            <div className="explore-body">
              <h3>
                {d.flag} {d.country}
              </h3>
              <p className="why">“{d.why}”</p>
              <div className="meta-row">
                <span>{formatMoney(d.estimatedBudget)}</span>
                <span>{d.targetYear}</span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
