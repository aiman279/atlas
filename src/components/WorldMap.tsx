import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { useMemo, useState } from 'react';
import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';
import type { FeatureCollection, Geometry } from 'geojson';
import countriesTopology from 'world-atlas/countries-110m.json';
import type { VisitedCountry } from '../data/types';
import './WorldMap.css';

type CountryProps = { name?: string };

export function WorldMap({
  visited,
  selectedId,
  onSelect,
}: {
  visited: VisitedCountry[];
  selectedId: string | null;
  onSelect: (country: VisitedCountry | null) => void;
}) {
  const visitedByIso = useMemo(() => {
    const map = new Map<string, VisitedCountry>();
    for (const c of visited) {
      map.set(String(Number(c.isoNumeric)), c);
      map.set(c.isoNumeric.padStart(3, '0'), c);
    }
    return map;
  }, [visited]);

  const { features, path } = useMemo(() => {
    const topo = countriesTopology as unknown as Topology;
    const geo = feature(
      topo,
      topo.objects.countries,
    ) as FeatureCollection<Geometry, CountryProps>;

    const width = 800;
    const height = 420;
    const projection = geoNaturalEarth1().fitSize([width, height], geo);
    const pathGen = geoPath(projection);

    return {
      features: geo.features,
      path: pathGen,
      width,
      height,
    };
  }, []);

  const [hoverIso, setHoverIso] = useState<string | null>(null);

  return (
    <div className="world-map">
      <svg
        viewBox="0 0 800 420"
        role="img"
        aria-label="World map of visited countries"
      >
        {features.map((f, i) => {
          const iso = String(f.id ?? '');
          const match =
            visitedByIso.get(iso) ||
            visitedByIso.get(iso.padStart(3, '0'));
          const isVisited = Boolean(match);
          const isSelected = match && selectedId === match.id;
          const isHover = hoverIso === iso && isVisited;
          const d = path(f) ?? '';

          return (
            <path
              key={f.id ?? i}
              d={d}
              className={[
                'map-country',
                isVisited ? 'is-visited' : 'is-neutral',
                isSelected || isHover ? 'is-active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelect(match ?? null)}
              onMouseEnter={() => setHoverIso(iso)}
              onMouseLeave={() => setHoverIso(null)}
            >
              <title>{f.properties?.name ?? 'Country'}</title>
            </path>
          );
        })}
      </svg>
    </div>
  );
}
