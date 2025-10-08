"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { QUESTION_BANK } from "@/constants";
import type { Question, Category } from "@/types";
import QuestionCard from "@/components/QuestionCard";
import QuizTimer from "@/components/QuizTimer";
import { ProgressService } from "@/lib/services/progress";

function pickMockQuestions(all: Question[], count = 50): Question[] {
  // mix across categories, basic shuffle then slice
  const arr = [...all];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr.slice(0, Math.min(count, arr.length));
}

export default function MockTestPage() {
  const router = useRouter();
  const [attemptId, setAttemptId] = React.useState<string | null>(null);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [index, setIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [answers, setAnswers] = React.useState<
    { qid: number; choice: string; correct: boolean; category: Category }[]
  >([]);
  const [finished, setFinished] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [count, setCount] = React.useState<10 | 25 | 50 | null>(null);
  const [stage, setStage] = React.useState<"select" | "quiz">("select");

  // start after user selects count
  const startMock = async (qty: 10 | 25 | 50) => {
    try {
      setCount(qty);
      const qs = pickMockQuestions(QUESTION_BANK, qty);
      setQuestions(qs);
      const s = await ProgressService.startAttempt("mock");
      setAttemptId(s.attemptId);
      await ProgressService.saveProgress({
        attemptId: s.attemptId,
        currentIndex: 0,
        state: "active",
        questions: qs.map((q) => ({
          id: q.id,
          category: q.category as unknown as string,
        })),
      });
      setStage("quiz");
    } catch (e: any) {
      setError(e?.message || "Failed to start attempt");
    }
  };

  const current: Question | null = questions[index] ?? null;
  const total = questions.length;
  const isLast = index === total - 1;

  const handleSelect = async (choice: string) => {
    if (!current || !attemptId) return;
    setSelected(choice);
    const correct = !!current.options.find(
      (o) => o.text === choice && o.isCorrect,
    );
    const entry = {
      qid: current.id,
      choice,
      correct,
      category: current.category as Category,
    };
    setAnswers((prev) => [...prev, entry]);
    // fire-and-forget record
    try {
      await ProgressService.recordAnswer({
        attemptId,
        questionId: current.id,
        category: current.category as unknown as string,
        isCorrect: correct,
      });
    } catch (e) {
      // swallow to avoid blocking UX; server will still tally most events
    }
  };

  const goNext = () => {
    setSelected(null);
    if (isLast) return;
    setIndex((i) => {
      const next = i + 1;
      if (attemptId) {
        // fire-and-forget save of progress
        ProgressService.saveProgress({
          attemptId,
          currentIndex: next,
          state: "active",
        }).catch(() => {});
      }
      return next;
    });
  };

  const onTimeUp = async () => {
    await finishAttempt();
  };

  const finishAttempt = async () => {
    if (!attemptId || submitting || finished) return;
    setSubmitting(true);
    try {
      // mark finished with last index
      await ProgressService.saveProgress({
        attemptId,
        currentIndex: index,
        state: "finished",
      });
      const res = await ProgressService.finishAttempt(attemptId);
      // award mastery points per-category simple heuristic
      try {
        const perCat: Record<string, { correct: number; total: number }> = {};
        for (const a of answers) {
          const k = a.category as unknown as string;
          perCat[k] = perCat[k] || { correct: 0, total: 0 };
          perCat[k].total += 1;
          if (a.correct) perCat[k].correct += 1;
        }
        await Promise.all(
          Object.entries(perCat).map(async ([cat, v]) => {
            const pct = v.total ? (v.correct / v.total) * 100 : 0;
            const pts = v.correct * 10 + (pct >= 86 ? 25 : 0);
            if (pts > 0)
              await ProgressService.recordMastery(cat, Math.round(pts));
          }),
        );
      } catch {}
      setFinished(true);
      // simple results page inline
      alert(
        `Mock test finished. Score: ${res.correct}/${res.total} (${res.score_percent}%).`,
      );
      router.push("/dashboard");
    } catch (e: any) {
      setError(e?.message || "Failed to finish attempt");
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  if (stage === "select") {
    return (
      <main className="mx-auto max-w-3xl p-6 space-y-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            Start a Mock Test
          </h1>
          <p className="text-gray-600 mb-4">
            Choose how many questions you want to practice.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => startMock(10)}
              className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
            >
              10 Questions
            </button>
            <button
              onClick={() => startMock(25)}
              className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
            >
              25 Questions
            </button>
            <button
              onClick={() => startMock(50)}
              className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
            >
              50 Questions
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!current) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <p className="text-gray-600">Preparing your mock test...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6 space-y-4">
      <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Mock Test</h1>
          <p className="text-sm text-gray-500">
            Question {index + 1} of {total}
          </p>
        </div>
        <div className="w-48">
          <QuizTimer
            initialMinutes={count === 10 ? 12 : count === 25 ? 30 : 57}
            onTimeUp={onTimeUp}
          />
        </div>
      </div>

      <QuestionCard
        question={current}
        selectedOption={selected}
        onOptionSelect={handleSelect}
        isAnswered={selected !== null}
      />

      <div className="flex items-center justify-between gap-2">
        <button
          className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
          onClick={() => router.push("/dashboard")}
        >
          Exit
        </button>

        <div className="ml-auto flex gap-2">
          {!isLast && (
            <button
              disabled={selected === null}
              onClick={goNext}
              className="px-4 py-2 rounded-md bg-brand-blue text-white disabled:bg-gray-300"
            >
              Next
            </button>
          )}
          {isLast && (
            <button
              disabled={submitting || selected === null}
              onClick={finishAttempt}
              className="px-4 py-2 rounded-md bg-brand-green text-white disabled:bg-gray-300"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
