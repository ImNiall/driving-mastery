"use client";
import React from "react";
import type { LearningModule, Category, Question } from "@/types";
import { QUESTION_BANK } from "@/constants";
import { ProgressService } from "@/lib/services/progress";
import { ArrowLeftIcon, FlagIcon } from "@/components/icons";
import ModuleProgress from "@/components/modules/ModuleProgress";
import QuizCard from "@/components/modules/QuizCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function pickModuleQuestions(category: Category, count = 5): Question[] {
  const filtered = QUESTION_BANK.filter(
    (q) =>
      (q.category as unknown as string) === (category as unknown as string),
  );
  const arr = [...filtered];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr.slice(0, Math.min(count, arr.length));
}

export default function MiniQuiz({
  module,
  onModuleMastery,
}: {
  module: LearningModule;
  onModuleMastery: (c: Category) => void;
}) {
  const [attemptId, setAttemptId] = React.useState<string | null>(null);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [index, setIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [answers, setAnswers] = React.useState<
    { qid: number; choice: string; correct: boolean; category: Category }[]
  >([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [finished, setFinished] = React.useState(false);
  const [flagged, setFlagged] = React.useState<number[]>([]);
  const [results, setResults] = React.useState<{
    total: number;
    correct: number;
    pct: number;
  } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        // Start mini attempt
        const qs = pickModuleQuestions(module.category, 5);
        setQuestions(qs);
        const s = await ProgressService.startAttempt("mini", module.slug);
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
      } catch (e: any) {
        setError(e?.message || "Failed to start mini quiz");
      }
    })();
  }, [module.category, module.slug]);

  const current = questions[index] ?? null;
  const isLast = index === questions.length - 1;
  const isFirst = index === 0;

  const select = (choice: string) => {
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
    void ProgressService.recordAnswer({
      attemptId,
      questionId: current.id,
      category: current.category as unknown as string,
      isCorrect: correct,
    }).catch(() => {});
  };

  const next = () => {
    setSelected(null);
    if (isLast) return;
    setIndex((i) => {
      const nextIdx = i + 1;
      if (attemptId)
        ProgressService.saveProgress({
          attemptId,
          currentIndex: nextIdx,
          state: "active",
        }).catch(() => {});
      return nextIdx;
    });
  };

  const prev = () => {
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

  const finish = async () => {
    if (!attemptId || submitting || finished) return;
    setSubmitting(true);
    try {
      await ProgressService.saveProgress({
        attemptId,
        currentIndex: index,
        state: "finished",
      });
      const res = await ProgressService.finishAttempt(attemptId);
      // Mastery on pass (>=80%)
      if (res.score_percent >= 80) {
        try {
          await ProgressService.recordMastery(
            module.category as unknown as string,
            50,
          );
        } catch {}
        onModuleMastery(module.category);
      }
      setResults({
        total: res.total,
        correct: res.correct,
        pct: res.score_percent,
      });
      setFinished(true);
    } catch (e: any) {
      setError(e?.message || "Failed to finish mini quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    );
  }

  if (finished && results) {
    const passed = results.pct >= 80;
    return (
      <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-md">
        <ModuleProgress value={100} />
        <div className="text-center space-y-3">
          <h3 className="text-2xl font-bold text-gray-800">
            {passed ? "Excellent Work!" : "Good Effort! Review & Retry."}
          </h3>
          <p className="text-gray-600">You scored</p>
          <p
            className={cn(
              "font-bold text-5xl",
              passed ? "text-green-600" : "text-red-600",
            )}
          >
            {results.correct}
            <span className="ml-1 text-3xl text-gray-500">
              / {results.total}
            </span>
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            variant="outline"
            onClick={() => {
              setFinished(false);
              setIndex(0);
              setSelected(null);
              setAnswers([]);
              setResults(null);
              setFlagged([]);
            }}
          >
            Try Again
          </Button>
          <Button onClick={() => onModuleMastery(module.category)}>
            Back to Module
          </Button>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-gray-600 shadow-md">
        Preparing mini quiz…
      </div>
    );
  }

  const selectedIndex = current.options.findIndex(
    (option) => option.text === selected,
  );
  const progressValue = questions.length
    ? Math.round((answers.length / questions.length) * 100)
    : 0;

  return (
    <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-md">
      <ModuleProgress value={progressValue} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-gray-600">
          Question {index + 1} of {questions.length}
        </p>
        <Button
          variant="outline"
          onClick={toggleFlag}
          className={cn(
            "gap-2 px-4 py-2 text-sm font-semibold",
            flagged.includes(current.id)
              ? "border-yellow-300 bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              : "text-gray-700",
          )}
          aria-pressed={flagged.includes(current.id)}
        >
          <FlagIcon className="h-4 w-4" />
          <span>
            {flagged.includes(current.id) ? "Flagged" : "Flag for Review"}
          </span>
        </Button>
      </div>

      <QuizCard
        index={index + 1}
        total={questions.length}
        question={current.question}
        options={current.options.map((option) => option.text)}
        selectedIndex={selectedIndex >= 0 ? selectedIndex : undefined}
        onSelect={(optionIndex) => {
          const choice = current.options[optionIndex];
          if (choice) {
            select(choice.text);
          }
        }}
        onNext={() => {
          if (isLast) {
            finish();
          } else {
            next();
          }
        }}
        isNextDisabled={
          selected === null || (isLast && (submitting || selected === null))
        }
        nextLabel={
          isLast
            ? submitting
              ? "Submitting…"
              : "Submit Quiz \u2192"
            : "Next \u2192"
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={prev}
          disabled={isFirst}
          className="gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Previous
        </Button>
        {isLast ? (
          <span className="ml-auto text-sm text-gray-500">
            Submit after selecting an answer to finish.
          </span>
        ) : null}
      </div>
    </div>
  );
}
