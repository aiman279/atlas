import { motion } from 'framer-motion';
import { chapterLabel, formatMonthYear, formatMoney } from '../data/atlas';
import type { Journey } from '../data/types';
import { useAtlas } from '../hooks/useAtlas';
import { Card, PageHeader } from '../components/ui';

export function JourneysView({
  onOpen,
}: {
  onOpen: (id: string) => void;
}) {
  const { data } = useAtlas();
  const journeys = [...data.journeys].sort((a, b) => a.chapter - b.chapter);

  return (
    <div className="view">
      <PageHeader
        eyebrow="Travel chapters"
        title="Journeys"
        subtitle="Each journey is a chapter of life — not just a destination."
      />
      <div className="stack-lg">
        {journeys.map((journey, i) => (
          <motion.div
            key={journey.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
          >
            <JourneyCard journey={journey} onOpen={() => onOpen(journey.id)} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function JourneyCard({
  journey,
  onOpen,
}: {
  journey: Journey;
  onOpen: () => void;
}) {
  return (
    <Card className="journey-card" onClick={onOpen}>
      <div
        className="journey-cover"
        style={{ backgroundImage: `url(${journey.coverImage})` }}
      >
        <span className="journey-badge">{chapterLabel(journey.chapter)}</span>
        {journey.status === 'upcoming' && (
          <span className="journey-status">Upcoming</span>
        )}
      </div>
      <div className="journey-body">
        <h3>
          {journey.flag} {journey.country}
        </h3>
        <p className="journey-quote">“{journey.tagline}”</p>
        <div className="journey-meta-row">
          <span>{formatMonthYear(journey.startDate)}</span>
          <span>{journey.durationDays} days</span>
          <span>{formatMoney(journey.budget)}</span>
        </div>
      </div>
    </Card>
  );
}
