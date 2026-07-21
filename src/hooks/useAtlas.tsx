import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { loadAtlas, resetAtlas, saveAtlas } from '../data/atlas';
import type {
  Achievement,
  AtlasData,
  Chapter,
  Goal,
  Memory,
  Moment,
  Profile,
} from '../data/types';
import { uid } from '../lib/images';

interface AtlasContextValue {
  data: AtlasData;
  currentChapter: Chapter | undefined;
  addChapter: (input: Omit<Chapter, 'id' | 'moments'> & { moments?: Moment[] }) => string;
  updateChapter: (id: string, patch: Partial<Chapter>) => void;
  addMoment: (chapterId: string, moment: Omit<Moment, 'id'>) => void;
  addMemory: (input: Omit<Memory, 'id'>) => string;
  updateMemory: (id: string, patch: Partial<Memory>) => void;
  addGoal: (input: Omit<Goal, 'id'>) => string;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  addAchievement: (input: Omit<Achievement, 'id'>) => string;
  updateProfile: (patch: Partial<Profile>) => void;
  reset: () => void;
}

const AtlasContext = createContext<AtlasContextValue | null>(null);

export function AtlasProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AtlasData>(() => loadAtlas());

  useEffect(() => {
    saveAtlas(data);
  }, [data]);

  const currentChapter = data.chapters.find(
    (c) => c.id === data.profile.currentChapterId,
  );

  function set(updater: (prev: AtlasData) => AtlasData) {
    setData((prev) => updater(prev));
  }

  const value: AtlasContextValue = {
    data,
    currentChapter,
    addChapter(input) {
      const id = uid('ch');
      set((prev) => ({
        ...prev,
        chapters: [
          {
            ...input,
            id,
            moments: input.moments ?? [],
          },
          ...prev.chapters,
        ],
      }));
      return id;
    },
    updateChapter(id, patch) {
      set((prev) => ({
        ...prev,
        chapters: prev.chapters.map((c) =>
          c.id === id ? { ...c, ...patch } : c,
        ),
      }));
    },
    addMoment(chapterId, moment) {
      const id = uid('moment');
      set((prev) => ({
        ...prev,
        chapters: prev.chapters.map((c) =>
          c.id === chapterId
            ? { ...c, moments: [{ ...moment, id }, ...c.moments] }
            : c,
        ),
      }));
    },
    addMemory(input) {
      const id = uid('mem');
      set((prev) => ({
        ...prev,
        memories: [{ ...input, id }, ...prev.memories],
      }));
      return id;
    },
    updateMemory(id, patch) {
      set((prev) => ({
        ...prev,
        memories: prev.memories.map((m) =>
          m.id === id ? { ...m, ...patch } : m,
        ),
      }));
    },
    addGoal(input) {
      const id = uid('goal');
      set((prev) => ({
        ...prev,
        goals: [...prev.goals, { ...input, id }],
      }));
      return id;
    },
    updateGoal(id, patch) {
      set((prev) => ({
        ...prev,
        goals: prev.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)),
      }));
    },
    addAchievement(input) {
      const id = uid('ach');
      set((prev) => ({
        ...prev,
        achievements: [{ ...input, id }, ...prev.achievements],
      }));
      return id;
    },
    updateProfile(patch) {
      set((prev) => ({
        ...prev,
        profile: { ...prev.profile, ...patch },
      }));
    },
    reset() {
      setData(resetAtlas());
    },
  };

  return (
    <AtlasContext.Provider value={value}>{children}</AtlasContext.Provider>
  );
}

export function useAtlas() {
  const ctx = useContext(AtlasContext);
  if (!ctx) throw new Error('useAtlas must be used within AtlasProvider');
  return ctx;
}
