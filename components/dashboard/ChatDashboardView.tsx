"use client";

import dynamic from "next/dynamic";

const BasicChat = dynamic(() => import("@/components/chat/BasicChat"), {
  ssr: false,
});

export default function ChatDashboardView() {
  return (
    <div className="rounded-3xl border border-gray-200/70 bg-white p-6 shadow-sm">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center justify-center rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-blue md:justify-start">
            Your AI driving mentor
          </div>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Chat with Theo for tailored revision support
          </h2>
          <p className="text-sm leading-6 text-gray-600 md:text-base">
            Ask follow-up questions about your theory practice, break down
            hazard perception clips, or request a study plan. Theo keeps track
            of your weak areas and serves quick prompts to keep you moving
            forward.
          </p>
        </header>

        <BasicChat />
      </div>
    </div>
  );
}
