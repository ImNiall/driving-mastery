"use client";

import Link from "next/link";
import { ChatIcon } from "@/components/icons";

export default function ChatDashboardView() {
  return (
    <div className="rounded-3xl border border-gray-200/70 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-blue">
            <ChatIcon className="h-4 w-4" />
            Coming soon to dashboard
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Chat AI Mentor</h2>
          <p className="text-sm leading-6 text-gray-600">
            Start a conversation with your AI driving mentor to review theory
            answers, practise hazard spotting, or get tailored study plans.
            We&apos;ll soon surface recent chats here—until then you can launch
            the full experience below.
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
            <li>Quick access to saved conversations</li>
            <li>Suggested prompts based on your weakest categories</li>
            <li>Inline explanations for tricky questions</li>
          </ul>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-brand-blue/10 bg-brand-blue/5 p-6 text-center">
          <p className="text-sm text-gray-600">Ready to try the assistant?</p>
          <Link
            href="/chat"
            className="inline-flex items-center justify-center rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            Open Chat Experience
          </Link>
          <Link
            href="/chat"
            className="inline-flex items-center justify-center rounded-full border border-brand-blue/20 px-5 py-2 text-sm font-semibold text-brand-blue transition hover:border-brand-blue/40 hover:text-brand-blue/80"
          >
            View recent chats
          </Link>
        </div>
      </div>
    </div>
  );
}
