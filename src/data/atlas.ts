import { seedAtlas } from './seed';
import type { AtlasData } from './types';

const KEY = 'atlas-life-v1';

export function loadAtlas(): AtlasData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(seedAtlas);
    const parsed = JSON.parse(raw) as AtlasData;
    if (!parsed?.profile?.name || !Array.isArray(parsed.chapters)) {
      return structuredClone(seedAtlas);
    }
    return parsed;
  } catch {
    return structuredClone(seedAtlas);
  }
}

export function saveAtlas(data: AtlasData) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function resetAtlas(): AtlasData {
  const fresh = structuredClone(seedAtlas);
  saveAtlas(fresh);
  return fresh;
}
