import { motion } from 'framer-motion';
import {
  daysUntil,
  formatMoney,
  greeting,
  nextJourney,
} from '../data/waypoint';
import type { AppView } from '../data/types';
import { useWaypoint } from '../hooks/useWaypoint';

export function HomeView({
  onNavigate,
}: {
  onNavigate: (v: AppView, id?: string) => void;
}) {
  const data = useWaypoint();
  const next = nextJourney(data);
  const days = Math.max(0, daysUntil(next.startDate));

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <p className="wordmark">Waypoint</p>
      <h1 className="greet">
        {greeting()}, {data.profile.name}
      </h1>

      <hr className="rule" />

      <button
        type="button"
        className="block-link"
        onClick={() => onNavigate('journey-detail', next.id)}
      >
        <p className="label">Next Journey</p>
        <h2 className="block-title">{next.country}</h2>
        <p className="block-meta">{days} days away</p>
      </button>

      <hr className="rule" />

      <div>
        <p className="label">Travel Fund</p>
        <p className="fund-amount">
          {formatMoney(data.fund.saved, data.fund.currency)}
        </p>
        <p className="block-meta">
          of {formatMoney(data.fund.target, data.fund.currency)}
        </p>
      </div>

      <hr className="rule" />

      <div>
        <p className="label">My Journey</p>
        <ul className="stat-lines">
          <li>
            <span>{data.profile.countriesVisited}</span> countries
          </li>
          <li>
            <span>{data.profile.totalJourneys}</span> journeys
          </li>
          <li>
            <span>{data.profile.travelDays}</span> days
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
