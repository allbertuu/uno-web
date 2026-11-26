"use client";

import localStorageKeys from "@/constants/localStorageKeys";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const THEME_KEY = localStorageKeys.THEME;

  const [darkMode, setDarkMode] = useState<boolean>();

  useEffect(() => {
    const syncLocalStorageTheme = () => {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) {
        const isDarkMode = saved === "dark";
        setDarkMode(isDarkMode);
      }
    };

    syncLocalStorageTheme();
  }, [THEME_KEY]);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.remove("dark");
      localStorage.setItem(THEME_KEY, "light");
      setDarkMode(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem(THEME_KEY, "dark");
      setDarkMode(true);
    }
  };

  return (
    <button
      type="button"
      onClick={() => toggleTheme()}
      aria-label="Alternar tema"
      className="cursor-pointer rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-100"
    >
      {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
