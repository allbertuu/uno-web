"use client";

import { useState, useEffect, useRef } from "react";
import {
  Trophy,
  Plus,
  X,
  ArrowRight,
  Clock,
  Check,
  Sparkles,
} from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { useActiveTask } from "@/contexts/active-task";
import BriefStats from "@/components/brief-stats";
import { useStats } from "@/contexts/stats";
import StatsIcons from "@/components/stats-icons";
import useLocalStorageSynchronization from "@/hooks/use-local-storage-synchronization";
import Confetti from "@/components/confetti";

// Frases motivacionais exibidas ao conquistar uma tarefa
const VICTORY_QUOTES = [
  "A clareza vence a pressa. Mais uma vitória.",
  "Foco absoluto gera resultados extraordinários.",
  "Uma coisa de cada vez. Você dominou o momento.",
  "Disciplina é escolher o que importa agora.",
  "Missão cumprida. Sinta o peso sair dos ombros.",
];

export default function App() {
  const { activeTask, setActiveTask } = useActiveTask();
  const { setStats } = useStats();
  useLocalStorageSynchronization();

  // Controle de tela atual: 'create' | 'focus' | 'victory'
  const [view, setView] = useState(() => (activeTask ? "focus" : "create"));
  const [isEditing, setIsEditing] = useState(false);

  // Estados do formulário de criação/edição
  const [titleInput, setTitleInput] = useState("");
  const [deadlineInput, setDeadlineInput] = useState("Hoje às 18:00");
  const [criteriaInputs, setCriteriaInputs] = useState(["", ""]);
  const [formError, setFormError] = useState("");

  // Estados da tela de foco e vitória
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);
  const [victoryData, setVictoryData] = useState({ title: "", quote: "" });

  const [showConfetti, setShowConfetti] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  // Foca automaticamente no título quando entra na tela de criação
  useEffect(() => {
    if (view === "create") {
      const timer = setTimeout(() => titleRef.current?.focus(), 80);
      return () => clearTimeout(timer);
    }
  }, [view]);

  // =================================================================
  // 3. MANIPULAÇÃO DO FORMULÁRIO DE CRIAÇÃO
  // =================================================================
  const handleQuickDeadline = (type: "today18" | "1h" | "tomorrow") => {
    if (type === "1h") {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      setDeadlineInput(`Hoje às ${hh}:${mm}`);
    } else if (type === "today18") {
      setDeadlineInput("Hoje às 18:00");
    } else if (type === "tomorrow") {
      setDeadlineInput("Amanhã às 12:00");
    }
  };

  const handleCriterionChange = (index: number, value: string) => {
    const updated = [...criteriaInputs];
    updated[index] = value;
    setCriteriaInputs(updated);
  };

  const handleAddCriterion = () => {
    setCriteriaInputs((prev) => [...prev, ""]);
  };

  const handleRemoveCriterion = (index: number) => {
    if (criteriaInputs.length > 1) {
      setCriteriaInputs((prev) => prev.filter((_, i) => i !== index));
    } else {
      setCriteriaInputs([""]);
    }
  };

  const handleCreateSubmit = () => {
    setFormError("");

    const cleanTitle = titleInput.trim();
    const cleanDeadline = deadlineInput.trim();
    const validCriteria = criteriaInputs
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (!cleanTitle) {
      setFormError("Defina um título claro para sua única tarefa.");
      return;
    }
    if (!cleanDeadline) {
      setFormError("Informe um prazo para manter o senso de urgência.");
      return;
    }
    if (validCriteria.length === 0) {
      setFormError(
        "Adicione pelo menos 1 critério de aceite para validar sua vitória.",
      );
      return;
    }

    // Preserva status concluído caso esteja editando critérios existentes
    const previousCriteria = isEditing && activeTask ? activeTask.criteria : [];
    const formattedCriteria = validCriteria.map((text, idx) => {
      const existing = previousCriteria.find((c) => c.text === text);
      return {
        id: `crit_${Date.now()}_${idx}`,
        text,
        done: existing ? existing.done : false,
      };
    });

    setActiveTask({
      title: cleanTitle,
      deadline: cleanDeadline,
      criteria: formattedCriteria,
    });
    setIsEditing(false);
    setShowAbandonConfirm(false);
    setView("focus");
  };

  // =================================================================
  // 4. INTERAÇÕES NA TELA DE FOCO ATIVO
  // =================================================================
  const toggleCriterion = (id: string) => {
    if (!activeTask) return;
    setActiveTask((prev) =>
      prev
        ? {
            ...prev,
            criteria: prev.criteria.map((c) =>
              c.id === id ? { ...c, done: !c.done } : c,
            ),
          }
        : null,
    );
  };

  const handleConquerTask = () => {
    if (!activeTask) return;
    const allDone = activeTask.criteria.every((c) => c.done);
    if (!allDone) return;

    const finishedTitle = activeTask.title;
    const randomQuote =
      VICTORY_QUOTES[Math.floor(Math.random() * VICTORY_QUOTES.length)];

    setStats((prev) => ({
      conquered: prev.conquered + 1,
      streak: prev.streak + 1,
    }));

    setVictoryData({ title: finishedTitle, quote: randomQuote });
    setActiveTask(null);
    setView("victory");
    setShowConfetti(true);
  };

  const handleEditCurrentTask = () => {
    if (!activeTask) return;
    setIsEditing(true);
    setTitleInput(activeTask.title);
    setDeadlineInput(activeTask.deadline);
    setCriteriaInputs(activeTask.criteria.map((c) => c.text));
    setFormError("");
    setView("create");
  };

  const handleConfirmAbandon = () => {
    setActiveTask(null);
    setStats((prev) => ({ ...prev, streak: 0 }));
    setIsEditing(false);
    setShowAbandonConfirm(false);
    resetForm();
    setView("create");
  };

  const resetForm = () => {
    setTitleInput("");
    setDeadlineInput("Hoje às 18:00");
    setCriteriaInputs(["", ""]);
    setFormError("");
  };

  const handleStartNextTask = () => {
    resetForm();
    setShowConfetti(false);
    setView("create");
  };

  // =================================================================
  // 5. CÁLCULOS DE PROGRESSO
  // =================================================================
  const totalCriteria = activeTask ? activeTask.criteria.length : 0;
  const completedCriteria = activeTask
    ? activeTask.criteria.filter((c) => c.done).length
    : 0;
  const progressPercent =
    totalCriteria === 0
      ? 0
      : Math.round((completedCriteria / totalCriteria) * 100);
  const isReadyToConquer =
    totalCriteria > 0 && completedCriteria === totalCriteria;
  const remainingCount = totalCriteria - completedCriteria;

  // =================================================================
  // 6. RENDERIZAÇÃO
  // =================================================================
  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-[#FAFAFA] font-sans text-zinc-900 antialiased transition-colors duration-300 selection:bg-emerald-500/20 selection:text-emerald-700 dark:bg-[#0D0D0F] dark:text-zinc-100 dark:selection:text-emerald-300">
      {showConfetti && <Confetti />}

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
      <main className="flex flex-1 items-center justify-center px-4 py-6 sm:px-6">
        <div className="w-full max-w-135">
          {/* =========================================================
              VISÃO 1: CRIAÇÃO DA ÚNICA TAREFA
              ========================================================= */}
          {view === "create" && (
            <section className="animate-uno-fade">
              <div className="mb-8 text-center">
                <span className="mb-3 inline-block rounded-full bg-zinc-200/70 px-3 py-1 text-[11px] font-medium tracking-wide text-zinc-600 uppercase dark:bg-zinc-800/80 dark:text-zinc-400">
                  Regra de Ouro: Apenas Uma
                </span>
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
                  {isEditing
                    ? "Ajustar sua missão atual"
                    : "O que realmente importa agora?"}
                </h1>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Escolha uma única missão. Você não poderá criar outra até
                  conquistar esta.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateSubmit();
                }}
                className="space-y-6 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.06)] sm:p-8 dark:border-zinc-800/90 dark:bg-[#141417] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)]"
              >
                {/* Título */}
                <div>
                  <label
                    htmlFor="uno-task-title"
                    className="mb-2 ml-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400"
                  >
                    Título da Missão
                  </label>
                  <input
                    ref={titleRef}
                    id="uno-task-title"
                    type="text"
                    maxLength={90}
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    placeholder="Ex: Finalizar apresentação do projeto Q4"
                    className="w-full rounded-2xl border border-zinc-200/90 bg-zinc-50 px-4 py-3.5 text-base font-medium text-zinc-900 placeholder-zinc-400 transition-all focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-white dark:placeholder-zinc-600 dark:focus:border-zinc-600 dark:focus:ring-white/15"
                  />
                </div>

                {/* Prazo + Atalhos Rápidos */}
                <div>
                  <div className="mb-2 ml-1 flex flex-wrap items-center justify-between gap-2">
                    <label
                      htmlFor="uno-task-deadline"
                      className="text-xs font-medium text-zinc-500 dark:text-zinc-400"
                    >
                      Prazo de Conclusão
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleQuickDeadline("1h")}
                        className="cursor-pointer rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800/90 dark:text-zinc-400 dark:hover:bg-zinc-700"
                      >
                        Em 1h
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickDeadline("today18")}
                        className="cursor-pointer rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800/90 dark:text-zinc-400 dark:hover:bg-zinc-700"
                      >
                        Hoje, 18:00
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickDeadline("tomorrow")}
                        className="cursor-pointer rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800/90 dark:text-zinc-400 dark:hover:bg-zinc-700"
                      >
                        Amanhã
                      </button>
                    </div>
                  </div>
                  <input
                    id="uno-task-deadline"
                    type="text"
                    value={deadlineInput}
                    onChange={(e) => setDeadlineInput(e.target.value)}
                    placeholder="Ex: Hoje às 18:00"
                    className="w-full rounded-2xl border border-zinc-200/90 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 transition-all focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-200 dark:placeholder-zinc-600 dark:focus:border-zinc-600 dark:focus:ring-white/15"
                  />
                </div>

                {/* Critérios de Aceite */}
                <div>
                  <div className="mb-2 ml-1 flex items-center justify-between">
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      Critérios de Aceite{" "}
                      <span className="font-normal text-zinc-400 dark:text-zinc-600">
                        (obrigatórios para vencer)
                      </span>
                    </label>
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                      {criteriaInputs.length}{" "}
                      {criteriaInputs.length === 1 ? "item" : "itens"}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {criteriaInputs.map((val, idx) => (
                      <div key={idx} className="group flex items-center gap-2">
                        <div className="h-4 w-4 shrink-0 rounded-md border border-zinc-300 dark:border-zinc-700" />
                        <input
                          type="text"
                          value={val}
                          onChange={(e) =>
                            handleCriterionChange(idx, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddCriterion();
                            }
                          }}
                          placeholder="Ex: Revisar ortografia e exportar PDF"
                          className="flex-1 rounded-xl border border-zinc-200/80 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 transition-colors focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-200 dark:placeholder-zinc-600 dark:focus:border-zinc-600"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCriterion(idx)}
                          title="Remover critério"
                          className="cursor-pointer rounded-xl p-2 text-zinc-400 opacity-60 transition-colors group-hover:opacity-100 hover:bg-rose-500/10 hover:text-rose-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddCriterion}
                    className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-white"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Adicionar critério de aceite
                  </button>
                </div>

                {/* Erro de Validação Inline */}
                {formError && (
                  <p className="rounded-xl bg-rose-500/10 px-3 py-2.5 text-center text-xs font-medium text-rose-500">
                    {formError}
                  </p>
                )}

                {/* Ações do Formulário */}
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-6 py-4 text-sm font-semibold tracking-tight text-white shadow-md transition-all hover:bg-zinc-800 hover:shadow-lg active:scale-[0.99] dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
                  >
                    <span>
                      {isEditing ? "Salvar alterações" : "Focar nesta tarefa"}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setView("focus");
                      }}
                      className="w-full cursor-pointer py-2.5 text-xs text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                      Cancelar edição
                    </button>
                  )}
                </div>
              </form>
            </section>
          )}

          {/* =========================================================
              VISÃO 2: FOCO ATIVO (CARD ÚNICO CENTRALIZADO)
              ========================================================= */}
          {view === "focus" && activeTask && (
            <section className="animate-uno-scale">
              <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-7 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.06)] sm:p-10 dark:border-zinc-800/90 dark:bg-[#141417] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)]">
                {/* Barra de Progresso no Topo do Card */}
                <div className="absolute top-0 right-0 left-0 h-1.5 bg-zinc-100 dark:bg-zinc-800/80">
                  <div
                    className="h-full rounded-r-full bg-emerald-500 transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Cabeçalho: Prazo & Feedback Motivacional */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800/90 dark:text-zinc-300">
                    <Clock className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{activeTask.deadline}</span>
                  </div>

                  {progressPercent === 0 && (
                    <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                      Comece pelo primeiro passo
                    </span>
                  )}
                  {progressPercent > 0 && progressPercent < 100 && (
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                      {progressPercent}% concluído — continue assim!
                    </span>
                  )}
                  {progressPercent === 100 && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      Pronto para conquistar!{" "}
                      <Sparkles className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>

                {/* Título da Tarefa */}
                <h2 className="mb-8 text-2xl leading-snug font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
                  {activeTask.title}
                </h2>

                {/* Checklist de Critérios de Aceite */}
                <div className="mb-9">
                  <div className="mb-3.5 flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                      Critérios de Aceite
                    </span>
                    <span className="text-xs font-medium text-zinc-500 tabular-nums dark:text-zinc-400">
                      {completedCriteria} de {totalCriteria} concluídos
                    </span>
                  </div>

                  <ul className="space-y-2.5">
                    {activeTask.criteria.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => toggleCriterion(item.id)}
                        className={`group flex cursor-pointer items-center gap-3.5 rounded-2xl border p-3.5 transition-all duration-200 select-none ${
                          item.done
                            ? "border-emerald-200/70 bg-emerald-50/50 dark:border-emerald-800/40 dark:bg-emerald-950/20"
                            : "border-zinc-200/70 bg-zinc-50/80 hover:border-zinc-300 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
                        }`}
                      >
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={item.done}
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                            item.done
                              ? "scale-105 border-emerald-500 bg-emerald-500 text-white shadow-2xs"
                              : "border-2 border-zinc-300 bg-white group-hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:group-hover:border-zinc-500"
                          }`}
                        >
                          {item.done && (
                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          )}
                        </button>
                        <span
                          className={`text-sm transition-all duration-200 sm:text-base ${
                            item.done
                              ? "text-zinc-400 line-through dark:text-zinc-500"
                              : "font-medium text-zinc-800 dark:text-zinc-200"
                          }`}
                        >
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Botão Principal: CONQUISTAR */}
                <div className="space-y-4">
                  <button
                    type="button"
                    disabled={!isReadyToConquer}
                    onClick={handleConquerTask}
                    className="flex w-full items-center justify-center gap-2.5 rounded-2xl px-6 py-4 text-base font-semibold tracking-tight transition-all duration-300 enabled:cursor-pointer enabled:bg-emerald-500 enabled:text-white enabled:shadow-[0_10px_30px_-5px_rgba(16,185,129,0.35)] enabled:hover:bg-emerald-400 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400 disabled:shadow-none disabled:dark:bg-zinc-800/60 disabled:dark:text-zinc-600"
                  >
                    <Trophy
                      className={`h-5 w-5 transition-transform duration-300 ${
                        isReadyToConquer ? "scale-110" : ""
                      }`}
                      strokeWidth={2.2}
                    />
                    <span>
                      {isReadyToConquer
                        ? "Conquistar Tarefa"
                        : remainingCount === 1
                          ? "Falta 1 critério para conquistar"
                          : `Faltam ${remainingCount} critérios para conquistar`}
                    </span>
                  </button>

                  {/* Ações Discretas */}
                  <div className="flex items-center justify-center gap-4 pt-1">
                    <button
                      type="button"
                      onClick={handleEditCurrentTask}
                      className="cursor-pointer rounded-lg px-2 py-1 text-xs text-zinc-400 transition-colors hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
                    >
                      Ajustar tarefa
                    </button>
                    <span className="text-zinc-300 dark:text-zinc-800">•</span>
                    <button
                      type="button"
                      onClick={() => setShowAbandonConfirm((prev) => !prev)}
                      className="cursor-pointer rounded-lg px-2 py-1 text-xs text-zinc-400 transition-colors hover:text-rose-500 dark:text-zinc-500 dark:hover:text-rose-400"
                    >
                      Desistir da missão
                    </button>
                  </div>

                  {/* Confirmação Inline Discreta */}
                  {showAbandonConfirm && (
                    <div className="animate-uno-fade pt-2">
                      <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-rose-200/70 bg-rose-50 p-3.5 sm:flex-row dark:border-rose-900/50 dark:bg-rose-950/30">
                        <span className="text-center text-xs font-medium text-rose-700 sm:text-left dark:text-rose-300">
                          Desistir zera sua sequência atual. Continuar?
                        </span>
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setShowAbandonConfirm(false)}
                            className="cursor-pointer rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                          >
                            Manter foco
                          </button>
                          <button
                            type="button"
                            onClick={handleConfirmAbandon}
                            className="cursor-pointer rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-rose-500"
                          >
                            Sim, desistir
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* =========================================================
              VISÃO 3: CELEBRAÇÃO / VITÓRIA
              ========================================================= */}
          {view === "victory" && (
            <section className="animate-uno-scale">
              <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 text-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.06)] sm:p-12 dark:border-zinc-800/90 dark:bg-[#141417] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)]">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-500 dark:bg-amber-400/10">
                  <Trophy className="h-8 w-8" strokeWidth={2} />
                </div>

                <span className="mb-3 inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                  Missão Conquistada
                </span>

                <h2 className="mb-3 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
                  {victoryData.quote}
                </h2>

                <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Você concluiu{" "}
                  <strong className="font-medium text-zinc-800 dark:text-zinc-200">
                    {`"${victoryData.title}"`}
                  </strong>{" "}
                  com 100% dos critérios atendidos.
                </p>

                <BriefStats />

                <div>
                  <button
                    type="button"
                    onClick={handleStartNextTask}
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-8 py-4 text-sm font-semibold tracking-tight text-white shadow-md transition-all hover:bg-zinc-800 hover:shadow-lg active:scale-[0.98] sm:w-auto dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
                  >
                    <span>Definir próxima única tarefa</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </section>
          )}
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
