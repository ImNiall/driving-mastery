"use client";

import Link from "next/link";
import React from "react";
import { ProgressService } from "@/lib/services/progress";
import type { Module } from "@/types/module";
import { useModuleProgress } from "@/hooks/useModuleProgress";

type ModulesIndexProps = {
  modules: Module[];
  headingLevel?: "h2" | "h3";
};

type WeakCandidate = {
  slug: string;
  accuracy: number;
  total: number;
};

type DismissedMap = Record<string, { total: number } | undefined>;

const RECOMMENDATION_LIMIT = 4;
const STORAGE_KEY_DISMISSED = "modules:recommended:dismissed";
const COMPLETED_KEY = (slug: string) => `module:${slug}:completed`;
const PROGRESS_KEY = (slug: string) => `module:${slug}:progress`;

function safeParseJSON<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function slugifyCategory(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

function readDismissedFromStorage(): DismissedMap {
  if (typeof window === "undefined") return {};
  const parsed = safeParseJSON<DismissedMap>(
    window.localStorage.getItem(STORAGE_KEY_DISMISSED),
  );
  if (!parsed) return {};
  return parsed;
}

function persistDismissed(value: DismissedMap) {
  if (typeof window === "undefined") return;
  const sanitized = Object.fromEntries(
    Object.entries(value).filter(([_, entry]) => entry !== undefined),
  );
  window.localStorage.setItem(STORAGE_KEY_DISMISSED, JSON.stringify(sanitized));
}

function isModuleCompleted(slug: string): boolean {
  if (typeof window === "undefined") return false;
  if (window.localStorage.getItem(COMPLETED_KEY(slug)) === "true") {
    return true;
  }
  const progressRaw = window.localStorage.getItem(PROGRESS_KEY(slug));
  if (!progressRaw) return false;
  const parsed = Number.parseFloat(progressRaw);
  return Number.isFinite(parsed) && parsed >= 100;
}

function ModuleCard({
  module,
  progress,
  badge,
}: {
  module: Module;
  progress: number;
  badge?: string;
}) {
  return (
    <article className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-blue">
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue">
          <span className="flex items-center gap-2">
            <span>Module</span>
            <span>{module.title.slice(0, 1)}</span>
          </span>
          {badge ? (
            <span className="rounded-full bg-brand-blue/10 px-2 py-1 text-[0.65rem] font-bold tracking-[0.2em] text-brand-blue">
              {badge}
            </span>
          ) : null}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900">
            {module.title}
          </h3>
          <p className="text-sm leading-6 text-slate-600">{module.summary}</p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
        <span>
          {module.steps.length} steps · Progress {formatProgress(progress)}
        </span>
        <Link
          href={`/modules/${module.slug}`}
          className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        >
          Continue
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M7.5 4.5a1 1 0 0 1 1.7-.7l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 1 1-1.4-1.4L11.59 11H4.5a1 1 0 1 1 0-2h7.09L7.8 5.2a1 1 0 0 1-.3-.7Z" />
          </svg>
        </Link>
      </div>
    </article>
  );
}

function formatProgress(progress: number) {
  return `${Math.round(progress)}%`;
}

export default function ModulesIndex({
  modules,
  headingLevel = "h2",
}: ModulesIndexProps) {
  const [query, setQuery] = React.useState("");
  const getProgress = useModuleProgress();
  const [weakCandidates, setWeakCandidates] = React.useState<WeakCandidate[]>(
    [],
  );
  const [completed, setCompleted] = React.useState<Record<string, boolean>>({});
  const [dismissed, setDismissed] = React.useState<DismissedMap>(() =>
    readDismissedFromStorage(),
  );

  const prevCompletedRef = React.useRef<Record<string, boolean>>({});

  const moduleMap = React.useMemo(() => {
    return new Map(modules.map((moduleItem) => [moduleItem.slug, moduleItem]));
  }, [modules]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return modules;
    return modules.filter((moduleItem) => {
      return (
        moduleItem.title.toLowerCase().includes(q) ||
        moduleItem.summary.toLowerCase().includes(q) ||
        moduleItem.steps.some((step) => step.toLowerCase().includes(q))
      );
    });
  }, [modules, query]);

  const Heading = headingLevel;

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const computeCompleted = () => {
      setCompleted((prev) => {
        const next: Record<string, boolean> = {};
        let changed = false;
        for (const moduleItem of modules) {
          const value = isModuleCompleted(moduleItem.slug);
          next[moduleItem.slug] = value;
          if (prev[moduleItem.slug] !== value) {
            changed = true;
          }
        }
        if (!changed && Object.keys(prev).length === modules.length) {
          return prev;
        }
        return next;
      });
    };

    computeCompleted();

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || !event.key.startsWith("module:")) return;
      computeCompleted();
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [modules]);

  React.useEffect(() => {
    let cancelled = false;
    if (typeof window === "undefined") return undefined;

    const fetchRecommendations = async () => {
      try {
        const overview = await ProgressService.getOverview();
        if (cancelled) return;
        const stats = Array.isArray(overview?.categories)
          ? overview.categories
          : [];
        const candidates = stats
          .map((item): WeakCandidate | null => {
            if (!item?.category) return null;
            const slug = slugifyCategory(String(item.category));
            if (!slug) return null;
            const total = Number(item.total ?? 0);
            const correct = Number(item.correct ?? 0);
            const accuracy = total > 0 ? correct / total : 0;
            return {
              slug,
              accuracy,
              total,
            };
          })
          .filter((candidate): candidate is WeakCandidate =>
            Boolean(candidate?.slug),
          );

        candidates.sort((a, b) => {
          if (a.accuracy !== b.accuracy) {
            return a.accuracy - b.accuracy;
          }
          return a.total - b.total;
        });

        const weakOnly = candidates.filter(
          (candidate) => candidate.total > 0 && candidate.accuracy < 0.86,
        );
        const limited = (weakOnly.length ? weakOnly : candidates).slice(
          0,
          RECOMMENDATION_LIMIT,
        );
        setWeakCandidates(limited);
      } catch (error) {
        console.warn("[modules] Failed to load recommendations", error);
        if (!cancelled) {
          setWeakCandidates([]);
        }
      }
    };

    void fetchRecommendations();

    return () => {
      cancelled = true;
    };
  }, [modules]);

  React.useEffect(() => {
    const statsBySlug = weakCandidates.reduce<Record<string, WeakCandidate>>(
      (acc, candidate) => {
        acc[candidate.slug] = candidate;
        return acc;
      },
      {},
    );
    const prevCompleted = prevCompletedRef.current;
    setDismissed((prevDismissed) => {
      let changed = false;
      const next = { ...prevDismissed };

      for (const [slug, wasCompleted] of Object.entries(prevCompleted)) {
        if (wasCompleted && !completed[slug]) {
          if (next[slug]) {
            delete next[slug];
            changed = true;
          }
        }
      }

      for (const [slug, isCompleted] of Object.entries(completed)) {
        if (!isCompleted) continue;
        if (prevCompleted[slug]) continue;
        const total = statsBySlug[slug]?.total ?? 0;
        if (!next[slug] || next[slug]?.total !== total) {
          next[slug] = { total };
          changed = true;
        }
      }

      if (changed) {
        persistDismissed(next);
        return next;
      }
      return prevDismissed;
    });
    prevCompletedRef.current = { ...completed };
  }, [completed, weakCandidates]);

  const derived = React.useMemo(() => {
    const recommendedModules: Module[] = [];
    const reenable: string[] = [];
    const seen = new Set<string>();

    for (const candidate of weakCandidates) {
      const moduleEntry = moduleMap.get(candidate.slug);
      if (!moduleEntry) continue;
      if (seen.has(moduleEntry.slug)) continue;
      const isCompleted = completed[candidate.slug];
      if (!isCompleted) {
        recommendedModules.push(moduleEntry);
        seen.add(moduleEntry.slug);
        continue;
      }
      const dismissal = dismissed[candidate.slug];
      if (!dismissal) {
        continue;
      }
      if (candidate.total > dismissal.total) {
        reenable.push(candidate.slug);
        recommendedModules.push(moduleEntry);
        seen.add(moduleEntry.slug);
      }
    }

    return { recommendedModules, reenable };
  }, [weakCandidates, moduleMap, completed, dismissed]);

  React.useEffect(() => {
    if (!derived.reenable.length) return;
    setDismissed((prevDismissed) => {
      let changed = false;
      const next = { ...prevDismissed };
      for (const slug of derived.reenable) {
        if (next[slug]) {
          delete next[slug];
          changed = true;
        }
      }
      if (changed) {
        persistDismissed(next);
        return next;
      }
      return prevDismissed;
    });
  }, [derived.reenable]);

  const recommendedSet = React.useMemo(() => {
    return new Set(
      derived.recommendedModules.map((moduleItem) => moduleItem.slug),
    );
  }, [derived.recommendedModules]);

  const modulesToRender = React.useMemo(() => {
    if (query.trim()) return filtered;
    if (!recommendedSet.size) return filtered;
    return filtered.filter(
      (moduleItem) => !recommendedSet.has(moduleItem.slug),
    );
  }, [filtered, query, recommendedSet]);

  return (
    <div className="space-y-6">
      {derived.recommendedModules.length > 0 ? (
        <section className="space-y-4 rounded-3xl bg-brand-blue/5 p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-blue">
                Recommended
              </p>
              <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                Focus on these modules next
              </h2>
              <p className="text-sm text-slate-600">
                Based on your recent quiz performance.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {derived.recommendedModules.map((recommendedModule) => {
              const progress = getProgress(
                recommendedModule.slug,
                recommendedModule.progress,
              );
              return (
                <ModuleCard
                  key={`recommended-${recommendedModule.slug}`}
                  module={recommendedModule}
                  progress={progress}
                  badge="Focus"
                />
              );
            })}
          </div>
        </section>
      ) : null}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Heading className="text-2xl font-semibold text-slate-900">
          {modules.length} module{modules.length === 1 ? "" : "s"}
        </Heading>
        <label className="relative w-full sm:w-72">
          <span className="sr-only">Search modules</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search modules"
            className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-700 shadow-inner transition focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
          <svg
            className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35M18.25 10.5a7.75 7.75 0 1 1-15.5 0 7.75 7.75 0 0 1 15.5 0Z"
            />
          </svg>
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {modulesToRender.map((moduleItem) => {
          const progress = getProgress(moduleItem.slug, moduleItem.progress);
          return (
            <ModuleCard
              key={moduleItem.slug}
              module={moduleItem}
              progress={progress}
              badge={
                recommendedSet.has(moduleItem.slug) && query.trim()
                  ? "Focus"
                  : undefined
              }
            />
          );
        })}
      </div>
      {modulesToRender.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600 shadow-sm">
          No modules match that search yet. Try a different keyword.
        </div>
      ) : null}
    </div>
  );
}
