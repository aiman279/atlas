import { motion } from 'framer-motion';
import { formatMonthYear } from '../data/waypoint';
import { useWaypoint } from '../hooks/useWaypoint';

export function JourneyDetailView({
  journeyId,
  onBack,
}: {
  journeyId: string;
  onBack: () => void;
}) {
  const data = useWaypoint();
  const journey = data.journeys.find((j) => j.id === journeyId);

  if (!journey) {
    return (
      <div className="page">
        <button type="button" className="back" onClick={onBack}>
          ← Back
        </button>
        <p className="muted">Journey not found.</p>
      </div>
    );
  }

  return (
    <motion.article
      className="page story"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      <button type="button" className="back" onClick={onBack}>
        ← Journeys
      </button>

      <div
        className="hero-image"
        style={{ backgroundImage: `url(${journey.coverImage})` }}
      />

      <header className="story-header">
        <h1>
          {journey.flag} {journey.country}
        </h1>
        <p className="block-meta">{formatMonthYear(journey.startDate)}</p>
        <p className="block-meta">{journey.durationDays} days</p>
      </header>

      <hr className="rule" />

      <section>
        <p className="label">Places visited</p>
        <p className="places">{journey.placesVisited.join(' · ')}</p>
      </section>

      {journey.photos.length > 0 && (
        <>
          <hr className="rule" />
          <section className="memory-gallery">
            <p className="label">Photo memories</p>
            {journey.photos.map((photo) => (
              <figure key={photo.id} className="memory-figure">
                <img src={photo.url} alt={photo.caption} loading="lazy" />
                <figcaption>
                  <span>{photo.location}</span>
                  <span>{formatMonthYear(photo.date)}</span>
                  <p>“{photo.caption}”</p>
                </figcaption>
              </figure>
            ))}
          </section>
        </>
      )}

      <hr className="rule" />

      <section className="reflection">
        <p className="label">Reflection</p>
        {journey.reflection.split('\n\n').map((para) => (
          <p key={para} className="reflection-text">
            {para}
          </p>
        ))}
        {journey.rating > 0 && (
          <p className="rating" aria-label={`${journey.rating} stars`}>
            {'★'.repeat(journey.rating)}
          </p>
        )}
      </section>
    </motion.article>
  );
}
