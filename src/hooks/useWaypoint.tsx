import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  computeReadiness,
  currentMission,
  loadData,
  saveData,
} from '../data/waypoint';
import type {
  ChecklistItem,
  Mission,
  ReadinessBreakdown,
  WaypointData,
} from '../data/types';

interface WaypointContextValue {
  data: WaypointData;
  mission: Mission;
  readiness: ReadinessBreakdown;
  toggleChecklist: (missionId: string, itemId: string) => void;
  updateNotes: (missionId: string, notes: string) => void;
  addExpense: (amount: number, note: string) => void;
}

const Ctx = createContext<WaypointContextValue | null>(null);

export function WaypointProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<WaypointData>(() => loadData());

  const mission = useMemo(() => currentMission(data), [data]);
  const readiness = useMemo(
    () => computeReadiness(data, mission),
    [data, mission],
  );

  const persist = useCallback((next: WaypointData) => {
    saveData(next);
    setData(next);
  }, []);

  const toggleChecklist = useCallback(
    (missionId: string, itemId: string) => {
      persist({
        ...data,
        missions: data.missions.map((m) => {
          if (m.id !== missionId) return m;
          return {
            ...m,
            checklist: m.checklist.map((c: ChecklistItem) =>
              c.id === itemId ? { ...c, done: !c.done } : c,
            ),
          };
        }),
      });
    },
    [data, persist],
  );

  const updateNotes = useCallback(
    (missionId: string, notes: string) => {
      persist({
        ...data,
        missions: data.missions.map((m) =>
          m.id === missionId ? { ...m, notes } : m,
        ),
      });
    },
    [data, persist],
  );

  const addExpense = useCallback(
    (amount: number, note: string) => {
      const tx = {
        id: `tx-${Date.now()}`,
        type: 'expense' as const,
        category: 'Activities' as const,
        amount,
        note,
        date: new Date().toISOString().slice(0, 10),
      };
      persist({
        ...data,
        fund: {
          ...data.fund,
          saved: Math.max(0, data.fund.saved - amount),
          transactions: [tx, ...data.fund.transactions],
        },
      });
    },
    [data, persist],
  );

  const value = useMemo(
    () => ({
      data,
      mission,
      readiness,
      toggleChecklist,
      updateNotes,
      addExpense,
    }),
    [data, mission, readiness, toggleChecklist, updateNotes, addExpense],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWaypoint() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useWaypoint requires WaypointProvider');
  return ctx;
}
