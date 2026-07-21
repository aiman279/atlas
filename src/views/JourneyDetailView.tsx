import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { formatMonthYear } from '../data/waypoint';
import { useWaypoint } from '../hooks/useWaypoint';
import { ImagePicker } from '../components/ImagePicker';

export function JourneyDetailView({
  journeyId,
  onBack,
}: {
  journeyId: string;
  onBack: () => void;
}) {
  const { data, updateJourney } = useWaypoint();
  const journey = data.journeys.find((j) => j.id === journeyId);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    country: '',
    flag: '',
    cities: '',
    startDate: '',
    durationDays: '',
    reflection: '',
    coverImage: '',
  });

  useEffect(() => {
    if (!journey) return;
    setDraft({
      country: journey.country,
      flag: journey.flag,
      cities: journey.cities.join(', '),
      startDate: journey.startDate,
      durationDays: String(journey.durationDays),
      reflection: journey.reflection,
      coverImage: journey.coverImage,
    });
  }, [journey]);

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

  function save() {
    const cities = draft.cities
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    updateJourney(journeyId, {
      country: draft.country.trim() || journey!.country,
      flag: draft.flag.trim() || journey!.flag,
      cities,
      placesVisited: cities.length ? cities : journey!.placesVisited,
      startDate: draft.startDate,
      durationDays: Number(draft.durationDays) || journey!.durationDays,
      reflection: draft.reflection,
      coverImage: draft.coverImage || journey!.coverImage,
    });
    setEditing(false);
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
            <img src={journey.coverImage} alt="" />
            <div className="story-hero-text">
              <h1>
                {journey.flag} {journey.country}
              </h1>
              <p>
                {formatMonthYear(journey.startDate)} · {journey.durationDays}{' '}
                days
              </p>
            </div>
          </div>

          <div className="story-body">
            <section className="story-block">
              <p className="label">Places</p>
              <div className="place-chips">
                {(journey.placesVisited.length
                  ? journey.placesVisited
                  : journey.cities
                ).map((p) => (
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
              {(journey.reflection || 'No reflection yet.')
                .split('\n\n')
                .map((para) => (
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
        </>
      ) : (
        <div className="story-body edit-panel">
          <p className="label">Edit this chapter</p>
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
              Date
              <input
                type="date"
                value={draft.startDate}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, startDate: e.target.value }))
                }
              />
            </label>
            <label>
              Days
              <input
                type="number"
                value={draft.durationDays}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, durationDays: e.target.value }))
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
            <button type="button" className="btn-primary" onClick={save}>
              Save changes
            </button>
          </div>
        </div>
      )}
    </motion.article>
  );
}
