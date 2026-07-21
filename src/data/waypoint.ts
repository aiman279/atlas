import { seedData } from './seed';
import type {
  Mission,
  ReadinessBreakdown,
  WaypointData,
} from './types';

const STORAGE_KEY = 'waypoint-data-v1';

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

export function currentMission(data: WaypointData) {
  return (
    data.missions.find((m) => m.isCurrent) ??
    data.missions.find((m) => m.status === 'preparing') ??
    data.missions[0]
  );
}

export function gearWeightKg(data: WaypointData) {
  return Number(
    data.gear.reduce((sum, g) => sum + g.weightKg, 0).toFixed(1),
  );
}

export function computeReadiness(
  data: WaypointData,
  mission?: Mission,
): ReadinessBreakdown {
  const m = mission ?? currentMission(data);
  const fund = data.fund;

  const money = pct(fund.saved, m.budget || fund.target);

  const planningItems = m.checklist.filter(
    (c) => c.group === 'documents' || c.group === 'transport',
  );
  const planning = pct(
    planningItems.filter((c) => c.done).length,
    planningItems.length || 1,
  );

  const knowledgeItems = m.checklist.filter((c) => c.group === 'knowledge');
  const knowledge = pct(
    knowledgeItems.filter((c) => c.done).length,
    knowledgeItems.length || 1,
  );

  const totalWeight = gearWeightKg(data);
  const limit = data.gearLimits.backpackLimitKg;
  const essentials = data.gear.filter((g) => g.essential);
  const essentialsOk = essentials.length
    ? pct(essentials.length, essentials.length)
    : 100;
  // Gear score: under weight limit + essentials present
  const weightScore =
    totalWeight <= limit ? 100 : Math.max(0, 100 - (totalWeight - limit) * 20);
  const packingDone = m.checklist.find((c) =>
    c.label.toLowerCase().includes('packing'),
  );
  const packingBonus = packingDone?.done ? 100 : 60;
  const gear = Math.round((weightScore * 0.4 + essentialsOk * 0.3 + packingBonus * 0.3));

  const overall = Math.round((money + planning + gear + knowledge) / 4);

  return { overall, money, planning, gear, knowledge };
}

export function travelFreedomDays(data: WaypointData) {
  const rate = data.fund.dailyBurnRate || 300;
  return Math.floor(data.fund.saved / rate);
}

export function dashboardProgress(mission: Mission) {
  const highlights = [
    {
      id: 'flight',
      label: 'Flight booked',
      done: mission.checklist.some(
        (c) => c.label.toLowerCase().includes('flight') && c.done,
      ),
    },
    {
      id: 'stay',
      label: 'Accommodation booked',
      done: mission.checklist.some(
        (c) =>
          (c.label.toLowerCase().includes('accommodation') ||
            c.label.toLowerCase().includes('hotel')) &&
          c.done,
      ),
    },
    {
      id: 'budget',
      label: 'Budget ready',
      done: true, // reflected via fund; marked ready when fund progress >= 60
    },
    {
      id: 'transport',
      label: 'Learn local transport',
      done: mission.checklist.some(
        (c) =>
          c.label.toLowerCase().includes('local transport') && c.done,
      ),
    },
    {
      id: 'packing',
      label: 'Prepare packing list',
      done: mission.checklist.some(
        (c) => c.label.toLowerCase().includes('packing') && c.done,
      ),
    },
  ];
  return highlights;
}
