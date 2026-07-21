import { geoMercator, geoPath } from 'd3-geo';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { feature } from 'topojson-client';
import { formatMoney, formatMonthYear } from '../data/waypoint';
import type { DreamPlace, VisitedPlace } from '../data/types';
import { useWaypoint } from '../hooks/useWaypoint';
import { Card, PageHeader, Pill, SectionLabel } from '../components/ui';

type CountryFeature = GeoJSON.Feature<GeoJSON.Geometry, { name?: string }>;

const WORLD_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const NUMERIC_TO_ALPHA3: Record<string, string> = {
  '380': 'ITA',
  '704': 'VNM',
  '352': 'ISL',
  '504': 'MAR',
  '620': 'PRT',
  '764': 'THA',
  '392': 'JPN',
  '360': 'IDN',
  '554': 'NZL',
  '578': 'NOR',
  '604': 'PER',
};

type Selected =
  | { kind: 'visited'; place: VisitedPlace }
  | { kind: 'dream'; place: DreamPlace };

export function ExploreView() {
  const { data } = useWaypoint();
  const [mode, setMode] = useState<'visited' | 'dreaming'>('visited');
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [selected, setSelected] = useState<Selected | null>(null);
  const [error, setError] = useState(false);

  const visitedByCode = useMemo(() => {
    const m = new Map<string, VisitedPlace>();
    data.visited.forEach((p) => m.set(p.countryCode, p));
    return m;
  }, [data.visited]);

  const dreamByCode = useMemo(() => {
    const m = new Map<string, DreamPlace>();
    data.dreaming.forEach((p) => m.set(p.countryCode, p));
    return m;
  }, [data.dreaming]);

  useEffect(() => {
    let cancelled = false;
    fetch(WORLD_URL)
      .then((r) => {
        if (!r.ok) throw new Error('map');
        return r.json();
      })
      .then((topology) => {
        if (cancelled) return;
        const geo = feature(
          topology as never,
          topology.objects.countries as never,
        ) as unknown as GeoJSON.FeatureCollection;
        setCountries(geo.features as CountryFeature[]);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { path, width, height } = useMemo(() => {
    const width = 960;
    const height = 480;
    const projection = geoMercator()
      .scale(148)
      .translate([width / 2, height / 1.55]);
    return { path: geoPath(projection), width, height };
  }, []);

  function alpha(id: string | number | undefined) {
    if (id == null) return null;
    return NUMERIC_TO_ALPHA3[String(id)] ?? null;
  }

  return (
    <div className="view">
      <PageHeader
        eyebrow="My world"
        title="Explore"
        subtitle="Not a checklist — your life journey around the world."
      />

      <div className="seg mb">
        <button
          type="button"
          className={mode === 'visited' ? 'is-on' : undefined}
          onClick={() => {
            setMode('visited');
            setSelected(null);
          }}
        >
          🌎 Visited
        </button>
        <button
          type="button"
          className={mode === 'dreaming' ? 'is-on' : undefined}
          onClick={() => {
            setMode('dreaming');
            setSelected(null);
          }}
        >
          💭 Dreaming
        </button>
      </div>

      <div className="map-stage card mb">
        {error && <p className="map-msg">Map could not load.</p>}
        {!error && countries.length === 0 && (
          <p className="map-msg">Drawing your world…</p>
        )}
        {countries.length > 0 && (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="map-svg"
            role="img"
            aria-label="World map of visited and dream destinations"
          >
            {countries.map((c) => {
              const code = alpha(c.id);
              const visited = code ? visitedByCode.get(code) : undefined;
              const dream = code ? dreamByCode.get(code) : undefined;
              const interactive =
                mode === 'visited' ? Boolean(visited) : Boolean(dream);
              const fillClass =
                mode === 'visited'
                  ? visited
                    ? 'visited'
                    : 'default'
                  : dream
                    ? 'dream'
                    : 'default';
              const d = path(c) ?? undefined;

              return (
                <path
                  key={String(c.id)}
                  d={d}
                  className={`map-path map-path--${fillClass}`}
                  tabIndex={interactive ? 0 : undefined}
                  role={interactive ? 'button' : undefined}
                  aria-label={
                    interactive
                      ? `${c.properties.name ?? 'Country'}`
                      : undefined
                  }
                  onClick={() => {
                    if (mode === 'visited' && visited) {
                      setSelected({ kind: 'visited', place: visited });
                    }
                    if (mode === 'dreaming' && dream) {
                      setSelected({ kind: 'dream', place: dream });
                    }
                  }}
                />
              );
            })}
          </svg>
        )}

        <AnimatePresence>
          {selected && (
            <motion.aside
              className="map-sheet"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <button
                type="button"
                className="map-close"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                ×
              </button>
              {selected.kind === 'visited' ? (
                <VisitedSheet place={selected.place} />
              ) : (
                <DreamSheet place={selected.place} />
              )}
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      <SectionLabel>
        {mode === 'visited' ? 'Visited places' : 'Dream destinations'}
      </SectionLabel>
      <div className="stack">
        {mode === 'visited'
          ? data.visited.map((p) => (
              <Card
                key={p.id}
                onClick={() => setSelected({ kind: 'visited', place: p })}
              >
                <p className="gear-name">
                  {p.flag} {p.country}
                </p>
                <p className="muted">
                  {formatMonthYear(p.visitedAt)} · {p.days} days · {p.city}
                </p>
                <p className="why tight">“{p.memory}”</p>
              </Card>
            ))
          : data.dreaming.map((p) => (
              <Card
                key={p.id}
                onClick={() => setSelected({ kind: 'dream', place: p })}
              >
                <div className="mission-top">
                  <p className="gear-name">
                    {p.flag} {p.country}
                  </p>
                  <Pill>{p.priority}</Pill>
                </div>
                <p className="why tight">“{p.dream}”</p>
                <p className="muted">
                  {formatMoney(p.estimatedBudget)} · {p.targetYear}
                </p>
              </Card>
            ))}
      </div>
    </div>
  );
}

function VisitedSheet({ place }: { place: VisitedPlace }) {
  return (
    <>
      {place.photos[0] && (
        <img src={place.photos[0]} alt="" className="map-sheet-photo" />
      )}
      <div className="map-sheet-body">
        <p className="eyebrow">Visited</p>
        <h3>
          {place.flag} {place.country}
        </h3>
        <p className="muted">
          {formatMonthYear(place.visitedAt)} · {place.days} days · {place.city}
        </p>
        <p className="map-memory">“{place.memory}”</p>
        {place.lesson && <p className="muted">Lesson: {place.lesson}</p>}
        {place.rating > 0 && <p className="meta-v">{'★'.repeat(place.rating)}</p>}
      </div>
    </>
  );
}

function DreamSheet({ place }: { place: DreamPlace }) {
  return (
    <>
      <img src={place.coverImage} alt="" className="map-sheet-photo" />
      <div className="map-sheet-body">
        <p className="eyebrow">Dreaming</p>
        <h3>
          {place.flag} {place.country}
        </h3>
        <p className="map-memory">“{place.dream}”</p>
        <p className="muted">
          {formatMoney(place.estimatedBudget)} · Target {place.targetYear}
        </p>
      </div>
    </>
  );
}
