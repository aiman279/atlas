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
      <button type="button" className="back" onClick={onBack}>
        ← World
      </button>

      <div
        className="hero-image tall"
        style={{ backgroundImage: `url(${country.coverImage})` }}
      />

      <header className="story-header">
        <h1>
          {country.flag} {country.country}
        </h1>
        {isDream ? (
          <>
            <p className="label">Dream</p>
            <p className="reflection-text">{country.dream}</p>
            <p className="block-meta">Target {country.targetYear}</p>
          </>
        ) : (
          <>
            <p className="block-meta">
              Visited {formatMonthYear(country.visitedAt)}
            </p>
            <p className="block-meta">{country.days} days</p>
          </>
        )}
      </header>

      {!isDream && (
        <>
          <hr className="rule" />
          <section>
            <p className="label">Cities</p>
            <p className="places">{country.cities.join(' · ')}</p>
          </section>

          {country.photos.length > 0 && (
            <>
              <hr className="rule" />
              <section className="memory-gallery">
                <p className="label">Photos</p>
                {country.photos.map((photo) => (
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
            <p className="reflection-text">“{country.reflection}”</p>
            {country.rating > 0 && (
              <p className="rating">{'★'.repeat(country.rating)}</p>
            )}
          </section>
        </>
      )}
    </motion.article>
  );
}
