import { motion } from 'framer-motion';
import { formatMonthYear } from '../data/waypoint';
import { useWaypoint } from '../hooks/useWaypoint';

export function CountryView({
  countryId,
  onBack,
}: {
  countryId: string;
  onBack: () => void;
}) {
  const data = useWaypoint();
  const country = data.countries.find((c) => c.id === countryId);

  if (!country) {
    return (
      <div className="page">
        <button type="button" className="back" onClick={onBack}>
          ← Back
        </button>
        <p className="muted">Not found.</p>
      </div>
    );
  }

  const isDream = country.kind === 'dream';

  return (
    <motion.article
      className="page story"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button type="button" className="back overlay-back" onClick={onBack}>
        ← Back
      </button>

      <div className="story-hero">
        <img src={country.coverImage} alt="" />
        <div className="story-hero-text">
          <h1>
            {country.flag} {country.country}
          </h1>
          {isDream ? (
            <p>Dream · {country.targetYear}</p>
          ) : (
            <p>
              {formatMonthYear(country.visitedAt)} · {country.days} days
            </p>
          )}
        </div>
      </div>

      <div className="story-body">
        {isDream ? (
          <section className="story-block">
            <p className="label">Dream</p>
            <p className="reflection-text">{country.dream}</p>
          </section>
        ) : (
          <>
            <section className="story-block">
              <p className="label">Cities</p>
              <div className="place-chips">
                {country.cities.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
            </section>

            {country.photos.length > 0 && (
              <section className="story-block">
                <p className="label">Photos</p>
                <div className="photo-stack">
                  {country.photos.map((photo) => (
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
              <p className="reflection-text">“{country.reflection}”</p>
              {country.rating > 0 && (
                <p className="rating">{'★'.repeat(country.rating)}</p>
              )}
            </section>
          </>
        )}
      </div>
    </motion.article>
  );
}
