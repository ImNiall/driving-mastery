"use client";

import React from "react";
import { FAQ_SECTIONS } from "@/content/faqs";
import Link from "next/link";

type AccordionState = string | null;

const GUARANTEE_LINK = "#";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_SECTIONS.flatMap((section) =>
    section.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a.replace("(#)", GUARANTEE_LINK),
      },
    })),
  ),
};

const renderAnswer = (answer: string) => {
  if (!answer.includes("(#)")) {
    return answer;
  }
  const [before, after] = answer.split("(#)");
  return (
    <>
      {before}
      <Link
        href={GUARANTEE_LINK}
        className="font-semibold text-brand-blue underline underline-offset-2 hover:text-brand-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
      >
        Terms apply
      </Link>
      {after}
    </>
  );
};

export default function FaqsPage() {
  const [query, setQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const [openItem, setOpenItem] = React.useState<AccordionState>(null);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query.trim().toLowerCase());
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [query]);

  const filteredSections = React.useMemo(() => {
    if (!debouncedQuery) return FAQ_SECTIONS;
    return FAQ_SECTIONS.map((section) => {
      const items = section.items.filter((item) => {
        const haystack = `${item.q} ${item.a}`.toLowerCase();
        return haystack.includes(debouncedQuery);
      });
      return { ...section, items };
    }).filter((section) => section.items.length > 0);
  }, [debouncedQuery]);

  const resultCount = filteredSections.reduce(
    (total, section) => total + section.items.length,
    0,
  );

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <script
        type="application/ld+json"
        data-testid="faq-json-ld"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-wide font-semibold text-brand-blue">
          Support
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Get quick answers about Driving Mastery—from starting your revision to
          understanding payments and our Pass Guarantee.
        </p>
      </div>
      <form
        className="mt-8"
        role="search"
        aria-label="Search FAQs"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor="faq-search" className="sr-only">
          Search questions
        </label>
        <div className="relative max-w-xl">
          <input
            id="faq-search"
            type="search"
            placeholder="Search for a question or keyword"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-12 text-base text-gray-900 shadow-sm transition focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          />
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M18.25 10.5a7.75 7.75 0 11-15.5 0 7.75 7.75 0 0115.5 0z"
              />
            </svg>
          </span>
        </div>
        <p className="mt-3 text-sm text-gray-500">
          {debouncedQuery && (
            <>
              Showing {resultCount} result{resultCount === 1 ? "" : "s"} for{" "}
              <span className="font-semibold text-gray-700">
                “{debouncedQuery}”
              </span>
            </>
          )}
          {!debouncedQuery &&
            "Tip: search for “payment”, “AI Mentor”, or “hazard perception”."}
        </p>
      </form>
      <nav aria-label="FAQ categories" className="mt-10 flex flex-wrap gap-3">
        {FAQ_SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-brand-blue hover:text-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            {section.title}
          </a>
        ))}
      </nav>

      <div className="mt-12 space-y-12">
        {filteredSections.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-gray-800">
              No matches found
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Try a different keyword or browse the categories above.
            </p>
          </div>
        ) : (
          filteredSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-28"
              aria-labelledby={`${section.id}-title`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2
                  id={`${section.id}-title`}
                  className="text-2xl font-bold text-gray-900"
                >
                  {section.title}
                </h2>
                <span className="text-sm font-medium text-gray-400">
                  {section.items.length}{" "}
                  {section.items.length === 1 ? "question" : "questions"}
                </span>
              </div>
              <ul className="mt-6 space-y-4">
                {section.items.map((item, itemIndex) => {
                  const itemId = `${section.id}-${itemIndex}`;
                  const expanded = openItem === itemId;
                  return (
                    <li
                      key={itemId}
                      className="rounded-2xl border border-gray-200 bg-white shadow-sm transition focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/20"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenItem((current) =>
                            current === itemId ? null : itemId,
                          )
                        }
                        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline-none"
                        aria-expanded={expanded}
                        aria-controls={`${itemId}-panel`}
                        id={`${itemId}-trigger`}
                      >
                        <span className="text-lg font-semibold text-gray-900">
                          {item.q}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-brand-blue transition ${
                            expanded
                              ? "border-brand-blue bg-brand-blue text-white"
                              : "border-gray-200 bg-brand-blue-light"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
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
                        id={`${itemId}-panel`}
                        role="region"
                        aria-labelledby={`${itemId}-trigger`}
                        className={`grid overflow-hidden transition-all duration-200 ease-in-out ${
                          expanded
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="px-6 pb-6 pt-0 text-base text-gray-700">
                          {renderAnswer(item.a)}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>
    </main>
  );
}
