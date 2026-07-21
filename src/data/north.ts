import { seedNorth } from './seed';
import type { NorthData } from './types';

const KEY = 'north-os-v1';

export function loadNorth(): NorthData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(seedNorth);
    const parsed = JSON.parse(raw) as NorthData;
    if (!parsed?.profile?.name || !Array.isArray(parsed.goals)) {
      return structuredClone(seedNorth);
    }
    return parsed;
  } catch {
    return structuredClone(seedNorth);
  }
}

export function saveNorth(data: NorthData) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function resetNorth(): NorthData {
  const fresh = structuredClone(seedNorth);
  saveNorth(fresh);
  return fresh;
}
