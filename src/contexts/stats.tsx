"use client";

import localStorageKeys from "@/constants/localStorageKeys";
import { createContext, useContext, useState, type ReactNode } from "react";

export interface Stats {
  conquered: number;
  streak: number;
}

interface StatsContext {
  stats: Stats;
  setStats: (value: Stats | ((prevState: Stats) => Stats)) => void;
}

const StatsContext = createContext({} as StatsContext);

export function StatsProvider({ children }: { children: ReactNode }) {
  const STORAGE_KEY = localStorageKeys.STORAGE;

  const [stats, setStats] = useState<Stats>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw
        ? JSON.parse(raw).stats || { conquered: 0, streak: 0 }
        : { conquered: 0, streak: 0 };
    } catch {
      return { conquered: 0, streak: 0 };
    }
  });

  return (
    <StatsContext.Provider value={{ stats, setStats }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);

  if (!context) {
    throw new Error("see your React tree relation");
  }

  return context;
}
