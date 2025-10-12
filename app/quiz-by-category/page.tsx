"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { QUESTION_BANK } from "@/constants";
import { Category, type Question } from "@/types";
import { ProgressService } from "@/lib/services/progress";
import QuestionCard from "@/components/QuestionCard";
import QuizTimer from "@/components/QuizTimer";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  FlagIcon,
  CheckIcon,
} from "@/components/icons";

type Stage = "select" | "quiz" | "results";

type AnswerEntry = {
  qid: number;
  qIndex: number;
  choice: string;
  correct: boolean;
};

const QUIZ_LENGTH = 10;
const TIMER_MINUTES = 10;

const ALL_CATEGORIES = Object.values(Category);

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

function pickQuestions(source: Question[], count: number): Question[] {
  if (source.length === 0) return [];
  return shuffle(source).slice(0, Math.min(count, source.length));
}

function mapById<T extends { id: number }>(items: T[]): Map<number, T> {
  return new Map(items.map((item) => [item.id, item] as const));
}

export default function QuizByCategoryPage() {
  const router = useRouter();
  const [stage, setStage] = React.useState<Stage>("select");
  const [selectedCategory, setSelectedCategory] = React.useState<Category | "">(
    "",
  );
  const [available, setAvailable] = React.useState<Question[]>([]);
  const [warning, setWarning] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [attemptId, setAttemptId] = React.useState<string | null>(null);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [index, setIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null,
  );
  const [answers, setAnswers] = React.useState<AnswerEntry[]>([]);
  const [flagged, setFlagged] = React.useState<number[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [finished, setFinished] = React.useState(false);
  const [results, setResults] = React.useState<{
    total: number;
    correct: number;
    score_percent: number;
  } | null>(null);

  const questionById = React.useMemo(() => mapById(QUESTION_BANK), []);

  // Attempt to resume previous category attempt
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const latest = await ProgressService.latestAttempt("category");
        if (!latest || latest.source !== "category") return;
        if (!latest.questions || latest.questions.length === 0) return;
        const restoredQuestions: Question[] = [];
        const categories = new Set<string>();
        for (const q of latest.questions) {
          const full = questionById.get(q.id);
          if (full) {
            restoredQuestions.push(full);
            if (q.category) categories.add(q.category);
          }
        }
        if (restoredQuestions.length === 0) return;
        if (cancelled) return;
        setAttemptId(latest.attemptId);
        setQuestions(restoredQuestions);
        const initialIndex = Math.max(0, latest.current_index || 0);
        setIndex(initialIndex);
        const categoryValue =
          (latest.dvsa_category &&
            ALL_CATEGORIES.includes(latest.dvsa_category as Category) &&
            latest.dvsa_category) ||
          Array.from(categories)[0];
        if (
          categoryValue &&
          ALL_CATEGORIES.includes(categoryValue as Category)
        ) {
          setSelectedCategory(categoryValue as Category);
        }
        setFinished(!!latest.finished);
        setStage(latest.finished ? "results" : "quiz");
      } catch (err) {
        console.warn("Failed to resume category quiz", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [questionById]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };

  React.useEffect(() => {
    if (!selectedCategory) {
      setAvailable([]);
      setWarning(null);
      return;
    }
    const pool = QUESTION_BANK.filter((q) => q.category === selectedCategory);
    setAvailable(pool);
    if (pool.length < QUIZ_LENGTH) {
      setWarning(
        `Only ${pool.length} questions available for ${selectedCategory}. The quiz will use all available questions.`,
      );
    } else {
      setWarning(null);
    }
  }, [selectedCategory]);

  const currentQuestion = questions[index] ?? null;
  const total = questions.length;
  const isLastQuestion = index === total - 1;

  const answerMap = React.useMemo(() => {
    const map = new Map<number, AnswerEntry>();
    for (const entry of answers) {
      map.set(entry.qid, entry);
    }
    return map;
  }, [answers]);

  React.useEffect(() => {
    const current = questions[index];
    if (!current) {
      setSelectedOption(null);
      return;
    }
    const existing = answers.find((a) => a.qid === current.id);
    setSelectedOption(existing?.choice ?? null);
  }, [index, questions, answers]);

  const handleStart = async () => {
    setError(null);
    if (!selectedCategory) {
      setError("Choose a category to start.");
      return;
    }
    const pool = QUESTION_BANK.filter((q) => q.category === selectedCategory);
    if (pool.length === 0) {
      setError("No questions are available for that category.");
      return;
    }
    const chosen = pickQuestions(pool, QUIZ_LENGTH);
    if (chosen.length === 0) {
      setError("Unable to start a quiz with the selected category.");
      return;
    }
    try {
      const attempt = await ProgressService.startAttempt(
        "category",
        null,
        selectedCategory,
      );
      setAttemptId(attempt.attemptId);
      await ProgressService.saveProgress({
        attemptId: attempt.attemptId,
        currentIndex: 0,
        state: "active",
        questions: chosen.map((q) => ({
          id: q.id,
          category: q.category,
        })),
      });
      setQuestions(chosen);
      setIndex(0);
      setAnswers([]);
      setFlagged([]);
      setResults(null);
      setFinished(false);
      setStage("quiz");
    } catch (err: any) {
      setError(err?.message || "Failed to start quiz. Try again.");
    }
  };

  const handleOptionSelect = async (choice: string) => {
    if (!attemptId || !currentQuestion) return;
    setSelectedOption(choice);
    const correct = !!currentQuestion.options.find(
      (opt) => opt.text === choice && opt.isCorrect,
    );
    const entry: AnswerEntry = {
      qid: currentQuestion.id,
      qIndex: index,
      choice,
      correct,
    };
    setAnswers((prev) => {
      const existing = prev.findIndex(
        (item) => item.qid === currentQuestion.id,
      );
      if (existing >= 0) {
        const copy = [...prev];
        copy[existing] = entry;
        return copy;
      }
      return [...prev, entry];
    });
    try {
      await ProgressService.recordAnswer({
        attemptId,
        qIndex: index,
        questionId: currentQuestion.id,
        category: currentQuestion.category,
        choice,
        isCorrect: correct,
      });
    } catch (err) {
      console.warn("Failed to record answer", err);
    }
  };

  const goNext = async () => {
    if (!currentQuestion) return;
    const nextIndex = Math.min(index + 1, total - 1);
    if (attemptId) {
      try {
        await ProgressService.saveProgress({
          attemptId,
          currentIndex: nextIndex,
          state: "active",
        });
      } catch (err) {
        console.warn("Failed to save progress", err);
      }
    }
    setIndex(nextIndex);
    const nextQuestion = questions[nextIndex];
    if (nextQuestion) {
      const prevAnswer = answerMap.get(nextQuestion.id);
      setSelectedOption(prevAnswer?.choice ?? null);
    }
  };

  const goPrev = () => {
    if (index === 0) return;
    const prevIndex = index - 1;
    setIndex(prevIndex);
    const prevQuestion = questions[prevIndex];
    if (prevQuestion) {
      const prevAnswer = answerMap.get(prevQuestion.id);
      setSelectedOption(prevAnswer?.choice ?? null);
    }
  };

  const toggleFlag = (qid: number) => {
    setFlagged((prev) =>
      prev.includes(qid) ? prev.filter((id) => id !== qid) : [...prev, qid],
    );
  };

  const finishQuiz = async () => {
    if (!attemptId || submitting) return;
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
      if (questions.length > answers.length) {
        const unanswered = questions.filter((q) => !answerMap.has(q.id));
        if (unanswered.length > 0) {
          const bulk = unanswered.map((q) => ({
            qIndex: questions.indexOf(q),
            questionId: q.id,
            choice: "",
            correct: false,
            category: q.category,
          }));
          try {
            await ProgressService.answersBulk({
              attemptId,
              answers: bulk,
            });
          } catch (err) {
            console.warn("Failed to bulk record unanswered questions", err);
          }
        }
      }
      let res = await ProgressService.finishAttempt(attemptId);
      if (res.total === 0 && localTotals.total > 0) {
        try {
          await ProgressService.answersBulk({
            attemptId,
            answers: answers.map((a) => ({
              qIndex: a.qIndex,
              questionId: a.qid,
              choice: a.choice,
              correct: a.correct,
              category: selectedCategory || null,
            })),
          });
          res = await ProgressService.finishAttempt(attemptId);
        } catch (err) {
          console.warn("Retry finish attempt failed", err);
        }
      }
      setResults({
        total: res.total || localTotals.total,
        correct: res.correct || localTotals.correct,
        score_percent:
          res.total === 0 && localTotals.total > 0
            ? Math.round((localTotals.correct / localTotals.total) * 100)
            : res.score_percent,
      });
      setFinished(true);
      setStage("results");
      try {
        await ProgressService.saveProgress({
          attemptId,
          currentIndex: index,
          state: "finished",
        });
      } catch (err) {
        console.warn("Failed to mark attempt finished", err);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to finish quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  const startAgain = () => {
    setStage("select");
    setAttemptId(null);
    setQuestions([]);
    setIndex(0);
    setAnswers([]);
    setFlagged([]);
    setSelectedOption(null);
    setResults(null);
    setFinished(false);
  };

  const renderSelect = () => {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 space-y-8">
        <button
          onClick={() => router.back()}
          className="text-sm font-semibold text-brand-blue hover:text-brand-blue-700 transition"
        >
          &larr; Back
        </button>
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Quiz by Category
          </h1>
          <p className="mt-3 text-base text-slate-600 md:text-lg">
            Pick a single DVSA category to drill with a 10-question quiz. Each
            attempt is timed for 10 minutes. Progress is saved so you can resume
            later.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Question bank contains {QUESTION_BANK.length} total questions across{" "}
            {ALL_CATEGORIES.length} categories.
          </p>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-md space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Step 1: Choose a category
            </h2>
            <p className="text-sm text-slate-600">
              Only one category can be selected at a time.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {ALL_CATEGORIES.map((category) => {
              const count = QUESTION_BANK.filter(
                (q) => q.category === category,
              ).length;
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleCategorySelect(category);
                    }
                  }}
                  aria-pressed={isSelected}
                  aria-label={`Select ${category} category (${count} questions)`}
                  className={`rounded-2xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue ${isSelected ? "border-brand-blue bg-brand-blue/10 text-brand-blue" : "border-slate-200 bg-white hover:border-brand-blue/60"}`}
                >
                  <p className="text-lg font-semibold">{category}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {count} questions available
                  </p>
                </button>
              );
            })}
          </div>
          {warning && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
              {warning}
            </p>
          )}
          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </p>
          )}
          <div className="flex justify-between">
            <p className="text-xs text-slate-500">
              Quiz length is fixed at 10 questions. If fewer exist, we’ll use
              all available.
            </p>
            <button
              onClick={handleStart}
              className="rounded-full bg-brand-blue px-6 py-3 text-white font-semibold shadow-lg shadow-blue-500/40 transition hover:bg-brand-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={!selectedCategory}
            >
              Start 10-question quiz
            </button>
          </div>
        </section>
      </main>
    );
  };

  const renderQuiz = () => {
    if (!currentQuestion) {
      return (
        <main className="mx-auto max-w-4xl px-4 py-10">
          <p className="text-slate-600">Preparing your quiz…</p>
        </main>
      );
    }
    const answered = answerMap.get(currentQuestion.id);
    return (
      <main className="mx-auto max-w-4xl px-4 py-6 space-y-4">
        <div className="rounded-2xl bg-white p-4 shadow flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-blue">
              {selectedCategory}
            </p>
            <p className="text-xs text-slate-500">
              Question {index + 1} of {total}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleFlag(currentQuestion.id)}
              className={`flex items-center space-x-1 rounded-full px-3 py-1 text-xs font-semibold transition ${flagged.includes(currentQuestion.id) ? "bg-yellow-100 text-yellow-800" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`}
            >
              <FlagIcon className="h-4 w-4" />
              <span>
                {flagged.includes(currentQuestion.id)
                  ? "Flagged"
                  : "Flag for review"}
              </span>
            </button>
            <QuizTimer initialMinutes={TIMER_MINUTES} onTimeUp={finishQuiz} />
          </div>
        </div>

        <QuestionCard
          question={currentQuestion}
          selectedOption={selectedOption}
          onOptionSelect={handleOptionSelect}
          isAnswered={!!answered}
          isReviewMode={false}
          userAnswer={null}
        />

        <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow">
          <button
            onClick={goPrev}
            className="flex items-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100 disabled:opacity-50"
            disabled={index === 0}
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Previous
          </button>
          <div className="flex gap-2">
            {!isLastQuestion && (
              <button
                onClick={goNext}
                className="flex items-center rounded-lg bg-brand-blue px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-blue-700 disabled:opacity-60"
                disabled={!answerMap.has(currentQuestion.id)}
              >
                Next
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </button>
            )}
            {isLastQuestion && (
              <button
                onClick={finishQuiz}
                disabled={submitting}
                className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-blue-700 disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Finish quiz"}
              </button>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow">
          <p className="text-sm font-semibold text-slate-700">
            Question navigator
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {questions.map((q, idx) => {
              const ans = answerMap.has(q.id);
              const isActive = idx === index;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setIndex(idx);
                    const prev = answerMap.get(q.id);
                    setSelectedOption(prev?.choice ?? null);
                  }}
                  aria-label={`Go to question ${idx + 1}`}
                  className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue ${isActive ? "border-brand-blue bg-brand-blue text-white" : ans ? "border-green-200 bg-green-50 text-brand-blue" : "border-slate-200 bg-white text-slate-600 hover:border-brand-blue/60"}`}
                >
                  {ans ? <CheckIcon className="h-4 w-4" /> : idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    );
  };

  const renderResults = () => {
    if (!results || questions.length === 0) {
      return (
        <main className="mx-auto max-w-3xl px-4 py-10">
          <p className="text-slate-600">No results available.</p>
        </main>
      );
    }
    const correctQuestionIds = new Set(
      answers.filter((a) => a.correct).map((a) => a.qid),
    );
    return (
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-10">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-slate-900">
            Quiz complete: {selectedCategory}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            You answered {results.correct} out of {results.total} questions
            correctly.
          </p>
          <p className="mt-1 text-lg font-semibold text-brand-blue">
            Score: {results.score_percent}%
          </p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={startAgain}
              className="rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold text-white shadow hover:bg-brand-blue-700"
            >
              Start another category quiz
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="rounded-full border border-brand-blue px-5 py-2 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue/10"
            >
              Back to dashboard
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow">
          <h2 className="text-xl font-semibold text-slate-900">
            Review your answers
          </h2>
          <div className="mt-4 space-y-6">
            {questions.map((q, idx) => {
              const userEntry = answerMap.get(q.id);
              const isCorrect = userEntry?.correct ?? false;
              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                    <span className="text-slate-600">
                      Question {idx + 1} &mdash;{" "}
                      {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                    {flagged.includes(q.id) && (
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                        Flagged
                      </span>
                    )}
                  </div>
                  <QuestionCard
                    question={q}
                    selectedOption={null}
                    onOptionSelect={() => {}}
                    isAnswered
                    isReviewMode
                    userAnswer={userEntry?.choice ?? null}
                  />
                </div>
              );
            })}
          </div>
        </section>
      </main>
    );
  };

  if (stage === "quiz") return renderQuiz();
  if (stage === "results") return renderResults();
  return renderSelect();
}
