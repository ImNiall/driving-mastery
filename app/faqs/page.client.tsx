"use client";

import React from "react";
import Link from "next/link";
import { FAQ_SECTIONS } from "@/content/faqs";

type AccordionKey = `${string}:${string}`;

export default function FaqsPage() {
  const [query, setQuery] = React.useState("");
  const [openItem, setOpenItem] = React.useState<AccordionKey | null>(null);

  const filteredSections = React.useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return FAQ_SECTIONS;
    return FAQ_SECTIONS.map((section) => {
      const items = section.items.filter((item) => {
        const haystack = `${item.question} ${item.answer}`.toLowerCase();
        return haystack.includes(term);
      });
      return { ...section, items };
    }).filter((section) => section.items.length > 0);
  }, [query]);

  const resultCount = filteredSections.reduce(
    (acc, section) => acc + section.items.length,
    0,
  );

  const toggleItem = (sectionId: string, itemId: string) => {
    const key: AccordionKey = `${sectionId}:${itemId}`;
    setOpenItem((current) => (current === key ? null : key));
  };

  return (
    <main className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <section className="rounded-3xl bg-white px-6 py-12 shadow-xl sm:px-8 lg:px-12">
          <div className="max-w-3xl space-y-5">
            <span className="inline-flex items-center rounded-full bg-brand-blue/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue">
              Help Centre
            </span>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Frequently Asked Questions
            </h1>
            <p className="text-base text-slate-600 sm:text-lg">
              Find quick answers about memberships, mock tests, and the AI
              Mentor. Search by keyword or browse by topic to get back to your
              revision faster.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/mock-test"
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-brand-blue transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Take a mock test
              </Link>
              <a
                href="mailto:support@drivingmastery.app"
                className="rounded-full border border-brand-blue/30 px-5 py-2 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              >
                Email support
              </a>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Search the knowledge base
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Type a keyword such as “membership”, “mock test”, or “progress”.
              </p>
            </div>
            <label className="relative w-full lg:max-w-sm">
              <span className="sr-only">Search questions</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search FAQs..."
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

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            {query ? (
              <>
                <span>Results</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                  {resultCount} match{resultCount === 1 ? "" : "es"}
                </span>
              </>
            ) : (
              FAQ_SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="rounded-full border border-slate-200 px-3 py-1 text-slate-500 transition hover:border-brand-blue/50 hover:text-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
                >
                  {section.title}
                </a>
              ))
            )}
          </div>
        </section>

        <section className="mt-10 space-y-10">
          {filteredSections.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800">
                No results found
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Try another keyword or reach out to{" "}
                <a
                  href="mailto:support@drivingmastery.app"
                  className="font-semibold text-brand-blue underline decoration-2 underline-offset-2"
                >
                  support@drivingmastery.app
                </a>
                .
              </p>
            </div>
          ) : (
            filteredSections.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {section.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {section.items.length} FAQ
                      {section.items.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>

                <ul className="mt-6 space-y-4">
                  {section.items.map((item) => {
                    const key: AccordionKey = `${section.id}:${item.id}`;
                    const expanded = openItem === key;
                    return (
                      <li
                        key={item.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50"
                      >
                        <button
                          type="button"
                          onClick={() => toggleItem(section.id, item.id)}
                          className="flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
                          aria-expanded={expanded}
                          aria-controls={`${key}-panel`}
                          id={`${key}-trigger`}
                        >
                          <span className="text-base font-semibold text-slate-900 sm:text-lg">
                            {item.question}
                          </span>
                          <span
                            aria-hidden="true"
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-brand-blue transition ${
                              expanded
                                ? "border-brand-blue bg-brand-blue text-white"
                                : "border-slate-200 bg-white"
                            }`}
                          >
                            <svg
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              {expanded ? (
                                <path strokeLinecap="round" d="M6 12h12" />
                              ) : (
                                <path
                                  strokeLinecap="round"
                                  d="M12 6v12m-6-6h12"
                                />
                              )}
                            </svg>
                          </span>
                        </button>
                        <div
                          id={`${key}-panel`}
                          role="region"
                          aria-labelledby={`${key}-trigger`}
                          className={`grid overflow-hidden px-5 transition-all duration-200 ease-in-out ${
                            expanded
                              ? "grid-rows-[1fr] py-0 pb-5"
                              : "grid-rows-[0fr] py-0"
                          }`}
                        >
                          <div className="overflow-hidden text-sm leading-6 text-slate-700">
                            {item.answer}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </section>

        <section className="mt-12 rounded-3xl border border-brand-blue/30 bg-white px-6 py-10 text-center shadow-lg sm:px-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Can’t find your answer?
          </h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            Our support team is on hand to help with billing, technical
            questions, and anything else you need to keep progressing.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="mailto:support@drivingmastery.app"
              className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              Email support@drivingmastery.app
            </a>
            <Link
              href="/dashboard"
              className="rounded-full border border-brand-blue px-6 py-3 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              Return to dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
