"use client";

import localStorageKeys from "@/constants/localStorageKeys";
import { useActiveTask } from "@/contexts/active-task";
import { useStats } from "@/contexts/stats";
import { useEffect } from "react";

export default function useLocalStorageSynchronization() {
  const STORAGE_KEY = localStorageKeys.STORAGE;

  const { activeTask } = useActiveTask();
  const { stats } = useStats();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ activeTask, stats }));
    } catch (e) {
      console.error("Erro ao salvar no localStorage:", e);
    }
  }, [STORAGE_KEY, activeTask, stats]);
}
