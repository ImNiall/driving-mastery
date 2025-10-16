"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { QUESTION_BANK } from "@/constants";
import type { Question, Category } from "@/types";
import QuestionCard from "@/components/QuestionCard";
import QuizTimer from "@/components/QuizTimer";
import { ProgressService } from "@/lib/services/progress";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  FlagIcon,
  CheckIcon,
} from "@/components/icons";

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

function sampleUnique<T extends { id: number }>(
  source: T[],
  count: number,
  exclude: Set<number>,
): T[] {
  const pool = source.filter((item) => !exclude.has(item.id));
  return shuffle(pool).slice(0, Math.max(0, Math.min(count, pool.length)));
}

function pickMockQuestions(
  all: Question[],
  count: number,
  missed: Question[] = [],
): Question[] {
  const uniqueMissed = new Map<number, Question>();
  for (const q of missed) {
    if (!uniqueMissed.has(q.id)) uniqueMissed.set(q.id, q);
  }
  const prioritized = shuffle(Array.from(uniqueMissed.values()));
  const targetMissed = prioritized.slice(
    0,
    Math.min(count, prioritized.length),
  );
  const exclude = new Set(targetMissed.map((q) => q.id));
  const remaining = count - targetMissed.length;
  const fillers = remaining > 0 ? sampleUnique(all, remaining, exclude) : [];
  const combined = [...targetMissed, ...fillers];
  return shuffle(combined).slice(0, Math.min(count, combined.length));
}

type AnswerEntry = {
  qid: number;
  qIndex: number;
  choice: string;
  correct: boolean;
  category: Category;
};

type MockAttempt = {
  id: string;
  source: string | null;
  total: number | null;
  correct: number | null;
  score_percent: number | null;
  started_at: string | null;
  finished_at: string | null;
  duration_sec: number | null;
};

type MockTestContentProps = {
  variant?: "page" | "dashboard";
};

export function MockTestContent({ variant = "page" }: MockTestContentProps) {
  const router = useRouter();
  const [attemptId, setAttemptId] = React.useState<string | null>(null);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [index, setIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [answers, setAnswers] = React.useState<AnswerEntry[]>([]);
  const [finished, setFinished] = React.useState(false);
  const [results, setResults] = React.useState<{
    total: number;
    correct: number;
    score_percent: number;
  } | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [count, setCount] = React.useState<10 | 25 | 50 | null>(null);
  const [stage, setStage] = React.useState<"select" | "quiz">("select");
  const [flagged, setFlagged] = React.useState<number[]>([]);
  const [recommended, setRecommended] = React.useState<
    { category: string; scorePct: number }[]
  >([]);
  const [mpEarned, setMpEarned] = React.useState<number>(0);
  const [categoryBreakdown, setCategoryBreakdown] = React.useState<
    { category: string; correct: number; total: number; scorePct: number }[]
  >([]);
  const [reviewFilter, setReviewFilter] = React.useState<
    "all" | "correct" | "incorrect"
  >("all");
  const [history, setHistory] = React.useState<MockAttempt[]>([]);

  const loadHistory = React.useCallback(async () => {
    try {
      const overview = await ProgressService.getOverview();
      const attempts = (overview?.attempts || []) as MockAttempt[];
      const mockAttempts = attempts.filter((a) => a?.source === "mock");
      setHistory(mockAttempts);
    } catch (e) {
      console.warn("Failed to load mock test history", e);
    }
  }, []);

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

  React.useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // start after user selects count
  const startMock = async (qty: 10 | 25 | 50) => {
    try {
      setCount(qty);
      const { questions: missed } = await ProgressService.getMissedQuestions();
      const missedQuestions: Question[] = [];
      if (Array.isArray(missed) && missed.length > 0) {
        const byId = new Map(QUESTION_BANK.map((q) => [q.id, q] as const));
        for (const entry of missed) {
          const q = byId.get(entry.questionId);
          if (q) missedQuestions.push(q);
        }
      }
      const qs = pickMockQuestions(QUESTION_BANK, qty, missedQuestions);
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

  const goPrev = () => {
    setSelected(null);
    setIndex((i) => (i > 0 ? i - 1 : i));
  };

  const toggleFlag = () => {
    if (!current) return;
    setFlagged((prev) =>
      prev.includes(current.id)
        ? prev.filter((id) => id !== current.id)
        : [...prev, current.id],
    );
  };

  const current: Question | null = questions[index] ?? null;
  const total = questions.length;
  const isLast = index === total - 1;
  const isFirst = index === 0;

  const userAnswers: Record<number, string> = React.useMemo(() => {
    const m: Record<number, string> = {};
    for (const a of answers) m[a.qid] = a.choice;
    return m;
  }, [answers]);

  const answerDetails: Record<number, AnswerEntry> = React.useMemo(() => {
    const record: Record<number, AnswerEntry> = {};
    for (const a of answers) record[a.qid] = a;
    return record;
  }, [answers]);

  const questionOrder = React.useMemo(() => {
    const order: Record<number, number> = {};
    questions.forEach((q, idx) => {
      order[q.id] = idx + 1;
    });
    return order;
  }, [questions]);

  const completedHistory = React.useMemo(
    () =>
      history
        .filter((attempt) => (attempt?.total ?? 0) > 0 && attempt.finished_at)
        .sort((a, b) => {
          const da = a.finished_at ? new Date(a.finished_at).getTime() : 0;
          const db = b.finished_at ? new Date(b.finished_at).getTime() : 0;
          return db - da;
        }),
    [history],
  );

  const historySummary = React.useMemo(() => {
    const template = {
      10: { attempts: 0, last: null as MockAttempt | null },
      25: { attempts: 0, last: null as MockAttempt | null },
      50: { attempts: 0, last: null as MockAttempt | null },
    } satisfies Record<
      10 | 25 | 50,
      { attempts: number; last: MockAttempt | null }
    >;
    for (const attempt of completedHistory) {
      const total = attempt.total ?? 0;
      if (!template[total as 10 | 25 | 50]) continue;
      const entry = template[total as 10 | 25 | 50];
      entry.attempts += 1;
      if (!entry.last) {
        entry.last = attempt;
        continue;
      }
      const prevDate = entry.last.finished_at
        ? new Date(entry.last.finished_at).getTime()
        : 0;
      const currentDate = attempt.finished_at
        ? new Date(attempt.finished_at).getTime()
        : 0;
      if (currentDate > prevDate) {
        entry.last = attempt;
      }
    }
    return template;
  }, [completedHistory]);

  const formatDate = React.useCallback((iso?: string | null) => {
    if (!iso) return "";
    try {
      return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(iso));
    } catch {
      return "";
    }
  }, []);

  const unansweredCount = React.useMemo(() => {
    return questions.reduce((acc, q) => (userAnswers[q.id] ? acc : acc + 1), 0);
  }, [questions, userAnswers]);
  const flaggedCount = flagged.length;
  const correctCount = answers.filter((a) => a.correct).length;
  const incorrectCount = answers.length - correctCount;

  const filteredReviewQuestions = React.useMemo(() => {
    if (reviewFilter === "all") return questions;
    return questions.filter((q) => {
      const ans = answerDetails[q.id];
      if (!ans) return false;
      return reviewFilter === "correct" ? ans.correct : !ans.correct;
    });
  }, [questions, reviewFilter, answerDetails]);

  const reviewFilterOptions = React.useMemo(
    () => [
      { key: "all" as const, label: `All (${questions.length})` },
      { key: "correct" as const, label: `Correct (${correctCount})` },
      { key: "incorrect" as const, label: `Incorrect (${incorrectCount})` },
    ],
    [questions.length, correctCount, incorrectCount],
  );

  const handleFinishClick = async () => {
    if (finished || submitting) return;
    const needsConfirm = unansweredCount > 0 || flaggedCount > 0;
    if (needsConfirm) {
      const msgParts = [] as string[];
      if (unansweredCount > 0) msgParts.push(`${unansweredCount} unanswered`);
      if (flaggedCount > 0) msgParts.push(`${flaggedCount} flagged for review`);
      const warn = msgParts.length
        ? `You still have ${msgParts.join(" and ")}.

Are you sure you want to finish the test now?`
        : `Are you sure you want to finish the test now?`;
      const ok = window.confirm(warn);
      if (!ok) return;
    }
    await finishAttempt();
  };

  const handleSelect = async (choice: string) => {
    if (!current || !attemptId || submitting || finished) return;
    setSelected(choice);
    const correct = !!current.options.find(
      (o) => o.text === choice && o.isCorrect,
    );
    const qIndex =
      questionOrder[current.id] != null
        ? questionOrder[current.id]! - 1
        : index;
    const entry = {
      qid: current.id,
      qIndex,
      choice,
      correct,
      category: current.category as Category,
    };
    const existingIndex = answers.findIndex((a) => a.qid === current.id);
    const nextAnswers =
      existingIndex >= 0
        ? (() => {
            const next = [...answers];
            next[existingIndex] = entry;
            return next;
          })()
        : [...answers, entry];
    setAnswers(nextAnswers);
    // fire-and-forget record
    // Fire-and-forget to avoid UI lag on selection
    ProgressService.recordAnswer({
      attemptId,
      qIndex,
      questionId: current.id,
      category: current.category as unknown as string,
      choice,
      isCorrect: correct,
    }).catch((e) => console.warn("recordAnswer failed", e));

    if (isLast) {
      void finishAttempt(nextAnswers);
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

  const finishAttempt = async (overrideAnswers?: AnswerEntry[]) => {
    if (!attemptId || submitting || finished) return;
    const answerList = overrideAnswers ?? answers;
    if (answerList.length === 0) return;

    const localTotals = answerList.reduce(
      (acc, entry) => {
        acc.total += 1;
        if (entry.correct) acc.correct += 1;
        return acc;
      },
      { total: 0, correct: 0 },
    );
    const localScorePercent =
      localTotals.total > 0
        ? Math.round((localTotals.correct / localTotals.total) * 100)
        : 0;
    const optimisticResult = {
      total: localTotals.total,
      correct: localTotals.correct,
      score_percent: localScorePercent,
    };

    setSubmitting(true);
    setResults(optimisticResult);
    setFinished(true);

    try {
      // Ensure all answers are persisted before aggregation
      try {
        await ProgressService.answersBulk({
          attemptId,
          answers: answerList.map((a) => ({
            questionId: a.qid,
            qIndex: a.qIndex,
            choice: a.choice,
            correct: a.correct,
            category: a.category as unknown as string,
          })),
        });
      } catch (_) {
        // continue; per-answer events may have already been recorded
      }
      // mark finished with last index
      await ProgressService.saveProgress({
        attemptId,
        currentIndex: index,
        state: "finished",
      });
      let res = await ProgressService.finishAttempt(attemptId);
      // Retry path: if server totals are zero but we have local answers, bulk-send then finalize again
      if (res.total === 0 && answerList.length > 0) {
        try {
          await ProgressService.answersBulk({
            attemptId,
            answers: answerList.map((a) => ({
              questionId: a.qid,
              qIndex: a.qIndex,
              choice: a.choice,
              correct: a.correct,
              category: a.category as unknown as string,
            })),
          });
          res = await ProgressService.finishAttempt(attemptId);
        } catch (e) {
          console.warn("answersBulk retry failed", e);
        }
      }
      if (res.total === 0 && localTotals.total > 0) {
        res = {
          ...res,
          total: localTotals.total,
          correct: localTotals.correct,
          score_percent: localScorePercent,
        };
      }
      // award mastery points per-category simple heuristic
      try {
        const perCat: Record<string, { correct: number; total: number }> = {};
        for (const a of answerList) {
          const k = a.category as unknown as string;
          perCat[k] = perCat[k] || { correct: 0, total: 0 };
          perCat[k].total += 1;
          if (a.correct) perCat[k].correct += 1;
        }

        const perCatArray = Object.entries(perCat).map(([cat, v]) => ({
          category: cat,
          correct: v.correct,
          total: v.total,
          scorePct: v.total > 0 ? (v.correct / v.total) * 100 : 0,
        }));
        setCategoryBreakdown(perCatArray);

        const weakest = [...perCatArray]
          .filter((entry) => entry.total > 0)
          .sort((a, b) => a.scorePct - b.scorePct)
          .slice(0, 2);
        setRecommended(weakest);

        let mpSum = 0;
        await Promise.all(
          perCatArray.map(async (entry) => {
            const pts = entry.correct * 10 + (entry.scorePct >= 86 ? 25 : 0);
            if (pts > 0)
              await ProgressService.recordMastery(
                entry.category,
                Math.round(pts),
              );
            mpSum += Math.max(0, Math.round(pts));
          }),
        );
        setMpEarned(mpSum);
      } catch {}
      setResults({
        total: res.total || localTotals.total,
        correct: res.correct || localTotals.correct,
        score_percent:
          res.total === 0 && localTotals.total > 0
            ? localScorePercent
            : res.score_percent,
      });
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
                    {historySummary[len as 10 | 25 | 50].attempts > 0 ? (
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-700">
                          {historySummary[len as 10 | 25 | 50].attempts} attempt
                          {historySummary[len as 10 | 25 | 50].attempts === 1
                            ? ""
                            : "s"}
                        </p>
                        {historySummary[len as 10 | 25 | 50].last && (
                          <p className="text-xs text-gray-500">
                            Last score:{" "}
                            {historySummary[len as 10 | 25 | 50].last
                              ?.score_percent ?? 0}
                            % on{" "}
                            {formatDate(
                              historySummary[len as 10 | 25 | 50].last
                                ?.finished_at,
                            )}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span>No attempts yet.</span>
                    )}
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

          <div className="mt-10">
            <div className="rounded-2xl border border-brand-blue/20 bg-brand-blue/5 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Prefer focused practice?
                </h3>
                <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                  Jump into a 10-question quiz for a single DVSA category.
                  Perfect for revising trouble topics and tracking your
                  category-specific progress.
                </p>
              </div>
              <button
                onClick={() => router.push("/quiz-by-category")}
                className="inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/40 transition hover:bg-brand-blue-700"
              >
                Start category quiz
              </button>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Your Test History
            </h3>
            {completedHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
                <p>You haven&apos;t completed any quizzes yet.</p>
                <p className="text-sm mt-1">
                  Your history will appear here once you do!
                </p>
              </div>
            ) : (
              <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-3xl mx-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600 uppercase tracking-wide text-xs">
                    <tr>
                      <th className="px-4 py-3">Completed</th>
                      <th className="px-4 py-3">Length</th>
                      <th className="px-4 py-3">Score</th>
                      <th className="px-4 py-3">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedHistory.map((attempt) => {
                      const total = attempt.total ?? 0;
                      const passed = (attempt.score_percent ?? 0) >= 86;
                      return (
                        <tr
                          key={attempt.id}
                          className="border-t border-gray-100"
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                            {formatDate(attempt.finished_at)}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {total} questions
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`font-semibold ${passed ? "text-brand-green" : "text-brand-red"}`}
                            >
                              {attempt.score_percent ?? 0}%
                            </span>
                            <span className="text-gray-500 text-xs ml-2">
                              ({attempt.correct ?? 0}/{total})
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {attempt.duration_sec != null
                              ? `${Math.floor(attempt.duration_sec / 60)}m ${attempt.duration_sec % 60}s`
                              : "--"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  if (finished && results) {
    const pct = results.score_percent;
    const passed = pct >= 86;
    const strongestCategory = [...categoryBreakdown]
      .filter((entry) => entry.total > 0)
      .sort((a, b) => b.scorePct - a.scorePct)[0];
    const formatCategoryLabel = (category: string) =>
      category
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    const summaryNote = strongestCategory
      ? `Your strongest topic this run was ${formatCategoryLabel(strongestCategory.category)} (${Math.round(strongestCategory.scorePct)}% correct).`
      : null;
    const incorrect = results.total - results.correct;

    return (
      <main className="mx-auto max-w-5xl p-6 space-y-8">
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                Mock Test Summary
              </p>
              <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
                {passed
                  ? "Outstanding drive—you’re on track!"
                  : "Good effort, keep practising!"}
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                You answered{" "}
                <span className="font-semibold text-gray-900">
                  {results.correct}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {results.total}
                </span>{" "}
                questions correctly.
              </p>
              {summaryNote && (
                <p className="mt-3 text-sm text-gray-500">{summaryNote}</p>
              )}
            </div>
            <div className="rounded-3xl border border-gray-200 bg-slate-50 px-8 py-6 text-center shadow-sm">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Score
              </p>
              <p
                className={`mt-1 text-5xl font-extrabold ${passed ? "text-brand-green" : "text-brand-red"}`}
              >
                {pct}%
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {passed
                  ? "DVSA pass threshold met"
                  : "Aim for 86% to reach the DVSA pass mark"}
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Correct answers
              </p>
              <p className="text-xl font-semibold text-gray-900">
                {results.correct}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Incorrect answers
              </p>
              <p className="text-xl font-semibold text-gray-900">{incorrect}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Mastery points earned
              </p>
              <p className="text-xl font-semibold text-yellow-500">
                +{mpEarned} MP
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="rounded-full border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="rounded-full bg-brand-blue px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Restart Quiz
            </button>
            <button
              onClick={() => router.push("/leaderboard")}
              className="rounded-full border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Check your rank →
            </button>
          </div>
        </section>

        {categoryBreakdown.length > 0 && (
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Category Breakdown
            </h3>
            <ul className="mt-4 space-y-4">
              {[...categoryBreakdown]
                .sort((a, b) => b.scorePct - a.scorePct)
                .map((entry) => {
                  const pctRounded = Math.round(entry.scorePct);
                  const barColor =
                    pctRounded >= 70
                      ? "bg-brand-green"
                      : pctRounded >= 40
                        ? "bg-yellow-400"
                        : "bg-brand-red";
                  return (
                    <li key={entry.category} className="space-y-2">
                      <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                        <span>{formatCategoryLabel(entry.category)}</span>
                        <span className="text-gray-500">
                          {pctRounded}% ({entry.correct}/{entry.total})
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${barColor}`}
                          style={{ width: `${Math.min(entry.scorePct, 100)}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
            </ul>
          </section>
        )}

        {recommended.length > 0 && (
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Recommended Study
            </h3>
            <div className="mt-4 space-y-3">
              {recommended.map((r) => (
                <div
                  key={r.category}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {formatCategoryLabel(r.category)}
                    </p>
                    <p className="text-xs text-gray-600">
                      Your score: {Math.round(r.scorePct)}%
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/modules")}
                    className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Study now
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Review your answers
            </h3>
            <div
              className="inline-flex overflow-hidden rounded-full border border-gray-200 shadow-sm"
              role="group"
              aria-label="Filter reviewed questions"
            >
              {reviewFilterOptions.map(({ key, label }) => {
                const isActive = reviewFilter === key;
                return (
                  <button
                    key={key}
                    onClick={() => setReviewFilter(key)}
                    className={`px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-blue ${
                      isActive
                        ? "bg-brand-blue text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                    type="button"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-6">
            {filteredReviewQuestions.length === 0 ? (
              <p className="text-center text-gray-500">
                No answers match this filter yet.
              </p>
            ) : (
              filteredReviewQuestions.map((q) => {
                const ans = answerDetails[q.id];
                const questionNumber = questionOrder[q.id] ?? 0;
                return (
                  <div key={q.id}>
                    <p className="font-bold text-gray-700 mb-2">
                      Question {questionNumber}
                    </p>
                    <QuestionCard
                      question={q}
                      isReviewMode={true}
                      userAnswer={ans?.choice || null}
                      isFlagged={flagged.includes(q.id)}
                      selectedOption={null}
                      onOptionSelect={() => {}}
                      isAnswered={!!ans}
                    />
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    );
  }

  if (!current) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
        Preparing your mock test...
      </div>
    );
  }

  return (
    <div
      className={
        variant === "dashboard"
          ? "space-y-4"
          : "mx-auto max-w-4xl p-4 sm:p-6 space-y-4"
      }
    >
      <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Mock Test</h1>
          <p className="text-sm text-gray-500">
            Question {index + 1} of {total}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleFlag}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              flagged.includes(current.id)
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FlagIcon className="w-4 h-4" />
            <span>
              {flagged.includes(current.id) ? "Flagged" : "Flag for Review"}
            </span>
          </button>
          <div className="w-48">
            <QuizTimer
              initialMinutes={count === 10 ? 12 : count === 25 ? 30 : 57}
              onTimeUp={onTimeUp}
            />
          </div>
        </div>
      </div>

      <QuestionCard
        question={current}
        selectedOption={selected}
        onOptionSelect={handleSelect}
        isAnswered={selected !== null}
      />

      {/* Controls row (bottom of card) */}
      <div className="flex items-center justify-between gap-2">
        <button
          className="flex items-center bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50"
          onClick={goPrev}
          disabled={isFirst}
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" /> Previous
        </button>
        <div className="ml-auto flex gap-2">
          {!isLast && (
            <button
              disabled={selected === null}
              onClick={goNext}
              className="flex items-center bg-brand-blue text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors hover:bg-blue-600 disabled:bg-gray-300"
            >
              Next <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
          )}
          {isLast && selected !== null && (
            <button
              disabled={submitting}
              onClick={handleFinishClick}
              className="flex items-center bg-brand-green text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors hover:bg-green-600"
            >
              Show Results
            </button>
          )}
        </div>
      </div>

      {/* Bottom progress card with counts and Show Results */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-2 mb-4">
          {questions.map((q, i) => {
            const answered = Object.prototype.hasOwnProperty.call(
              userAnswers,
              q.id,
            );
            const isActive = i === index;
            const isFlag = flagged.includes(q.id);
            let btn =
              "border-2 rounded-md h-8 w-8 flex items-center justify-center font-semibold text-sm transition-colors relative ";
            if (isActive)
              btn +=
                "bg-brand-blue text-white border-brand-blue ring-2 ring-offset-1 ring-blue-400";
            else if (answered)
              btn +=
                "bg-blue-100 text-brand-blue border-blue-200 hover:bg-blue-200";
            else
              btn +=
                "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200";
            return (
              <button
                key={q.id}
                onClick={() => setIndex(i)}
                className={btn}
                aria-label={`Go to question ${i + 1}`}
              >
                {answered ? <CheckIcon className="w-4 h-4" /> : i + 1}
                {isFlag && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border border-white"></div>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-700 border-t border-gray-200 pt-3">
          <span className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500"></span>{" "}
            Correct: {correctCount}
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500"></span>{" "}
            Incorrect: {incorrectCount}
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-400"></span>{" "}
            Flagged: {flaggedCount}
          </span>
        </div>
        <div className="mt-4">
          <button
            onClick={handleFinishClick}
            className="w-full mt-2 bg-brand-green text-white font-semibold py-3 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-300"
            disabled={submitting || finished || unansweredCount > 0}
          >
            Show Results
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MockTestPage() {
  return <MockTestContent variant="page" />;
}
