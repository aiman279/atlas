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
  currentJourney,
  loadData,
  saveData,
} from '../data/waypoint';
import type {
  ChecklistItem,
  Journey,
  ReadinessBreakdown,
  WaypointData,
} from '../data/types';

interface WaypointContextValue {
  data: WaypointData;
  journey: Journey;
  readiness: ReadinessBreakdown;
  toggleChecklist: (journeyId: string, itemId: string) => void;
  updateNotes: (journeyId: string, notes: string) => void;
  addExpense: (amount: number, note: string) => void;
  addMemoryNote: (journeyId: string, text: string) => void;
}

const Ctx = createContext<WaypointContextValue | null>(null);

export function WaypointProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<WaypointData>(() => loadData());
  const journey = useMemo(() => currentJourney(data), [data]);
  const readiness = useMemo(
    () => computeReadiness(data, journey),
    [data, journey],
  );

  const persist = useCallback((next: WaypointData) => {
    saveData(next);
    setData(next);
  }, []);

  const toggleChecklist = useCallback(
    (journeyId: string, itemId: string) => {
      persist({
        ...data,
        journeys: data.journeys.map((j) => {
          if (j.id !== journeyId) return j;
          return {
            ...j,
            checklist: j.checklist.map((c: ChecklistItem) =>
              c.id === itemId ? { ...c, done: !c.done } : c,
            ),
          };
        }),
      });
    },
    [data, persist],
  );

  const updateNotes = useCallback(
    (journeyId: string, notes: string) => {
      persist({
        ...data,
        journeys: data.journeys.map((j) =>
          j.id === journeyId ? { ...j, notes } : j,
        ),
      });
    },
    [data, persist],
  );

  const addExpense = useCallback(
    (amount: number, note: string) => {
      persist({
        ...data,
        fund: {
          ...data.fund,
          saved: Math.max(0, data.fund.saved - amount),
          transactions: [
            {
              id: `tx-${Date.now()}`,
              type: 'expense',
              category: 'Activities',
              amount,
              note,
              date: new Date().toISOString().slice(0, 10),
            },
            ...data.fund.transactions,
          ],
        },
      });
    },
    [data, persist],
  );

  const addMemoryNote = useCallback(
    (journeyId: string, text: string) => {
      persist({
        ...data,
        journeys: data.journeys.map((j) => {
          if (j.id !== journeyId) return j;
          const memory = j.memory ?? {
            photos: [],
            notes: '',
            favouriteMoment: '',
            reflection: '',
            lessonsLearned: [],
            rating: 0,
          };
          return {
            ...j,
            memory: {
              ...memory,
              notes: memory.notes
                ? `${memory.notes}\n\n${text}`
                : text,
            },
          };
        }),
      });
    },
    [data, persist],
  );

  const value = useMemo(
    () => ({
      data,
      journey,
      readiness,
      toggleChecklist,
      updateNotes,
      addExpense,
      addMemoryNote,
    }),
    [
      data,
      journey,
      readiness,
      toggleChecklist,
      updateNotes,
      addExpense,
      addMemoryNote,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWaypoint() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useWaypoint requires WaypointProvider');
  return ctx;
}
