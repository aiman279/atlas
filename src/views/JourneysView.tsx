import { motion } from 'framer-motion';
import { journeysByYear } from '../data/waypoint';
import { useWaypoint } from '../hooks/useWaypoint';

export function JourneysView({ onOpen }: { onOpen: (id: string) => void }) {
  const data = useWaypoint();
  const years = journeysByYear(data);

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="page-title">Journeys</h1>
      <p className="page-lead">Adventures as chapters.</p>

      <div className="timeline">
        {years.map(([year, list]) => (
          <section key={year} className="year-block">
            <h2 className="year">{year}</h2>
            {list.map((j, i) => (
              <div key={j.id}>
                <button
                  type="button"
                  className="timeline-item"
                  onClick={() => onOpen(j.id)}
                >
                  <h3>
                    {j.flag} {j.country}
                  </h3>
                  <p className="block-meta">
                    {j.cities.join(' · ')}
                  </p>
                  <p className="block-meta">{j.durationDays} days</p>
                </button>
                {i < list.length - 1 && <hr className="rule soft" />}
              </div>
            ))}
          </section>
        ))}
      </div>
    </motion.div>
  );
}
