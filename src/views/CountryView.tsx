import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { formatMonthYear } from '../data/waypoint';
import { useWaypoint } from '../hooks/useWaypoint';
import { ImagePicker } from '../components/ImagePicker';

export function CountryView({
  countryId,
  onBack,
}: {
  countryId: string;
  onBack: () => void;
}) {
  const { data, updateCountry } = useWaypoint();
  const country = data.countries.find((c) => c.id === countryId);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    country: '',
    flag: '',
    cities: '',
    reflection: '',
    dream: '',
    coverImage: '',
    visitedAt: '',
    days: '',
    targetYear: '',
  });

  useEffect(() => {
    if (!country) return;
    setDraft({
      country: country.country,
      flag: country.flag,
      cities: country.cities.join(', '),
      reflection: country.reflection,
      dream: country.dream || '',
      coverImage: country.coverImage,
      visitedAt: country.visitedAt,
      days: String(country.days),
      targetYear: String(country.targetYear || ''),
    });
  }, [country]);

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

  function save() {
    const cities = draft.cities
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    updateCountry(countryId, {
      country: draft.country.trim() || country!.country,
      flag: draft.flag.trim() || country!.flag,
      cities,
      reflection: draft.reflection,
      dream: draft.dream,
      coverImage: draft.coverImage || country!.coverImage,
      visitedAt: draft.visitedAt,
      days: Number(draft.days) || country!.days,
      targetYear: draft.targetYear
        ? Number(draft.targetYear)
        : country!.targetYear,
    });
    setEditing(false);
  }

  return (
    <motion.article
      className="page story"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button type="button" className="back overlay-back" onClick={onBack}>
        ← Back
      </button>
      <button
        type="button"
        className="edit-chip"
        onClick={() => (editing ? save() : setEditing(true))}
      >
        {editing ? 'Save' : 'Edit'}
      </button>

      {!editing ? (
        <>
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
                          <img
                            src={photo.url}
                            alt={photo.title}
                            loading="lazy"
                          />
                          <figcaption>
                            <strong>{photo.title}</strong>
                            <span>
                              {photo.location} · {formatMonthYear(photo.date)}
                            </span>
                            {photo.description && <p>{photo.description}</p>}
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  </section>
                )}

                <section className="story-block">
                  <p className="label">Reflection</p>
                  <p className="reflection-text">
                    “{country.reflection || 'Still writing this memory.'}”
                  </p>
                  {country.rating > 0 && (
                    <p className="rating">{'★'.repeat(country.rating)}</p>
                  )}
                </section>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="story-body edit-panel">
          <p className="label">Edit destination</p>
          <div className="form-stack">
            <ImagePicker
              label="Change cover"
              value={draft.coverImage}
              onChange={(url) => setDraft((d) => ({ ...d, coverImage: url }))}
              tall
            />
            <label>
              Country
              <input
                value={draft.country}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, country: e.target.value }))
                }
              />
            </label>
            <label>
              Flag
              <input
                value={draft.flag}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, flag: e.target.value }))
                }
              />
            </label>
            {isDream ? (
              <>
                <label>
                  Dream
                  <input
                    value={draft.dream}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, dream: e.target.value }))
                    }
                  />
                </label>
                <label>
                  Target year
                  <input
                    type="number"
                    value={draft.targetYear}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, targetYear: e.target.value }))
                    }
                  />
                </label>
              </>
            ) : (
              <>
                <label>
                  Cities
                  <input
                    value={draft.cities}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, cities: e.target.value }))
                    }
                  />
                </label>
                <label>
                  Visited
                  <input
                    type="date"
                    value={draft.visitedAt}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, visitedAt: e.target.value }))
                    }
                  />
                </label>
                <label>
                  Days
                  <input
                    type="number"
                    value={draft.days}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, days: e.target.value }))
                    }
                  />
                </label>
                <label>
                  Reflection
                  <textarea
                    value={draft.reflection}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, reflection: e.target.value }))
                    }
                  />
                </label>
              </>
            )}
            <button type="button" className="btn-primary" onClick={save}>
              Save changes
            </button>
          </div>
        </div>
      )}
    </motion.article>
  );
}
