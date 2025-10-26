"use client";

import ChatLayout from "@/components/chat/ChatLayout";

export default function ChatDashboardView() {
  return (
    <div className="rounded-3xl border border-gray-200/70 bg-white p-6 shadow-sm">
      <ChatLayout
        variant="embedded"
        headerSlot={
          <header className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center justify-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-600 md:justify-start">
              Your AI driving mentor
            </div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Chat with Theo for tailored revision support
            </h2>
            <p className="text-sm leading-6 text-slate-600 md:text-base">
              Theo remembers your weak topics, progress history, and study
              goals. Pick any previous conversation or start a new one to get
              personalised guidance instantly.
            </p>
          </header>
        }
      />
    </div>
  );
}
