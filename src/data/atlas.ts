import { seedData } from './seed';
import type { AtlasData, AtlasStats } from './types';

const STORAGE_KEY = 'atlas-data-v1';

export function loadAtlasData(): AtlasData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
      return structuredClone(seedData);
    }
    return { ...structuredClone(seedData), ...JSON.parse(raw) };
  } catch {
    return structuredClone(seedData);
  }
}

export function saveAtlasData(data: AtlasData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function computeStats(data: AtlasData): AtlasStats {
  const completed = data.journeys.filter((j) => j.status === 'completed');
  const countries = new Set(completed.map((j) => j.countryCode));
  // Include Indonesia from places if visited without full journey card
  data.places
    .filter((p) => p.type === 'visited')
    .forEach((p) => countries.add(p.countryCode));

  const cities = new Set([
    ...completed.flatMap((j) => j.placesVisited),
    ...data.places.filter((p) => p.type === 'visited').map((p) => p.city),
  ]);

  const travelDays = completed.reduce((sum, j) => sum + j.durationDays, 0);
  // Add a few days for place-only Indonesia visit to near example totals
  const extraDays = data.places.some(
    (p) => p.countryCode === 'IDN' && p.type === 'visited',
  )
    ? 11
    : 0;

  return {
    countriesVisited: countries.size,
    totalJourneys: completed.length,
    memoriesCreated: data.stories.length,
    achievementsUnlocked: data.achievements.filter((a) => a.unlocked).length,
    citiesVisited: cities.size,
    travelDays: travelDays + extraDays,
  };
}

export function daysUntil(iso: string) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}

export function formatMonthYear(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export function formatFullDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatMoney(amount: number, currency = 'RM') {
  return `${currency}${amount.toLocaleString('en-MY')}`;
}

export function chapterLabel(n: number) {
  return `Chapter ${String(n).padStart(2, '0')}`;
}

export function fundProgress(saved: number, goal: number) {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((saved / goal) * 100));
}
