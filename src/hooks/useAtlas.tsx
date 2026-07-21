import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  computeStats,
  loadAtlasData,
  saveAtlasData,
} from '../data/atlas';
import type { AdventureFund, AtlasData, AtlasStats } from '../data/types';

interface AtlasContextValue {
  data: AtlasData;
  stats: AtlasStats;
  updateFund: (fund: AdventureFund) => void;
  resetData: () => void;
}

const AtlasContext = createContext<AtlasContextValue | null>(null);

export function AtlasProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AtlasData>(() => loadAtlasData());

  const stats = useMemo(() => computeStats(data), [data]);

  const updateFund = useCallback((fund: AdventureFund) => {
    setData((prev) => {
      const next = {
        ...prev,
        funds: prev.funds.map((f) => (f.id === fund.id ? fund : f)),
      };
      saveAtlasData(next);
      return next;
    });
  }, []);

  const resetData = useCallback(() => {
    localStorage.removeItem('atlas-data-v1');
    const fresh = loadAtlasData();
    setData(fresh);
  }, []);

  const value = useMemo(
    () => ({ data, stats, updateFund, resetData }),
    [data, stats, updateFund, resetData],
  );

  return (
    <AtlasContext.Provider value={value}>{children}</AtlasContext.Provider>
  );
}

export function useAtlas() {
  const ctx = useContext(AtlasContext);
  if (!ctx) throw new Error('useAtlas must be used within AtlasProvider');
  return ctx;
}
