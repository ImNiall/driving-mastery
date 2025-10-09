import React from "react";

interface ModuleHeaderProps {
  title: string;
  summary?: string;
  category?: string;
  tags?: string[];
}

export default function ModuleHeader({
  title,
  summary,
  category,
  tags = [],
}: ModuleHeaderProps) {
  const displayTags = tags.length ? tags : category ? [category] : [];

  return (
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 p-8 text-white shadow-xl">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
      </div>
      <div className="relative space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          {displayTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>
          {summary ? (
            <p className="max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg">
              {summary}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
