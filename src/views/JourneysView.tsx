import { motion } from 'framer-motion';
import { journeysByYear } from '../data/waypoint';
import { useWaypoint } from '../hooks/useWaypoint';

export function JourneysView({ onOpen }: { onOpen: (id: string) => void }) {
  const data = useWaypoint();
  const years = journeysByYear(data);

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="page-title">Journeys</h1>
      <p className="page-lead">Your adventures as chapters</p>

      <div className="timeline">
        {years.map(([year, list]) => (
          <section key={year} className="year-block">
            <h2 className="year">{year}</h2>
            <div className="journey-list">
              {list.map((j) => (
                <button
                  key={j.id}
                  type="button"
                  className="journey-row"
                  onClick={() => onOpen(j.id)}
                >
                  <img src={j.coverImage} alt="" className="journey-thumb" />
                  <div className="journey-meta">
                    <h3>
                      {j.flag} {j.country}
                    </h3>
                    <p>{j.cities.join(' · ')}</p>
                    <p className="journey-days">{j.durationDays} days</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </motion.div>
  );
}
