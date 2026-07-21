import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { loadData } from '../data/waypoint';
import type { WaypointData } from '../data/types';

const Ctx = createContext<WaypointData | null>(null);

export function WaypointProvider({ children }: { children: ReactNode }) {
  const [data] = useState<WaypointData>(() => loadData());
  const value = useMemo(() => data, [data]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWaypoint() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useWaypoint requires WaypointProvider');
  return ctx;
}
