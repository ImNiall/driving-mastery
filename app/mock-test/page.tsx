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

type AnswerEntry = {
  qid: number;
  choice: string;
  correct: boolean;
  category: Category;
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
  const [reviewFilter, setReviewFilter] = React.useState<
    "all" | "correct" | "incorrect"
  >("all");

  const renderContainer = (
    children: React.ReactNode,
    {
      maxWidth = "max-w-6xl",
      padding = "px-4 py-10",
    }: { maxWidth?: string; padding?: string } = {},
  ) => {
    if (variant === "dashboard") {
      return <div>{children}</div>;
    }
    return (
      <main className="min-h-screen bg-slate-50">
        <div className={`mx-auto ${maxWidth} ${padding}`}>{children}</div>
      </main>
    );
  };

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
    setAnswers((prev) => {
      const existingIndex = prev.findIndex((a) => a.qid === current.id);
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = entry;
        return next;
      }
      return [...prev, entry];
    });
    // fire-and-forget record
    // Fire-and-forget to avoid UI lag on selection
    ProgressService.recordAnswer({
      attemptId,
      questionId: current.id,
      category: current.category as unknown as string,
      isCorrect: correct,
    }).catch((e) => console.warn("recordAnswer failed", e));
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
      const localTotals = answers.reduce(
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
      // Ensure all answers are persisted before aggregation
      try {
        await ProgressService.answersBulk({
          attemptId,
          answers: answers.map((a) => ({
            qid: a.qid,
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
      if (res.total === 0 && answers.length > 0) {
        try {
          await ProgressService.answersBulk({
            attemptId,
            answers: answers.map((a) => ({
              qid: a.qid,
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
        for (const a of answers) {
          const k = a.category as unknown as string;
          perCat[k] = perCat[k] || { correct: 0, total: 0 };
          perCat[k].total += 1;
          if (a.correct) perCat[k].correct += 1;
        }
        // build recommended (two weakest categories with at least one attempt)
        const weakest = Object.entries(perCat)
          .filter(([, v]) => v.total > 0)
          .map(([cat, v]) => ({
            category: cat,
            scorePct: (v.correct / v.total) * 100,
          }))
          .sort((a, b) => a.scorePct - b.scorePct)
          .slice(0, 2);
        setRecommended(weakest);
        let mpSum = 0;
        await Promise.all(
          Object.entries(perCat).map(async ([cat, v]) => {
            const pct = v.total ? (v.correct / v.total) * 100 : 0;
            const pts = v.correct * 10 + (pct >= 86 ? 25 : 0);
            if (pts > 0)
              await ProgressService.recordMastery(cat, Math.round(pts));
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
      setFinished(true);
    } catch (e: any) {
      setError(e?.message || "Failed to finish attempt");
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return renderContainer(
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        <p className="font-semibold">We couldn&apos;t start your mock test.</p>
        <p className="mt-1 break-words">{error}</p>
      </div>,
      { maxWidth: "max-w-3xl", padding: "px-4 py-10" },
    );
  }

  if (stage === "select") {
    return renderContainer(
      <div className="animate-fade-in space-y-10 mx-auto max-w-5xl">
        {variant === "page" && (
          <button
            onClick={() => router.push("/dashboard")}
            className="text-brand-blue font-semibold"
          >
            &larr; Back to Dashboard
          </button>
        )}

        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Configure Your Mock Test
          </h2>
          <p className="mt-2 text-gray-600">
            Select a test length to begin. The full mock test simulates the
            official DVSA exam.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
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
              className="group flex cursor-pointer flex-col rounded-lg border-2 border-transparent bg-white p-6 text-center shadow-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-brand-blue hover:shadow-xl active:scale-95 active:bg-blue-50"
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ")
                  startMock(len as 10 | 25 | 50);
              }}
              aria-label={`Start a ${len} question test titled ${title}`}
            >
              <h3 className="text-5xl font-bold text-brand-blue transition-transform duration-300 ease-in-out group-hover:scale-110">
                {len}
              </h3>
              <p className="mt-2 text-lg font-semibold text-gray-800">
                {title}
              </p>
              <p className="mt-2 mb-4 flex-grow text-sm text-gray-600">
                {desc}
              </p>

              <div className="my-4 border-t border-gray-200 pt-4">
                <div className="py-4 text-sm text-gray-500">
                  No attempts yet.
                </div>
              </div>

              <div className="mt-auto flex items-center justify-center font-semibold text-brand-blue transition-colors group-hover:text-blue-600">
                <span>Start Test</span>
                <span className="ml-1 inline-block transition-transform duration-300 ease-in-out group-hover:translate-x-1">
                  &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 text-center shadow-md">
          <h3 className="text-2xl font-bold text-gray-800">
            Your Test History
          </h3>
          <div className="mt-4 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-500">
            <p>You haven&apos;t completed any quizzes yet.</p>
            <p className="mt-1">Your history will appear here once you do!</p>
          </div>
        </div>
      </div>,
      {
        maxWidth: variant === "dashboard" ? "max-w-4xl" : "max-w-5xl",
        padding: variant === "dashboard" ? "px-0 py-0" : "px-4 py-10",
      },
    );
  }

  if (finished && results) {
    const pct = results.score_percent;
    const passed = pct >= 86;
    return renderContainer(
      <div className="space-y-8">
        <div className="rounded-lg bg-white p-6 text-center shadow-xl md:p-8">
          <div className="mx-auto mb-2 text-3xl font-bold {passed ? 'text-yellow-500' : 'text-blue-500'}"></div>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {passed
              ? "Congratulations, you passed!"
              : "Good Effort, Keep Practicing!"}
          </h2>
          <p className="text-lg text-gray-600 mt-2">You scored:</p>
          <p
            className={`text-7xl font-bold my-4 ${passed ? "text-brand-green" : "text-brand-red"}`}
          >
            {pct}%
          </p>
          <p className="text-gray-500 text-lg">
            ({results.correct} out of {results.total} correct)
          </p>
          <hr className="my-6" />
          <div className="text-center">
            <p className="text-sm text-gray-600">Mastery Points Earned</p>
            <p className="text-2xl font-extrabold text-yellow-500">
              +{mpEarned} MP
            </p>
            <button
              onClick={() => router.push("/leaderboard")}
              className="text-brand-blue text-sm font-semibold mt-1 hover:underline"
            >
              Check your new rank →
            </button>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors font-semibold text-lg"
            >
              Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-brand-blue text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors font-semibold text-lg"
            >
              Restart Quiz
            </button>
          </div>
        </div>

        {recommended.length > 0 && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Recommended Study
            </h3>
            <div className="space-y-3">
              {recommended.map((r) => (
                <div
                  key={r.category}
                  className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-md border border-slate-200"
                >
                  <div>
                    <p className="font-semibold capitalize">{r.category}</p>
                    <p className="text-sm text-gray-600">
                      Your score: {Math.round(r.scorePct)}%
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/modules")}
                    className="bg-white border border-gray-300 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-gray-50"
                  >
                    Study Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-2 pt-6">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Review Your Answers
          </h3>
          <div className="flex justify-center mb-6">
            <div
              className="inline-flex rounded-md shadow-sm overflow-hidden"
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
                    } ${
                      key === "all"
                        ? "rounded-l-md"
                        : key === "incorrect"
                          ? "rounded-r-md"
                          : ""
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
        </div>
      </div>,
      {
        maxWidth: "max-w-4xl",
        padding: variant === "dashboard" ? "px-0 py-0" : "px-4 py-10",
      },
    );
  }

  if (!current) {
    return renderContainer(
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
        Preparing your mock test...
      </div>,
      { maxWidth: "max-w-3xl", padding: "px-4 py-10" },
    );
  }

  return renderContainer(
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow">
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
              className="flex items-center bg-brand-blue text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-blue-600 disabled:bg-gray-300"
            >
              Next <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
          )}
          {isLast && (
            <button
              disabled={submitting || selected === null}
              onClick={finishAttempt}
              className="flex items-center bg-gray-300 text-gray-600 font-semibold py-2 px-4 rounded-lg shadow-sm cursor-not-allowed"
            >
              Submit
            </button>
          )}
        </div>
      </div>

      {/* Bottom progress card with counts and Finish Test */}
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
            onClick={async () => {
              if (finished || submitting) return;
              const msgParts = [] as string[];
              if (unansweredCount > 0)
                msgParts.push(`${unansweredCount} unanswered`);
              if (flaggedCount > 0)
                msgParts.push(`${flaggedCount} flagged for review`);
              const warn = msgParts.length
                ? `You still have ${msgParts.join(" and ")}.\n\nAre you sure you want to finish the test now?`
                : `Are you sure you want to finish the test now?`;
              const ok = window.confirm(warn);
              if (!ok) return;
              await finishAttempt();
            }}
            className="w-full mt-2 bg-brand-green text-white font-semibold py-3 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-300"
            disabled={submitting || finished}
          >
            Finish Test
          </button>
        </div>
      </div>
    </div>,
    {
      maxWidth: "max-w-4xl",
      padding: variant === "dashboard" ? "px-0 py-0" : "px-4 sm:px-6 py-8",
    },
  );
}

export default function MockTestPage() {
  return <MockTestContent variant="page" />;
}
