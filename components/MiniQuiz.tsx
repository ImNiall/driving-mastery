"use client";
import React from "react";
import type { LearningModule, Category, Question } from "@/types";
import { QUESTION_BANK } from "@/constants";
import { ProgressService } from "@/lib/services/progress";
import QuestionCard from "@/components/QuestionCard";
import { ArrowLeftIcon, ArrowRightIcon, FlagIcon } from "@/components/icons";

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

  const select = async (choice: string) => {
    if (!current || !attemptId) return;
    setSelected(choice);
    const correct = !!current.options.find(
      (o) => o.text === choice && o.isCorrect,
    );
    setAnswers((prev) => [
      ...prev,
      {
        qid: current.id,
        choice,
        correct,
        category: current.category as Category,
      },
    ]);
    try {
      await ProgressService.recordAnswer({
        attemptId,
        questionId: current.id,
        category: current.category as unknown as string,
        isCorrect: correct,
      });
    } catch {}
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
    return <div className="p-4 bg-red-50 text-red-600 rounded">{error}</div>;
  }

  if (finished && results) {
    const passed = results.pct >= 80;
    return (
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mt-2">
            {passed ? "Excellent Work!" : "Good Effort! Review & Retry."}
          </h3>
          <p className="text-gray-600 mt-1">You scored</p>
          <p
            className={`font-bold my-2 ${passed ? "text-brand-green" : "text-brand-red"}`}
          >
            <span className="text-6xl">{results.correct}</span>
            <span className="text-4xl text-gray-500"> / {results.total}</span>
          </p>
          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                setFinished(false);
                setIndex(0);
                setSelected(null);
                setAnswers([]);
              }}
              className="w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-black transition-colors font-semibold"
            >
              Try Again
            </button>
            <button
              onClick={() => onModuleMastery(module.category)}
              className="w-full bg-brand-blue text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors font-semibold"
            >
              Back to Module
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!current) {
    return <div className="p-4 text-gray-600">Preparing mini quiz…</div>;
  }

  return (
    <div className="bg-slate-50 p-4 rounded-lg space-y-4">
      <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">
            Question {index + 1} of {questions.length}
          </p>
        </div>
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
      </div>

      <QuestionCard
        question={current}
        selectedOption={selected}
        isAnswered={selected !== null}
        onOptionSelect={select}
      />

      <div className="flex items-center justify-between gap-2">
        <button
          onClick={prev}
          disabled={isFirst}
          className="flex items-center bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" /> Previous
        </button>
        <div className="ml-auto flex gap-2">
          {!isLast && (
            <button
              disabled={selected === null}
              onClick={next}
              className="flex items-center bg-brand-blue text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-blue-600 disabled:bg-gray-300"
            >
              Next <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
          )}
          {isLast && (
            <button
              disabled={selected === null || submitting}
              onClick={finish}
              className="flex items-center bg-brand-green text-white font-semibold py-2 px-4 rounded-lg shadow-sm disabled:bg-gray-300"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
