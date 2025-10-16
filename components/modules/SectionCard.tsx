import React from "react";

type SectionCardProps = {
  id?: string;
  title: string;
  body?: string;
  items?: string[];
  icon?: React.ReactNode;
  children?: React.ReactNode;
};

function renderBody(body?: string) {
  if (!body) return null;
  return body
    .split(/\n{2,}/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => (
      <p
        key={paragraph.slice(0, 24)}
        className="text-base leading-7 text-slate-700"
      >
        {paragraph}
      </p>
    ));
}

function renderItems(items?: string[]) {
  if (!items?.length) return null;
  return (
    <ul className="space-y-2 text-base leading-7 text-slate-700">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span
            className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-blue"
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function SectionCard({
  id,
  title,
  body,
  items,
  icon,
  children,
}: SectionCardProps) {
  const sectionId = id ?? title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <section
      id={sectionId}
      className="rounded-3xl border border-slate-200 bg-white shadow-sm focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-blue/40"
      aria-labelledby={`${sectionId}-title`}
    >
      <div className="flex gap-4 p-6 sm:p-8">
        {icon ? <div className="hidden sm:flex">{icon}</div> : null}
        <div className="space-y-4">
          <h2
            id={`${sectionId}-title`}
            className="text-xl font-semibold text-slate-900 sm:text-2xl"
          >
            {title}
          </h2>
          <div className="space-y-4">
            {renderBody(body)}
            {renderItems(items)}
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
