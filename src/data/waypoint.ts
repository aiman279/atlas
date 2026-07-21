import { seedData } from './seed';
import type { Journey, WaypointData } from './types';

const STORAGE_KEY = 'waypoint-archive-v3';

export function loadData(): WaypointData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const fresh = structuredClone(seedData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      return fresh;
    }
    const parsed = JSON.parse(raw) as WaypointData;
    return normalizeData({
      ...structuredClone(seedData),
      ...parsed,
      profile: { ...seedData.profile, ...parsed.profile },
      fund: {
        ...seedData.fund,
        ...parsed.fund,
        expenses: parsed.fund?.expenses ?? [],
      },
    });
  } catch {
    return structuredClone(seedData);
  }
}

function normalizeData(data: WaypointData): WaypointData {
  return {
    ...data,
    journeys: data.journeys.map((j) => ({
      ...j,
      photos: (j.photos ?? []).map(normalizePhoto),
    })),
    countries: data.countries.map((c) => ({
      ...c,
      photos: (c.photos ?? []).map(normalizePhoto),
    })),
  };
}

function normalizePhoto(p: {
  id: string;
  url: string;
  title?: string;
  description?: string;
  caption?: string;
  date: string;
  location: string;
}) {
  const title = p.title || p.caption || 'Memory';
  return {
    id: p.id,
    url: p.url,
    title,
    description: p.description || p.caption || '',
    date: p.date,
    location: p.location,
  };
}

export function saveData(data: WaypointData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function formatMoney(amount: number, currency = 'RM') {
  return `${currency}${amount.toLocaleString('en-MY')}`;
}

export function formatMonthYear(iso: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export function daysUntil(iso: string) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function nextJourney(data: WaypointData): Journey {
  return (
    data.journeys.find((j) => j.isNext) ??
    data.journeys.find((j) => j.status === 'upcoming') ??
    data.journeys[0]
  );
}

export function journeysByYear(data: WaypointData) {
  const sorted = [...data.journeys].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );
  const map = new Map<number, Journey[]>();
  for (const j of sorted) {
    const y = new Date(j.startDate).getFullYear();
    if (!map.has(y)) map.set(y, []);
    map.get(y)!.push(j);
  }
  return [...map.entries()].sort(([a], [b]) => b - a);
}

export function recomputeStats(data: WaypointData): WaypointData {
  const visited = data.countries.filter((c) => c.kind === 'visited');
  const countriesVisited = new Set(visited.map((c) => c.countryCode)).size;
  const totalJourneys = data.journeys.length;
  const travelDays = data.journeys.reduce((s, j) => s + j.durationDays, 0);
  return {
    ...data,
    profile: {
      ...data.profile,
      countriesVisited: Math.max(countriesVisited, data.profile.countriesVisited),
      totalJourneys: Math.max(totalJourneys, data.profile.totalJourneys),
      travelDays: Math.max(travelDays, data.profile.travelDays),
    },
  };
}
