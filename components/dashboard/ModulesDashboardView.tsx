"use client";

import Link from "next/link";

export default function ModulesDashboardView() {
  return (
    <section className="rounded-2xl border border-gray-200/70 bg-white p-6 shadow-sm">
      <div className="space-y-3">
        <span className="inline-flex items-center rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue">
          Learning Hub
        </span>
        <h2 className="text-2xl font-bold text-gray-900">
          Explore your theory modules
        </h2>
        <p className="text-sm text-gray-600">
          Discover refreshed checklists, practice tips, and mini quizzes built
          to prepare you for the DVSA theory test. Track your progress and pick
          up where you left off.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/modules"
          className="inline-flex items-center justify-center rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        >
          Browse modules
        </Link>
        <Link
          href="/modules/alertness"
          className="inline-flex items-center justify-center rounded-full border border-brand-blue/30 px-4 py-2 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        >
          Resume alertness module
        </Link>
      </div>
    </section>
  );
}
