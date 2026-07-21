import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { uid } from '../lib/images';
import {
  loadData,
  recomputeStats,
  saveData,
} from '../data/waypoint';
import type {
  CountryMemory,
  Journey,
  MemoryPhoto,
  Profile,
  TravelFund,
  WaypointData,
} from '../data/types';

interface WaypointApi {
  data: WaypointData;
  updateProfile: (patch: Partial<Profile>) => void;
  updateJourney: (id: string, patch: Partial<Journey>) => void;
  updateCountry: (id: string, patch: Partial<CountryMemory>) => void;
  updateFund: (patch: Partial<TravelFund>) => void;
  addJourney: (input: {
    country: string;
    flag: string;
    cities: string;
    startDate: string;
    durationDays: number;
    coverImage: string;
    reflection?: string;
  }) => string;
  addMemory: (input: {
    journeyId: string;
    url: string;
    title: string;
    description: string;
    date: string;
    location: string;
  }) => void;
  addDestination: (input: {
    country: string;
    flag: string;
    dream: string;
    targetYear: number;
    coverImage: string;
    kind: 'visited' | 'dream';
  }) => string;
  addExpense: (amount: number, note: string) => void;
}

const Ctx = createContext<WaypointApi | null>(null);

export function WaypointProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<WaypointData>(() => loadData());

  const persist = useCallback((next: WaypointData) => {
    const normalized = recomputeStats(next);
    saveData(normalized);
    setData(normalized);
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<Profile>) => {
      persist({ ...data, profile: { ...data.profile, ...patch } });
    },
    [data, persist],
  );

  const updateJourney = useCallback(
    (id: string, patch: Partial<Journey>) => {
      persist({
        ...data,
        journeys: data.journeys.map((j) =>
          j.id === id ? { ...j, ...patch } : j,
        ),
      });
    },
    [data, persist],
  );

  const updateCountry = useCallback(
    (id: string, patch: Partial<CountryMemory>) => {
      persist({
        ...data,
        countries: data.countries.map((c) =>
          c.id === id ? { ...c, ...patch } : c,
        ),
      });
    },
    [data, persist],
  );

  const updateFund = useCallback(
    (patch: Partial<TravelFund>) => {
      persist({ ...data, fund: { ...data.fund, ...patch } });
    },
    [data, persist],
  );

  const addJourney = useCallback(
    (input: {
      country: string;
      flag: string;
      cities: string;
      startDate: string;
      durationDays: number;
      coverImage: string;
      reflection?: string;
    }) => {
      const id = uid('j');
      const cities = input.cities
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
      const journey: Journey = {
        id,
        country: input.country,
        countryCode: input.country.slice(0, 3).toUpperCase(),
        flag: input.flag || '✈️',
        cities,
        startDate: input.startDate,
        durationDays: input.durationDays,
        coverImage: input.coverImage,
        placesVisited: cities,
        photos: [],
        reflection: input.reflection || '',
        rating: 0,
        status: 'upcoming',
        isNext: true,
      };
      persist({
        ...data,
        journeys: [
          journey,
          ...data.journeys.map((j) => ({ ...j, isNext: false })),
        ],
      });
      return id;
    },
    [data, persist],
  );

  const addMemory = useCallback(
    (input: {
      journeyId: string;
      url: string;
      title: string;
      description: string;
      date: string;
      location: string;
    }) => {
      const photo: MemoryPhoto = {
        id: uid('m'),
        url: input.url,
        title: input.title,
        description: input.description,
        date: input.date,
        location: input.location,
      };
      persist({
        ...data,
        journeys: data.journeys.map((j) =>
          j.id === input.journeyId
            ? { ...j, photos: [photo, ...j.photos] }
            : j,
        ),
      });
    },
    [data, persist],
  );

  const addDestination = useCallback(
    (input: {
      country: string;
      flag: string;
      dream: string;
      targetYear: number;
      coverImage: string;
      kind: 'visited' | 'dream';
    }) => {
      const id = uid('c');
      const entry: CountryMemory = {
        id,
        country: input.country,
        countryCode: input.country.slice(0, 3).toUpperCase(),
        flag: input.flag || '🌍',
        coverImage: input.coverImage,
        visitedAt:
          input.kind === 'visited'
            ? new Date().toISOString().slice(0, 10)
            : '',
        days: input.kind === 'visited' ? 1 : 0,
        cities: [],
        photos: [],
        reflection: '',
        rating: 0,
        kind: input.kind,
        dream: input.dream,
        targetYear: input.targetYear,
      };
      persist({ ...data, countries: [entry, ...data.countries] });
      return id;
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
          expenses: [
            {
              id: uid('e'),
              amount,
              note: note || 'Expense',
              date: new Date().toISOString().slice(0, 10),
            },
            ...(data.fund.expenses ?? []),
          ],
        },
      });
    },
    [data, persist],
  );

  const value = useMemo(
    () => ({
      data,
      updateProfile,
      updateJourney,
      updateCountry,
      updateFund,
      addJourney,
      addMemory,
      addDestination,
      addExpense,
    }),
    [
      data,
      updateProfile,
      updateJourney,
      updateCountry,
      updateFund,
      addJourney,
      addMemory,
      addDestination,
      addExpense,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWaypoint() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useWaypoint requires WaypointProvider');
  return ctx;
}

/** Convenience: data-only access matching older call sites */
export function useWaypointData() {
  return useWaypoint().data;
}
