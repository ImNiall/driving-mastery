import React from "react";

type SectionCardProps = {
  id: string;
  title: string;
  children: React.ReactNode;
};

export default function SectionCard({ id, title, children }: SectionCardProps) {
  return (
    <section
      id={id}
      className="rounded-3xl border border-slate-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-sky-200"
      tabIndex={-1}
      aria-labelledby={`${id}-title`}
    >
      <div className="p-5 sm:p-8">
        <h2
          id={`${id}-title`}
          className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl"
        >
          {title}
        </h2>
        <div className="mt-3 space-y-3 text-base leading-7 text-slate-700 sm:mt-4 sm:space-y-4">
          {children}
        </div>
      </div>
    </section>
  );
}
