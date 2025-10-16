import React from "react";
import type { ModulePracticeTip } from "@/types/module";

interface PracticeTipsProps {
  tips: ModulePracticeTip[];
}

export default function PracticeTips({ tips }: PracticeTipsProps) {
  if (!tips.length) return null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
        Practice Tips
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {tips.map((tip) => {
          const isTheo = tip.tone === "theo";
          return (
            <article
              key={tip.id}
              className={`rounded-2xl border p-5 transition ${
                isTheo
                  ? "border-brand-blue bg-brand-blue/5"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                {isTheo ? "Theo’s Advice" : "Tip"}
              </h3>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {tip.label}
              </p>
              {tip.detail ? (
                <p className="mt-2 text-sm text-slate-600">{tip.detail}</p>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
