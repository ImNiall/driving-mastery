"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LearningModule } from "@/types";
import { decodeEntities } from "@/lib/decodeEntities";

type Props = {
  modules: (LearningModule & { tags?: string[] })[];
  embedVariant?: boolean;
};

function ModuleListCard({
  module,
}: {
  module: LearningModule & { tags?: string[] };
}) {
  const summary = decodeEntities(module.summary ?? "");
  return (
    <Link
      href={`/modules/${module.slug}`}
      className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
            {module.category}
          </span>
          {(module.tags ?? []).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900">
            {module.title}
          </h3>
          <p className="text-sm leading-6 text-slate-600">{summary}</p>
        </div>
      </div>
      <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-sky-600">
        Start module
        <svg
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M7.5 4.5a1 1 0 0 1 1.7-.7l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 1 1-1.4-1.4L11.59 11H4.5a1 1 0 1 1 0-2h7.09L7.8 5.2a1 1 0 0 1-.3-.7Z" />
        </svg>
      </span>
    </Link>
  );
}

export default function ModulesIndexClient({ modules, embedVariant }: Props) {
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return modules;
    return modules.filter((module) => {
      return (
        module.title.toLowerCase().includes(q) ||
        module.category.toLowerCase().includes(q) ||
        (module.summary ?? "").toLowerCase().includes(q)
      );
    });
  }, [modules, query]);

  return (
    <div className={`${embedVariant ? "bg-white" : "bg-slate-50"} pb-16`}>
      {!embedVariant && (
        <div className="bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 px-4 py-14 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              Learning Hub
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Master every DVSA theory topic
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg">
              Browse structured lessons crafted to match the Highway Code. Each
              module ends with a five-question quiz so you can instantly check
              what stuck.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-white/80">
              <button
                type="button"
                onClick={() => router.push("/mock-test")}
                className="rounded-full border border-white/40 px-4 py-2 font-semibold tracking-wide transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Jump to mock tests
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="rounded-full border border-white/40 px-4 py-2 font-semibold tracking-wide transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                View your progress
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className={`mx-auto ${embedVariant ? "max-w-6xl" : "-mt-10 max-w-5xl"} px-4 sm:px-6 lg:px-8`}
      >
        <div
          className={`${
            embedVariant
              ? "rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
              : "rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8"
          }`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                All learning modules
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Filter the library to find the topic you need right now.
              </p>
            </div>
            <label className="relative w-full sm:w-auto">
              <span className="sr-only">Search modules</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by topic or keyword"
                className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-700 shadow-inner focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 sm:min-w-[260px]"
              />
            </label>
          </div>
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              {filtered.length} modules
            </p>
          </div>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {filtered.map((module) => (
              <ModuleListCard key={module.slug} module={module} />
            ))}
          </div>
          {filtered.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
              No modules match that search yet. Try a different keyword.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
