"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ChatWindow from "@/components/ChatWindow";
import type { QuizAction } from "@/types";

export default function MentorPage() {
  const router = useRouter();

  const handleSuggestedQuiz = React.useCallback(
    (action: QuizAction) => {
      sessionStorage.setItem(
        "mentor:lastSuggestedQuiz",
        JSON.stringify(action),
      );
      router.push("/mock-test");
    },
    [router],
  );

  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col gap-6 px-4 py-8 sm:gap-8 sm:py-12">
      <section className="space-y-3 sm:space-y-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-semibold text-brand-blue transition hover:text-brand-blue-700"
        >
          &larr; Back
        </button>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
          Chat with Theo, your AI Mentor
        </h1>
        <p className="text-base leading-relaxed text-slate-600 md:text-lg">
          Ask quick questions, get study strategies, or request a tailored quiz.
          Theo uses DVSA guidance and your recent performance to help you pass
          the UK theory test.
        </p>
      </section>

      <ChatWindow
        className="min-h-[460px] sm:min-h-[520px]"
        onStartSuggestedQuiz={handleSuggestedQuiz}
      />
    </main>
  );
}
