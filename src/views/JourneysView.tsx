import { motion } from 'framer-motion';
import { formatMoney, formatMonthYear } from '../data/waypoint';
import { useWaypoint } from '../hooks/useWaypoint';
import { Card, PageHeader, Pill } from '../components/ui';

const statusTone = {
  preparing: 'amber' as const,
  active: 'blue' as const,
  completed: 'green' as const,
};

export function JourneysView({ onOpen }: { onOpen: (id: string) => void }) {
  const { data } = useWaypoint();
  const journeys = [...data.journeys].sort((a, b) => {
    if (a.isCurrent) return -1;
    if (b.isCurrent) return 1;
    return b.startDate.localeCompare(a.startDate);
  });

  return (
    <div className="view">
      <PageHeader
        eyebrow="Travel chapters"
        title="Journeys"
        subtitle="Current and previous adventures — your story in chapters."
      />
      <div className="stack">
        {journeys.map((j, i) => (
          <motion.div
            key={j.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card className="mission-card" onClick={() => onOpen(j.id)}>
              <div
                className="mission-cover"
                style={{ backgroundImage: `url(${j.coverImage})` }}
              />
              <div className="mission-body">
                <div className="mission-top">
                  <p className="eyebrow">Journey</p>
                  <Pill tone={statusTone[j.status]}>
                    {j.status.charAt(0).toUpperCase() + j.status.slice(1)}
                  </Pill>
                </div>
                <h3>
                  {j.flag} {j.title}
                </h3>
                <div className="meta-row">
                  <span>{formatMonthYear(j.startDate)}</span>
                  <span>{j.durationDays} days</span>
                  <span>{formatMoney(j.budget)}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
