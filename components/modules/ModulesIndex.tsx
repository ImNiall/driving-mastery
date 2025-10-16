"use client";

import Link from "next/link";
import React from "react";
import type { Module } from "@/types/module";
import { useModuleProgress } from "@/hooks/useModuleProgress";

type ModulesIndexProps = {
  modules: Module[];
  headingLevel?: "h2" | "h3";
};

function formatProgress(progress: number) {
  return `${Math.round(progress)}%`;
}

export default function ModulesIndex({
  modules,
  headingLevel = "h2",
}: ModulesIndexProps) {
  const [query, setQuery] = React.useState("");
  const getProgress = useModuleProgress();

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return modules;
    return modules.filter((module) => {
      return (
        module.title.toLowerCase().includes(q) ||
        module.summary.toLowerCase().includes(q) ||
        module.steps.some((step) => step.toLowerCase().includes(q))
      );
    });
  }, [modules, query]);

  const Heading = headingLevel;

  return (
    <div className="space-y-6">
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
        {filtered.map((module) => {
          const progress = getProgress(module.slug, module.progress);
          return (
            <article
              key={module.slug}
              className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-blue"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue">
                  <span>Module</span>
                  <span>{module.title.slice(0, 1)}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {module.title}
                  </h3>
                  <p className="text-sm leading-6 text-slate-600">
                    {module.summary}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                <span>
                  {module.steps.length} steps · Progress{" "}
                  {formatProgress(progress)}
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
        })}
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600 shadow-sm">
          No modules match that search yet. Try a different keyword.
        </div>
      ) : null}
    </div>
  );
}
