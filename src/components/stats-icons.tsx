"use client";

import { useStats } from "@/contexts/stats";
import { Flame, Trophy } from "lucide-react";

export default function StatsIcons() {
  const { stats } = useStats();

  return (
    <>
      <div
        title="Total de tarefas conquistadas"
        className="flex cursor-default items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-3.5 py-1.5 shadow-2xs transition-transform hover:scale-105 dark:border-zinc-800 dark:bg-zinc-900/90"
      >
        <Trophy className="h-4 w-4 text-amber-500" strokeWidth={2.1} />
        <span className="text-xs font-semibold text-zinc-700 tabular-nums dark:text-zinc-300">
          {stats.conquered}
        </span>
      </div>

      <div
        title="Sequência ininterrupta de foco"
        className="flex cursor-default items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white px-3.5 py-1.5 shadow-2xs transition-transform hover:scale-105 dark:border-zinc-800 dark:bg-zinc-900/90"
      >
        <Flame className="h-4 w-4 text-orange-500" strokeWidth={2.1} />
        <span className="text-xs font-semibold text-zinc-700 tabular-nums dark:text-zinc-300">
          {stats.streak}
        </span>
      </div>
    </>
  );
}
