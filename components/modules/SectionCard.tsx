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
      className="bg-white rounded-3xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-sky-200"
      tabIndex={-1}
      aria-labelledby={`${id}-title`}
    >
      <div className="p-6 sm:p-8">
        <h2
          id={`${id}-title`}
          className="text-2xl font-semibold text-slate-900 tracking-tight"
        >
          {title}
        </h2>
        <div className="mt-4 space-y-4 text-base leading-7 text-slate-700">
          {children}
        </div>
      </div>
    </section>
  );
}
