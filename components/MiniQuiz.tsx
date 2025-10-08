"use client";
import React from "react";
import type { LearningModule, Category, Question } from "@/types";
import { QUESTION_BANK } from "@/constants";
import { ProgressService } from "@/lib/services/progress";
import QuestionCard from "@/components/QuestionCard";

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
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        // Start mini attempt
        const qs = pickModuleQuestions(module.category, 5);
        setQuestions(qs);
        const s = await ProgressService.startAttempt("mini");
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
  }, [module.category]);

  const current = questions[index] ?? null;
  const isLast = index === questions.length - 1;

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

  if (!current) {
    return <div className="p-4 text-gray-600">Preparing mini quiz…</div>;
  }

  return (
    <div className="bg-slate-50 p-4 rounded-lg">
      <p className="text-sm text-gray-600 mb-2">
        Question {index + 1} of {questions.length}
      </p>
      <QuestionCard
        question={current}
        selectedOption={selected}
        isAnswered={selected !== null}
        onOptionSelect={select}
      />
      <div className="mt-3 flex justify-end gap-2">
        {!isLast && (
          <button
            disabled={selected === null}
            onClick={next}
            className="px-4 py-2 rounded-md bg-brand-blue text-white disabled:bg-gray-300"
          >
            Next
          </button>
        )}
        {isLast && (
          <button
            disabled={selected === null || submitting}
            onClick={finish}
            className="px-4 py-2 rounded-md bg-brand-green text-white disabled:bg-gray-300"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
