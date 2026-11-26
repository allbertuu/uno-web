"use client";

import localStorageKeys from "@/constants/localStorageKeys";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type PossibleActiveTaskStates = ActiveTask | null;

interface ActiveTaskContext {
  activeTask: PossibleActiveTaskStates;
  setActiveTask: (
    value:
      | PossibleActiveTaskStates
      | ((prevState: PossibleActiveTaskStates) => PossibleActiveTaskStates),
  ) => void;
}

const ActiveTaskContext = createContext({} as ActiveTaskContext);

export interface ActiveTask {
  title: string;
  deadline: string;
  criteria: {
    id: string;
    text: string;
    done: boolean;
  }[];
}

export function ActiveTaskProvider({ children }: { children: ReactNode }) {
  const STORAGE_KEY = localStorageKeys.STORAGE;

  const [activeTask, setActiveTask] = useState<PossibleActiveTaskStates>(null);

  useEffect(() => {
    const syncLocalStorage = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const activeTask = JSON.parse(saved).activeTask;
        setActiveTask(activeTask);
      }
    };

    syncLocalStorage();
  }, [STORAGE_KEY]);

  return (
    <ActiveTaskContext.Provider value={{ activeTask, setActiveTask }}>
      {children}
    </ActiveTaskContext.Provider>
  );
}

export function useActiveTask() {
  const context = useContext(ActiveTaskContext);

  if (!context) {
    throw new Error("see your React tree relation");
  }

  return context;
}
