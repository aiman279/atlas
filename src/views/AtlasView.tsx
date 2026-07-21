import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { WorldMap } from '../components/WorldMap';
import { useNorth } from '../hooks/useNorth';

export function AtlasView({
  onAdd,
  onEdit,
}: {
  onAdd?: () => void;
  onEdit?: (id: string) => void;
}) {
  const { data, removeCountry } = useNorth();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = data.atlas.find((c) => c.id === selectedId) ?? null;

  const stats = useMemo(() => {
    const continents = new Set(data.atlas.map((c) => c.continent));
    const cities = data.atlas.reduce((n, c) => n + c.cities.length, 0);
    return {
      countries: data.atlas.length,
      continents: continents.size,
      cities,
    };
  }, [data.atlas]);

  function handleDelete() {
    if (!selected) return;
    const ok = window.confirm(
      `Remove ${selected.name} from your Atlas?`,
    );
    if (!ok) return;
    removeCountry(selected.id);
    setSelectedId(null);
  }

  return (
    <div className="page atlas-page">
      <header className="page-head atlas-head">
        <div>
          <h1>Atlas</h1>
          <p className="page-lead">Countries you have explored.</p>
        </div>
        <button
          type="button"
          className="atlas-add-btn"
          onClick={() => onAdd?.()}
        >
          + Add
        </button>
      </header>

      <div className="atlas-counters">
        <div className="glass counter-tile">
          <p className="focus-label">Countries</p>
          <p className="counter-num">{stats.countries}</p>
        </div>
        <div className="glass counter-tile">
          <p className="focus-label">Continents</p>
          <p className="counter-num">{stats.continents}</p>
        </div>
        <div className="glass counter-tile">
          <p className="focus-label">Cities</p>
          <p className="counter-num">{stats.cities}</p>
        </div>
      </div>

      <div className="atlas-map-wrap">
        <WorldMap
          visited={data.atlas}
          selectedId={selectedId}
          onSelect={(c) => setSelectedId(c?.id ?? null)}
        />

        <AnimatePresence>
          {selected && (
            <motion.div
              className="glass atlas-popup"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              key={selected.id}
            >
              <button
                type="button"
                className="atlas-popup-close"
                onClick={() => setSelectedId(null)}
                aria-label="Close"
              >
                ×
              </button>
              <h2>
                {selected.name} {selected.flag}
              </h2>
              <dl className="atlas-popup-meta">
                <div>
                  <dt>Visited</dt>
                  <dd>{selected.visitedAt}</dd>
                </div>
                <div>
                  <dt>Trips</dt>
                  <dd>{selected.trips}</dd>
                </div>
                <div>
                  <dt>Days</dt>
                  <dd>{selected.days}</dd>
                </div>
              </dl>
              {selected.cities.length > 0 && (
                <p className="atlas-popup-cities">
                  {selected.cities.join(' · ')}
                </p>
              )}
              <div className="atlas-popup-actions">
                <button
                  type="button"
                  className="atlas-action-edit"
                  onClick={() => onEdit?.(selected.id)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="atlas-action-delete"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ul className="atlas-legend">
        {data.atlas.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              className={selectedId === c.id ? 'is-active' : ''}
              onClick={() =>
                setSelectedId((id) => (id === c.id ? null : c.id))
              }
            >
              <span aria-hidden>{c.flag}</span>
              {c.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
