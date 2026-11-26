"use client";

import StatsIcons from "@/components/stats-icons";
import ThemeToggle from "@/components/theme-toggle";
import CardViews from "@/components/card-views";
import useLocalStorageSynchronization from "@/hooks/use-local-storage-synchronization";

export default function App() {
  useLocalStorageSynchronization();

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-[#FAFAFA] font-sans text-zinc-900 antialiased transition-colors duration-300 selection:bg-emerald-500/20 selection:text-emerald-700 dark:bg-[#0D0D0F] dark:text-zinc-100 dark:selection:text-emerald-300">
      {/* HEADER DISCRETO & 2 ÍCONES DE CONQUISTA */}
      <header className="z-10 mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-6">
        {/* Identidade Minimalista */}
        <div className="flex items-center gap-2.5 select-none">
          <div className="h-3 w-3 rounded-full bg-zinc-900 shadow-sm dark:bg-zinc-100" />
          <span className="text-sm font-semibold tracking-tight text-zinc-500 dark:text-zinc-400">
            uno
          </span>
        </div>

        {/* Conquistas & Alternador de Tema */}
        <div className="flex items-center gap-2 sm:gap-3">
          <StatsIcons />

          <div className="mx-0.5 h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

          <ThemeToggle />
        </div>
      </header>

      {/* ÁREA CENTRAL PRINCIPAL */}
      <main className="flex flex-1 items-center justify-center px-4 py-3 sm:px-6">
        <div className="w-full max-w-135">
          <CardViews />
        </div>
      </main>

      {/* RODAPÉ DISCRETO */}
      <footer className="w-full py-5 text-center">
        <p className="text-[11px] tracking-wide text-zinc-400 dark:text-zinc-600">
          Foco profundo • Uma entrega de cada vez
        </p>
      </footer>
    </div>
  );
}
