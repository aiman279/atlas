import { seedData } from './seed';
import type { Journey, ReadinessBreakdown, WaypointData } from './types';

const STORAGE_KEY = 'waypoint-data-v2';

export function loadData(): WaypointData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const fresh = structuredClone(seedData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      return fresh;
    }
    return { ...structuredClone(seedData), ...JSON.parse(raw) };
  } catch {
    return structuredClone(seedData);
  }
}

export function saveData(data: WaypointData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function formatMoney(amount: number, currency = 'RM') {
  return `${currency}${amount.toLocaleString('en-MY')}`;
}

export function formatMonthYear(iso: string) {
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

export function pct(part: number, whole: number) {
  if (whole <= 0) return 0;
  return Math.min(100, Math.round((part / whole) * 100));
}

export function currentJourney(data: WaypointData) {
  return (
    data.journeys.find((j) => j.isCurrent) ??
    data.journeys.find((j) => j.status === 'preparing') ??
    data.journeys[0]
  );
}

export function gearWeightKg(data: WaypointData) {
  return Number(data.gear.reduce((sum, g) => sum + g.weightKg, 0).toFixed(1));
}

export function travelFreedomDays(data: WaypointData) {
  return Math.floor(data.fund.saved / (data.fund.dailyBurnRate || 300));
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function computeReadiness(
  data: WaypointData,
  journey?: Journey,
): ReadinessBreakdown {
  const j = journey ?? currentJourney(data);
  const money = pct(data.fund.saved, j.budget || data.fund.target);

  const planningItems = j.checklist.filter(
    (c) => c.group === 'documents' || c.group === 'transport',
  );
  const planning = pct(
    planningItems.filter((c) => c.done).length,
    planningItems.length || 1,
  );

  const knowledgeItems = j.checklist.filter((c) => c.group === 'knowledge');
  const knowledge = pct(
    knowledgeItems.filter((c) => c.done).length,
    knowledgeItems.length || 1,
  );

  const totalWeight = gearWeightKg(data);
  const limit = data.gearLimits.backpackLimitKg;
  const weightScore =
    totalWeight <= limit ? 100 : Math.max(0, 100 - (totalWeight - limit) * 20);
  const packingDone = j.checklist.find((c) =>
    c.label.toLowerCase().includes('packing'),
  );
  const packingBonus = packingDone?.done ? 100 : 55;
  const gear = Math.round(weightScore * 0.5 + packingBonus * 0.5);
  const overall = Math.round((money + planning + gear + knowledge) / 4);

  return { overall, money, planning, gear, knowledge };
}
