"use client";

import React from "react";
import type { QuizQuestion } from "@/types/module";

interface MiniQuizProps {
  slug: string;
  title: string;
  questions: QuizQuestion[];
  onProgressChange?: (value: number) => void;
}

const PASS_THRESHOLD = 0.8;
const MAX_QUESTIONS_PER_SESSION = 5;

type QuizStage = "intro" | "in-progress" | "completed";

type QuizState = {
  stage: QuizStage;
  questionOrder: string[];
  currentIndex: number;
  selections: Record<string, string>;
  answers: Record<string, string>;
  flagged: string[];
};

type StoredState = Partial<QuizState>;

const storageKey = (slug: string) => `module:${slug}:quiz`;

function readStoredState(slug: string): StoredState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey(slug));
    if (!raw) return null;
    return JSON.parse(raw) as StoredState;
  } catch (error) {
    console.warn("[quiz] failed to parse stored state", error);
    return null;
  }
}

function persistState(slug: string, state: QuizState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(slug), JSON.stringify(state));
  } catch (error) {
    console.warn("[quiz] failed to persist state", error);
  }
}

function shuffle<T>(items: readonly T[]): T[] {
  const arr = [...items];
  if (arr.length <= 1) {
    return arr;
  }
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = temp;
  }
  return arr;
}

function selectQuestionOrder(allQuestions: QuizQuestion[]): string[] {
  if (!allQuestions.length) return [];
  const desired = Math.min(MAX_QUESTIONS_PER_SESSION, allQuestions.length);
  return shuffle(allQuestions)
    .slice(0, desired)
    .map((question) => question.id);
}

function clampIndex(value: number, max: number) {
  if (Number.isNaN(value) || value < 0) return 0;
  if (!max) return 0;
  return Math.min(value, max - 1);
}

function filterRecord(
  record: Record<string, string> | undefined,
  validIds: Set<string>,
): Record<string, string> {
  if (!record) return {};
  return Object.keys(record).reduce<Record<string, string>>((acc, key) => {
    const value = record[key];
    if (typeof value === "string" && validIds.has(key)) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

function sanitizeState(
  questions: QuizQuestion[],
  seed: StoredState | null,
  fallbackOrder: string[],
): QuizState {
  const questionMap = new Map(
    questions.map((question) => [question.id, question]),
  );
  const validIds = new Set(questionMap.keys());

  let order: string[] = [];
  if (seed?.questionOrder && Array.isArray(seed.questionOrder)) {
    order = seed.questionOrder.filter(
      (id): id is string => typeof id === "string" && validIds.has(id),
    );
  }
  if (!order.length && fallbackOrder.length) {
    order = fallbackOrder.filter((id) => validIds.has(id));
  }
  if (!order.length) {
    order = selectQuestionOrder(questions);
  }

  const stageFromSeed = seed?.stage;
  const stage: QuizStage =
    stageFromSeed === "completed" || stageFromSeed === "in-progress"
      ? stageFromSeed
      : "intro";

  const currentIndexRaw =
    typeof seed?.currentIndex === "number" ? seed.currentIndex : 0;
  const currentIndex = clampIndex(currentIndexRaw, order.length);

  const selections = filterRecord(seed?.selections, validIds);
  const answers = filterRecord(seed?.answers, validIds);

  let flagged: string[] = [];
  if (Array.isArray(seed?.flagged)) {
    flagged = seed.flagged.filter(
      (id): id is string => typeof id === "string" && validIds.has(id),
    );
  }

  const sanitized: QuizState = {
    stage: order.length ? stage : "intro",
    questionOrder: order,
    currentIndex,
    selections,
    answers,
    flagged,
  };

  if (
    sanitized.stage === "completed" &&
    sanitized.questionOrder.some((id) => !sanitized.answers[id])
  ) {
    sanitized.stage = "in-progress";
  }

  return sanitized;
}

function statesAreEqual(a: QuizState, b: QuizState) {
  if (a === b) return true;
  if (a.stage !== b.stage) return false;
  if (a.currentIndex !== b.currentIndex) return false;
  if (a.questionOrder.length !== b.questionOrder.length) return false;
  for (let i = 0; i < a.questionOrder.length; i += 1) {
    if (a.questionOrder[i] !== b.questionOrder[i]) return false;
  }
  const keys = new Set([
    ...Object.keys(a.selections),
    ...Object.keys(b.selections),
  ]);
  for (const key of keys) {
    if (a.selections[key] !== b.selections[key]) return false;
  }
  const answerKeys = new Set([
    ...Object.keys(a.answers),
    ...Object.keys(b.answers),
  ]);
  for (const key of answerKeys) {
    if (a.answers[key] !== b.answers[key]) return false;
  }
  if (a.flagged.length !== b.flagged.length) return false;
  for (let i = 0; i < a.flagged.length; i += 1) {
    if (a.flagged[i] !== b.flagged[i]) return false;
  }
  return true;
}

export default function MiniQuiz({
  slug,
  title,
  questions,
  onProgressChange,
}: MiniQuizProps) {
  const [state, setState] = React.useState<QuizState>(() =>
    sanitizeState(questions, readStoredState(slug), []),
  );
  const slugRef = React.useRef(slug);

  React.useEffect(() => {
    setState((prev) => {
      const slugChanged = slugRef.current !== slug;
      const stored = slugChanged ? readStoredState(slug) : prev;
      const fallbackOrder = slugChanged ? [] : prev.questionOrder;
      const sanitized = sanitizeState(
        questions,
        stored ?? (slugChanged ? null : prev),
        fallbackOrder,
      );
      slugRef.current = slug;
      if (statesAreEqual(prev, sanitized)) {
        return prev;
      }
      return sanitized;
    });
  }, [slug, questions]);

  const questionMap = React.useMemo(() => {
    return new Map(questions.map((question) => [question.id, question]));
  }, [questions]);

  const selectedQuestions = React.useMemo(() => {
    return state.questionOrder
      .map((id) => questionMap.get(id))
      .filter((question): question is QuizQuestion => Boolean(question));
  }, [state.questionOrder, questionMap]);

  const total = selectedQuestions.length;
  const answeredCount = React.useMemo(
    () => Object.keys(state.answers).filter((id) => state.answers[id]).length,
    [state.answers],
  );
  const isQuizComplete = total > 0 && answeredCount === total;

  const currentQuestion = selectedQuestions[state.currentIndex] ?? null;

  const score = React.useMemo(() => {
    return state.questionOrder.reduce((totalScore, id) => {
      const question = questionMap.get(id);
      if (!question) return totalScore;
      const answer = state.answers[id];
      if (!answer) return totalScore;
      const option = question.options.find((item) => item.id === answer);
      return option?.correct ? totalScore + 1 : totalScore;
    }, 0);
  }, [state.questionOrder, state.answers, questionMap]);

  React.useEffect(() => {
    const progress = total ? Math.round((answeredCount / total) * 100) : 0;
    onProgressChange?.(progress);
    persistState(slug, state);
  }, [state, slug, total, answeredCount, onProgressChange]);

  const startQuiz = () => {
    setState((prev) => ({
      ...prev,
      stage: total ? "in-progress" : "intro",
      currentIndex: 0,
    }));
  };

  const submitAnswer = () => {
    if (!currentQuestion) return;
    const submittedOptionId = state.answers[currentQuestion.id];
    if (submittedOptionId) return;
    const selectedOptionId = state.selections[currentQuestion.id];
    if (!selectedOptionId) return;
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [currentQuestion.id]: selectedOptionId },
    }));
  };

  const goNext = () => {
    if (state.currentIndex >= total - 1) {
      if (isQuizComplete) {
        setState((prev) => ({
          ...prev,
          stage: "completed",
        }));
      }
      return;
    }
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
      const alreadyFlagged = prev.flagged.includes(questionId);
      const nextFlagged = alreadyFlagged
        ? prev.flagged.filter((id) => id !== questionId)
        : [...prev.flagged, questionId];
      return { ...prev, flagged: nextFlagged };
    });
  };

  const resetQuiz = () => {
    setState(() =>
      sanitizeState(
        questions,
        { stage: "intro" },
        selectQuestionOrder(questions),
      ),
    );
  };

  const reviewAnswers = () => {
    if (!total) return;
    const firstFlagged = state.flagged[0];
    const index = firstFlagged
      ? state.questionOrder.findIndex((id) => id === firstFlagged)
      : 0;
    setState((prev) => ({
      ...prev,
      stage: "in-progress",
      currentIndex: index >= 0 ? index : 0,
    }));
  };

  if (!total) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Quiz content for this module is coming soon.
        </p>
      </section>
    );
  }

  const answeredOptionId = currentQuestion
    ? state.answers[currentQuestion.id]
    : undefined;
  const selectedOptionId = currentQuestion
    ? (answeredOptionId ?? state.selections[currentQuestion.id])
    : undefined;
  const isSubmitted = Boolean(currentQuestion && answeredOptionId);

  const correctOptionId = currentQuestion?.options.find(
    (option) => option.correct,
  )?.id;
  const selectedOption = currentQuestion?.options.find(
    (option) => option.id === selectedOptionId,
  );
  const isFlagged = currentQuestion
    ? state.flagged.includes(currentQuestion.id)
    : false;

  const passMark = Math.ceil(total * PASS_THRESHOLD);
  const hasPassed = score >= passMark;

  const stage = state.stage;

  if (stage === "intro") {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          {title}
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          Ready to check your understanding? You&apos;ll answer {total}{" "}
          questions with four options each. Submit your answer to reveal the
          explanation, then move on to the next question. You can flag anything
          you&apos;d like to revisit later.
        </p>
        <button
          type="button"
          onClick={startQuiz}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        >
          Start quiz
        </button>
      </section>
    );
  }

  if (stage === "completed") {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            {title}
          </h2>
          <p className="mt-2 text-sm text-slate-600">Quiz results</p>
        </div>
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <p className="text-lg font-semibold text-slate-900">
              {score} / {total} correct
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Pass mark: {passMark} correct ({Math.round(PASS_THRESHOLD * 100)}
              %).
            </p>
          </div>
          <div
            className={`rounded-2xl px-4 py-3 text-sm ${
              hasPassed
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border border-amber-200 bg-amber-50 text-amber-700"
            }`}
          >
            {hasPassed ? (
              <p>
                Great work! You&apos;ve met the mastery standard for this
                module. Keep practising the flagged questions to cement the
                knowledge.
              </p>
            ) : (
              <p>
                You&apos;re close—review the explanations, revisit any flagged
                questions, and try again to reach the mastery mark.
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span>Flagged questions: {state.flagged.length}</span>
            <span className="hidden sm:inline" aria-hidden="true">
              •
            </span>
            <span>
              {answeredCount === total
                ? "All answers are saved—feel free to review them before resetting."
                : "Some questions are unanswered; complete them to improve your score."}
            </span>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={reviewAnswers}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-blue/40 hover:text-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            Review answers
          </button>
          <button
            type="button"
            onClick={resetQuiz}
            className="inline-flex items-center justify-center rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

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
        {currentQuestion ? (
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
        ) : null}
      </div>

      {isQuizComplete ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          You&apos;ve submitted every answer. Use the navigation to review or
          view your results.
        </div>
      ) : null}

      {currentQuestion ? (
        <form
          className="mt-5 space-y-5"
          onSubmit={(event) => event.preventDefault()}
        >
          <fieldset>
            <legend className="text-base font-semibold text-slate-900">
              {currentQuestion.prompt}
            </legend>
            <div className="mt-4 space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = option.id === selectedOptionId;
                const isCorrect = Boolean(option.correct);
                const isAnswer = answeredOptionId === option.id;
                const showFeedback = Boolean(isSubmitted);

                let optionClasses =
                  "border-slate-200 bg-slate-50 hover:border-brand-blue/40";
                if (showFeedback) {
                  if (isSelected && isCorrect) {
                    optionClasses = "border-emerald-400 bg-emerald-50";
                  } else if (isSelected && !isCorrect) {
                    optionClasses = "border-red-300 bg-red-50";
                  } else if (!isSelected && isCorrect) {
                    optionClasses = "border-emerald-200 bg-emerald-50/40";
                  } else {
                    optionClasses = "border-slate-200 bg-slate-50";
                  }
                }

                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-blue ${optionClasses}`}
                  >
                    <input
                      type="radio"
                      name={`quiz-${slug}-${currentQuestion.id}`}
                      value={option.id}
                      checked={isSelected}
                      disabled={isSubmitted}
                      onChange={() => {
                        if (isSubmitted) return;
                        setState((prev) => ({
                          ...prev,
                          selections: {
                            ...prev.selections,
                            [currentQuestion.id]: option.id,
                          },
                        }));
                      }}
                      className="mt-1 h-4 w-4 border-slate-300 text-brand-blue focus:ring-brand-blue"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {option.label}
                      </p>
                      {showFeedback && isAnswer && option.explanation ? (
                        <p className="mt-1 text-sm text-slate-600">
                          {option.explanation}
                        </p>
                      ) : null}
                      {showFeedback &&
                      !isAnswer &&
                      isCorrect &&
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
      ) : null}

      {isSubmitted ? (
        <div
          className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
            selectedOption?.id === correctOptionId
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {selectedOption?.id === correctOptionId ? (
            <p>Great work—that&apos;s correct.</p>
          ) : (
            <p>
              Not quite. The correct answer is{" "}
              <span className="font-semibold text-slate-900">
                {
                  currentQuestion?.options.find(
                    (option) => option.id === correctOptionId,
                  )?.label
                }
              </span>
              . Review the explanation before moving on.
            </p>
          )}
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-500">
          Answered {answeredCount} of {total}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={submitAnswer}
            disabled={!selectedOptionId || isSubmitted}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-blue/40 hover:text-brand-blue disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            Submit answer
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={state.currentIndex === 0}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-blue/40 hover:text-brand-blue disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={
                state.currentIndex === total - 1
                  ? !isQuizComplete
                  : !isSubmitted
              }
              className="rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:cursor-not-allowed disabled:opacity-50"
            >
              {state.currentIndex === total - 1 ? "View results" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
