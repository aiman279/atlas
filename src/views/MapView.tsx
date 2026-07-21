import { geoMercator, geoPath } from 'd3-geo';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { feature } from 'topojson-client';
import { useAtlas } from '../hooks/useAtlas';
import type { MapPlace } from '../data/types';
import { PageHeader, StatPill } from '../components/ui';

type CountryFeature = GeoJSON.Feature<
  GeoJSON.Geometry,
  { name?: string }
>;

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

export function MapView() {
  const { data, stats } = useAtlas();
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [selected, setSelected] = useState<MapPlace | null>(null);
  const [error, setError] = useState(false);

  const byCode = useMemo(() => {
    const map = new Map<string, MapPlace>();
    data.places.forEach((p) => map.set(p.countryCode, p));
    return map;
  }, [data.places]);

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

  function placeForId(id: string | number | undefined) {
    if (id == null) return null;
    const alpha = NUMERIC_TO_ALPHA3[String(id)];
    return alpha ? byCode.get(alpha) ?? null : null;
  }

  return (
    <div className="view">
      <PageHeader
        eyebrow="Atlas Map"
        title="Your world"
        subtitle="Green for places lived. Grey for places dreamed."
      />

      <div className="stats-grid three">
        <StatPill icon="🌎" value={stats.countriesVisited} label="Countries explored" />
        <StatPill icon="🏙️" value={stats.citiesVisited} label="Cities visited" />
        <StatPill icon="✈️" value={stats.travelDays} label="Travel days" />
      </div>

      <div className="map-legend-row">
        <span>
          <i className="dot visited" /> Visited
        </span>
        <span>
          <i className="dot dream" /> Dream destinations
        </span>
      </div>

      <div className="map-stage card">
        {error && <p className="map-msg">Map could not load. Try again later.</p>}
        {!error && countries.length === 0 && (
          <p className="map-msg">Drawing your atlas…</p>
        )}
        {countries.length > 0 && (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="map-svg"
            role="img"
            aria-label="World map of visited and dream destinations"
          >
            {countries.map((c) => {
              const place = placeForId(c.id);
              const kind = place?.type ?? 'default';
              const d = path(c) ?? undefined;
              return (
                <path
                  key={String(c.id)}
                  d={d}
                  className={`map-path map-path--${kind}${selected?.id === place?.id ? ' is-active' : ''}`}
                  tabIndex={place ? 0 : undefined}
                  role={place ? 'button' : undefined}
                  aria-label={
                    place
                      ? `${place.country}, ${place.type}`
                      : undefined
                  }
                  onClick={() => place && setSelected(place)}
                  onKeyDown={(e) => {
                    if (!place) return;
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelected(place);
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3 }}
            >
              <button
                type="button"
                className="map-close"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                ×
              </button>
              {selected.photos[0] && (
                <img src={selected.photos[0]} alt="" className="map-sheet-photo" />
              )}
              <div className="map-sheet-body">
                <p className="eyebrow">
                  {selected.type === 'visited' ? 'Visited' : 'Dream'}
                </p>
                <h3>
                  {selected.country}
                  <span className="muted"> · {selected.city}</span>
                </h3>
                {selected.memory && (
                  <p className="map-memory">“{selected.memory}”</p>
                )}
                {selected.lesson && (
                  <p className="muted">Lesson: {selected.lesson}</p>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
