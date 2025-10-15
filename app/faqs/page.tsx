import React from "react";
import FaqHero from "@/components/faq/FaqHero";

export default function FaqsPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <FaqHero />
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white/60 p-8 text-center text-sm text-slate-500">
          More FAQ content is coming soon.
        </div>
      </section>
    </main>
  );
}
