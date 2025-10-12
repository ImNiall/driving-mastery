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
    <main className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-5xl flex-col gap-8 px-4 py-12">
      <section className="space-y-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-semibold text-brand-blue transition hover:text-brand-blue-700"
        >
          &larr; Back
        </button>
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
          Chat with Theo, your AI Mentor
        </h1>
        <p className="text-base text-slate-600 md:text-lg">
          Ask quick questions, get study strategies, or request a tailored quiz.
          Theo uses DVSA guidance and your recent performance to help you pass
          the UK theory test.
        </p>
      </section>

      <ChatWindow
        className="min-h-[520px]"
        onStartSuggestedQuiz={handleSuggestedQuiz}
      />
    </main>
  );
}
