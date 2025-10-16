"use client";

import React from "react";
import type { QuizQuestion } from "@/types/module";

interface MiniQuizProps {
  slug: string;
  title: string;
  questions: QuizQuestion[];
  onProgressChange?: (value: number) => void;
}

const storageKey = (slug: string) => `module:${slug}:quiz`;

type StoredState = {
  answers: Record<string, string>;
  flagged: string[];
  currentIndex: number;
};

function loadState(slug: string): StoredState {
  if (typeof window === "undefined") {
    return { answers: {}, flagged: [], currentIndex: 0 };
  }
  try {
    const raw = window.localStorage.getItem(storageKey(slug));
    if (!raw) return { answers: {}, flagged: [], currentIndex: 0 };
    const parsed = JSON.parse(raw) as StoredState;
    return {
      answers: parsed.answers ?? {},
      flagged: parsed.flagged ?? [],
      currentIndex: parsed.currentIndex ?? 0,
    };
  } catch (error) {
    console.warn("[quiz] failed to parse stored state", error);
    return { answers: {}, flagged: [], currentIndex: 0 };
  }
}

function persistState(slug: string, state: StoredState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(slug), JSON.stringify(state));
  } catch (error) {
    console.warn("[quiz] failed to persist state", error);
  }
}

function getProgress(answers: Record<string, string>, total: number) {
  if (!total) return 0;
  const answered = Object.keys(answers).length;
  return Math.round((answered / total) * 100);
}

export default function MiniQuiz({
  slug,
  title,
  questions,
  onProgressChange,
}: MiniQuizProps) {
  const [state, setState] = React.useState<StoredState>(() => loadState(slug));
  const total = questions.length;
  const currentQuestion = questions[state.currentIndex] ?? questions[0];

  React.useEffect(() => {
    const progress = getProgress(state.answers, total);
    onProgressChange?.(progress);
    persistState(slug, state);
  }, [state, total, slug, onProgressChange]);

  const selectOption = (questionId: string, optionId: string) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: optionId },
    }));
  };

  const goNext = () => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.min(prev.currentIndex + 1, total - 1),
    }));
  };

  const goPrev = () => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.max(prev.currentIndex - 1, 0),
    }));
  };

  const toggleFlag = (questionId: string) => {
    setState((prev) => {
      const flagged = prev.flagged.includes(questionId)
        ? prev.flagged.filter((id) => id !== questionId)
        : [...prev.flagged, questionId];
      return { ...prev, flagged };
    });
  };

  if (!currentQuestion) {
    return null;
  }

  const selectedOptionId = state.answers[currentQuestion.id];
  const selectedOption = currentQuestion.options.find(
    (option) => option.id === selectedOptionId,
  );
  const isFlagged = state.flagged.includes(currentQuestion.id);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            {title}
          </h2>
          <p className="text-sm text-slate-500">
            Question {state.currentIndex + 1} of {total}
          </p>
        </div>
        <button
          type="button"
          onClick={() => toggleFlag(currentQuestion.id)}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${
            isFlagged
              ? "border-brand-blue bg-brand-blue/10 text-brand-blue"
              : "border-slate-200 text-slate-600 hover:border-brand-blue/40 hover:text-brand-blue"
          }`}
        >
          {isFlagged ? "Flagged for review" : "Flag for review"}
        </button>
      </div>

      <form className="mt-5 space-y-5">
        <fieldset>
          <legend className="text-base font-semibold text-slate-900">
            {currentQuestion.prompt}
          </legend>
          <div className="mt-4 space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = option.id === selectedOptionId;
              const isCorrect = Boolean(option.correct);
              const showState = Boolean(selectedOptionId);
              return (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-blue ${
                    showState && isSelected && isCorrect
                      ? "border-emerald-400 bg-emerald-50"
                      : showState && isSelected && !isCorrect
                        ? "border-red-300 bg-red-50"
                        : "border-slate-200 bg-slate-50 hover:border-brand-blue/40"
                  }`}
                >
                  <input
                    type="radio"
                    name={`quiz-${slug}-${currentQuestion.id}`}
                    value={option.id}
                    checked={isSelected}
                    onChange={() => selectOption(currentQuestion.id, option.id)}
                    className="mt-1 h-4 w-4 border-slate-300 text-brand-blue focus:ring-brand-blue"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {option.label}
                    </p>
                    {showState && isSelected && option.explanation ? (
                      <p className="mt-1 text-sm text-slate-600">
                        {option.explanation}
                      </p>
                    ) : null}
                    {showState &&
                    !isSelected &&
                    option.correct &&
                    option.explanation ? (
                      <p className="mt-1 text-sm text-emerald-600">
                        {option.explanation}
                      </p>
                    ) : null}
                  </div>
                </label>
              );
            })}
          </div>
        </fieldset>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-500">
          Answered {Object.keys(state.answers).length} of {total}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={state.currentIndex === 0}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-blue/40 hover:text-brand-blue disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={state.currentIndex === total - 1}
            className="rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-blue/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {state.currentIndex === total - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </section>
  );
}
