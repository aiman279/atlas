import { motion } from 'framer-motion';
import { formatMoney, formatMonthYear } from '../data/waypoint';
import { useWaypoint } from '../hooks/useWaypoint';
import { Card, PageHeader, Pill } from '../components/ui';

const statusTone = {
  preparing: 'amber' as const,
  active: 'blue' as const,
  completed: 'green' as const,
};

export function MissionsView({ onOpen }: { onOpen: (id: string) => void }) {
  const { data } = useWaypoint();
  const missions = [...data.missions].sort((a, b) => {
    if (a.isCurrent) return -1;
    if (b.isCurrent) return 1;
    return b.startDate.localeCompare(a.startDate);
  });

  return (
    <div className="view">
      <PageHeader
        eyebrow="Trip management"
        title="Missions"
        subtitle="Each mission is an adventure — prepare, execute, reflect."
      />
      <div className="stack">
        {missions.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card className="mission-card" onClick={() => onOpen(m.id)}>
              <div
                className="mission-cover"
                style={{ backgroundImage: `url(${m.coverImage})` }}
              />
              <div className="mission-body">
                <div className="mission-top">
                  <p className="eyebrow">Mission</p>
                  <Pill tone={statusTone[m.status]}>
                    {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                  </Pill>
                </div>
                <h3>
                  {m.flag} {m.title}
                </h3>
                <div className="meta-row">
                  <span>{formatMonthYear(m.startDate)}</span>
                  <span>{m.durationDays} days</span>
                  <span>{formatMoney(m.budget)}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
