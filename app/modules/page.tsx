import Link from "next/link";
import { loadAllModules } from "@/lib/modules/data";
import ModulesIndex from "@/components/modules/ModulesIndex";

export const dynamic = "force-static";

export default async function ModulesPage() {
  const modules = await loadAllModules();

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <header className="mb-10 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-blue">
            Learning hub
          </p>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Master every DVSA theory module
          </h1>
          <p className="max-w-3xl text-base text-slate-600 sm:text-lg">
            Browse redesigned modules with checklists, practice tips, and mini
            quizzes. Complete each step to track your readiness for the theory
            test.
          </p>
          <div className="flex flex-wrap gap-3 pt-2 text-sm font-semibold">
            <Link
              href="/mock-test"
              className="rounded-full bg-brand-blue px-4 py-2 text-white transition hover:bg-brand-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              Jump to mock tests
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-brand-blue/30 px-4 py-2 text-brand-blue transition hover:bg-brand-blue/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              View my dashboard
            </Link>
          </div>
        </header>
        <ModulesIndex modules={modules} />
      </div>
    </div>
  );
}
