"use client";

import { useStats } from "@/contexts/stats";
import { Flame, Trophy } from "lucide-react";

export default function BriefStats() {
  const { stats } = useStats();

  return (
    <div className="mb-8 inline-flex items-center gap-4 rounded-2xl border border-zinc-200/70 bg-zinc-50 px-5 py-2.5 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300">
      <span className="inline-flex items-center gap-1.5">
        <Trophy className="h-3.5 w-3.5 text-amber-500" />
        <strong>{stats.conquered}</strong> conquistadas
      </span>
      <span className="text-zinc-300 dark:text-zinc-700">|</span>
      <span className="inline-flex items-center gap-1.5">
        <Flame className="h-3.5 w-3.5 text-orange-500" />
        <strong>{stats.streak}</strong> em sequência
      </span>
    </div>
  );
}
