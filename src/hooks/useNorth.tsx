import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { loadNorth, resetNorth, saveNorth } from '../data/north';
import type {
  BrainItem,
  GoalMission,
  IdentityProfile,
  LifeArea,
  NorthData,
  ThemePrefs,
  TodayPulse,
  VisitedCountry,
} from '../data/types';
import { uid } from '../lib/images';

interface NorthContextValue {
  data: NorthData;
  addGoal: (input: Omit<GoalMission, 'id' | 'milestones'> & { milestones?: GoalMission['milestones'] }) => string;
  updateGoal: (id: string, patch: Partial<GoalMission>) => void;
  addBrain: (input: Omit<BrainItem, 'id'>) => string;
  addCountry: (input: Omit<VisitedCountry, 'id'>) => string;
  updateCountry: (id: string, patch: Partial<VisitedCountry>) => void;
  removeCountry: (id: string) => void;
  updateProfile: (patch: Partial<IdentityProfile>) => void;
  updateLifeAreas: (areas: LifeArea[]) => void;
  updateToday: (patch: Partial<TodayPulse>) => void;
  setTheme: (theme: ThemePrefs) => void;
  reset: () => void;
}

const NorthContext = createContext<NorthContextValue | null>(null);

export function NorthProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<NorthData>(() => loadNorth());

  useEffect(() => {
    saveNorth(data);
  }, [data]);

  useEffect(() => {
    document.documentElement.dataset.theme = data.theme.mode;
  }, [data.theme.mode]);

  function set(updater: (prev: NorthData) => NorthData) {
    setData((prev) => updater(prev));
  }

  const value: NorthContextValue = {
    data,
    addGoal(input) {
      const id = uid('goal');
      set((prev) => ({
        ...prev,
        goals: [
          {
            ...input,
            id,
            milestones: input.milestones ?? [],
          },
          ...prev.goals,
        ],
      }));
      return id;
    },
    updateGoal(id, patch) {
      set((prev) => ({
        ...prev,
        goals: prev.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)),
      }));
    },
    addBrain(input) {
      const id = uid('brain');
      set((prev) => ({
        ...prev,
        brain: [{ ...input, id }, ...prev.brain],
      }));
      return id;
    },
    addCountry(input) {
      const id = uid('country');
      set((prev) => {
        const exists = prev.atlas.some(
          (c) => c.isoNumeric === input.isoNumeric || c.name === input.name,
        );
        if (exists) {
          return {
            ...prev,
            atlas: prev.atlas.map((c) =>
              c.isoNumeric === input.isoNumeric || c.name === input.name
                ? { ...c, ...input, id: c.id }
                : c,
            ),
          };
        }
        return {
          ...prev,
          atlas: [{ ...input, id }, ...prev.atlas],
        };
      });
      return id;
    },
    updateCountry(id, patch) {
      set((prev) => ({
        ...prev,
        atlas: prev.atlas.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      }));
    },
    removeCountry(id) {
      set((prev) => ({
        ...prev,
        atlas: prev.atlas.filter((c) => c.id !== id),
      }));
    },
    updateProfile(patch) {
      set((prev) => ({
        ...prev,
        profile: { ...prev.profile, ...patch },
      }));
    },
    updateLifeAreas(areas) {
      set((prev) => ({ ...prev, lifeAreas: areas }));
    },
    updateToday(patch) {
      set((prev) => ({ ...prev, today: { ...prev.today, ...patch } }));
    },
    setTheme(theme) {
      set((prev) => ({ ...prev, theme }));
    },
    reset() {
      setData(resetNorth());
    },
  };

  return (
    <NorthContext.Provider value={value}>{children}</NorthContext.Provider>
  );
}

export function useNorth() {
  const ctx = useContext(NorthContext);
  if (!ctx) throw new Error('useNorth must be used within NorthProvider');
  return ctx;
}
