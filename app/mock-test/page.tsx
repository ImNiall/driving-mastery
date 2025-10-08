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

  // auto-resume: check latest unfinished attempt for mock
  React.useEffect(() => {
    (async () => {
      try {
        const latest = await ProgressService.latestAttempt("mock");
        if (
          latest &&
          !latest.finished &&
          latest.questions &&
          latest.questions.length > 0
        ) {
          setAttemptId(latest.attemptId);
          // map questions by id from QUESTION_BANK to preserve full objects
          const byId = new Map(QUESTION_BANK.map((q) => [q.id, q] as const));
          const qs: Question[] = [];
          for (const q of latest.questions) {
            const full = byId.get(q.id);
            if (full) qs.push(full);
          }
          if (qs.length > 0) {
            setQuestions(qs);
            setIndex(latest.current_index || 0);
            setStage("quiz");
          }
        }
      } catch (_) {
        // ignore; user will start a new attempt via selection
      }
    })();
  }, []);

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
      <main className="mx-auto max-w-5xl p-6">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-brand-blue font-semibold mb-6"
          >
            &larr; Back to Dashboard
          </button>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">
              Configure Your Mock Test
            </h2>
            <p className="text-gray-600 mt-2">
              Select a test length to begin. The full mock test simulates the
              official DVSA exam.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              {
                len: 10,
                title: "Quick Practice",
                desc: "A brief 10-question quiz to quickly assess your knowledge.",
              },
              {
                len: 25,
                title: "Standard Mock Test",
                desc: "A comprehensive 25-question practice test covering a range of topics.",
              },
              {
                len: 50,
                title: "Official Mock Test",
                desc: "A full-length 50-question test that mirrors the format of the official DVSA exam.",
              },
            ].map(({ len, title, desc }) => (
              <div
                key={len}
                onClick={() => startMock(len as 10 | 25 | 50)}
                className="group bg-white p-6 rounded-lg shadow-md border-2 border-transparent hover:shadow-xl hover:-translate-y-1 hover:border-brand-blue active:scale-95 active:bg-blue-50 transition-all duration-300 ease-in-out cursor-pointer flex flex-col text-center"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    startMock(len as 10 | 25 | 50);
                }}
                aria-label={`Start a ${len} question test titled ${title}`}
              >
                <h3 className="text-5xl font-bold text-brand-blue group-hover:scale-110 transition-transform duration-300 ease-in-out">
                  {len}
                </h3>
                <p className="text-lg font-semibold text-gray-800 mt-2">
                  {title}
                </p>
                <p className="text-sm text-gray-600 mt-2 mb-4 flex-grow">
                  {desc}
                </p>

                <div className="my-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500 py-4">
                    No attempts yet.
                  </div>
                </div>

                <div className="mt-auto font-semibold text-brand-blue transition-colors group-hover:text-blue-600 flex items-center justify-center">
                  <span>Start Test</span>
                  <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-300 ease-in-out ml-1">
                    &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Your Test History
            </h3>
            <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
              <p>You haven&apos;t completed any quizzes yet.</p>
              <p className="text-sm mt-1">
                Your history will appear here once you do!
              </p>
            </div>
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
