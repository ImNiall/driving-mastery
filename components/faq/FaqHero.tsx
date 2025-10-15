import React from "react";

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19a8.5 8.5 0 1 0-6.01-2.49 8.5 8.5 0 0 0 6.01 2.49Zm0 0 6 6"
    />
  </svg>
);

export default function FaqHero() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-8 rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand-blue">
          FAQ Hub
        </span>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
            Everything you need to know about Driving Mastery—from features to
            pricing and how to get the most from Theo, your AI mentor.
          </p>
          <p className="text-sm text-slate-500 sm:text-base">
            Search below or browse by category to find instant answers.
          </p>
        </div>
        <form className="w-full max-w-2xl" role="search">
          <label htmlFor="faq-search" className="sr-only">
            Search FAQs
          </label>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="faq-search"
              type="search"
              placeholder="Search FAQs (e.g. ‘cancel subscription’ or ‘AI mentor’ )"
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-4 text-base text-slate-900 shadow-sm transition-colors focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              autoComplete="off"
            />
          </div>
        </form>
      </div>
    </section>
  );
}
