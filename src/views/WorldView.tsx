import { geoMercator, geoPath } from 'd3-geo';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { feature } from 'topojson-client';
import { useWaypoint } from '../hooks/useWaypoint';

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
  '756': 'CHE',
  '792': 'TUR',
};

export function WorldView({
  onOpenCountry,
}: {
  onOpenCountry: (id: string) => void;
}) {
  const data = useWaypoint();
  const [mode, setMode] = useState<'visited' | 'dream'>('visited');
  const [countries, setCountries] = useState<CountryFeature[]>([]);

  const visitedCodes = useMemo(
    () =>
      new Set(
        data.countries.filter((c) => c.kind === 'visited').map((c) => c.countryCode),
      ),
    [data.countries],
  );
  const dreamCodes = useMemo(
    () =>
      new Set(
        data.countries.filter((c) => c.kind === 'dream').map((c) => c.countryCode),
      ),
    [data.countries],
  );

  const byCode = useMemo(() => {
    const m = new Map<string, string>();
    data.countries.forEach((c) => {
      // Prefer visited entry when both exist for same code
      if (c.kind === 'visited' || !m.has(c.countryCode)) {
        m.set(c.countryCode, c.id);
      }
      if (mode === 'dream' && c.kind === 'dream') {
        m.set(c.countryCode, c.id);
      }
      if (mode === 'visited' && c.kind === 'visited') {
        m.set(c.countryCode, c.id);
      }
    });
    return m;
  }, [data.countries, mode]);

  useEffect(() => {
    let cancelled = false;
    fetch(WORLD_URL)
      .then((r) => r.json())
      .then((topology) => {
        if (cancelled) return;
        const geo = feature(
          topology as never,
          topology.objects.countries as never,
        ) as unknown as GeoJSON.FeatureCollection;
        setCountries(geo.features as CountryFeature[]);
      })
      .catch(() => undefined);
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

  const list =
    mode === 'visited'
      ? data.countries.filter((c) => c.kind === 'visited')
      : data.countries.filter((c) => c.kind === 'dream');

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="page-title">World</h1>
      <p className="page-lead">A personal map of memories.</p>

      <div className="mode-toggle">
        <button
          type="button"
          className={mode === 'visited' ? 'is-on' : undefined}
          onClick={() => setMode('visited')}
        >
          Visited
        </button>
        <button
          type="button"
          className={mode === 'dream' ? 'is-on' : undefined}
          onClick={() => setMode('dream')}
        >
          Dream
        </button>
      </div>

      <div className="map-wrap">
        {countries.length > 0 && (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="map-svg"
            role="img"
            aria-label="World map"
          >
            {countries.map((c) => {
              const code = c.id != null ? NUMERIC_TO_ALPHA3[String(c.id)] : null;
              const isVisited = code ? visitedCodes.has(code) : false;
              const isDream = code ? dreamCodes.has(code) : false;
              const active =
                mode === 'visited' ? isVisited : isDream;
              const d = path(c) ?? undefined;
              return (
                <path
                  key={String(c.id)}
                  d={d}
                  className={`map-path${active ? (mode === 'visited' ? ' is-visited' : ' is-dream') : ''}`}
                  onClick={() => {
                    if (!code || !active) return;
                    const id = byCode.get(code);
                    if (id) onOpenCountry(id);
                  }}
                />
              );
            })}
          </svg>
        )}
      </div>

      <ul className="country-list">
        {list.map((c) => (
          <li key={c.id}>
            <button type="button" onClick={() => onOpenCountry(c.id)}>
              <span>
                {c.flag} {c.country}
              </span>
              <span className="muted">
                {c.kind === 'dream' ? c.dream : c.cities[0]}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
