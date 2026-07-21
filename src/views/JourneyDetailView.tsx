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
      transition={{ duration: 0.35 }}
    >
      <button type="button" className="back overlay-back" onClick={onBack}>
        ← Back
      </button>

      <div className="story-hero">
        <img src={journey.coverImage} alt="" />
        <div className="story-hero-text">
          <h1>
            {journey.flag} {journey.country}
          </h1>
          <p>
            {formatMonthYear(journey.startDate)} · {journey.durationDays} days
          </p>
        </div>
      </div>

      <div className="story-body">
        <section className="story-block">
          <p className="label">Places</p>
          <div className="place-chips">
            {journey.placesVisited.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
        </section>

        {journey.photos.length > 0 && (
          <section className="story-block">
            <p className="label">Memories</p>
            <div className="photo-stack">
              {journey.photos.map((photo) => (
                <figure key={photo.id} className="photo-card">
                  <img src={photo.url} alt={photo.caption} loading="lazy" />
                  <figcaption>
                    <strong>{photo.location}</strong>
                    <span>{formatMonthYear(photo.date)}</span>
                    <p>{photo.caption}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <section className="story-block">
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
      </div>
    </motion.article>
  );
}
