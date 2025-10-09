"use client";

import React from "react";
import SectionCard from "@/components/modules/SectionCard";
import StickyTOC from "@/components/modules/StickyTOC";
import ModuleContent, {
  ModuleSection,
  parseModuleSections,
} from "@/components/modules/moduleContent";
import ModuleHeader from "@/components/modules/ModuleHeader";
import ModuleLayout from "@/components/modules/ModuleLayout";
import MiniQuiz from "@/components/MiniQuiz";
import { decodeEntities } from "@/lib/decodeEntities";
import type { Category, LearningModule, UserAnswer } from "@/types";
import {
  clearWrongAnswersForModule,
  getWrongAnswersForModule as getStoredWrongAnswers,
} from "@/utils/wrongAnswers";

type ModuleRecord = LearningModule & { tags?: string[] };

type Props = {
  module: ModuleRecord;
  onModuleMastery: (category: Category) => void;
  getWrongAnswersForModule?: (slug: string) => UserAnswer[] | undefined;
};

function useWrongAnswers(
  slug: string,
  provider?: (slug: string) => UserAnswer[] | undefined,
) {
  const fetcher = provider ?? getStoredWrongAnswers;
  const [answers, setAnswers] = React.useState<UserAnswer[]>([]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const result = fetcher(slug) ?? [];
      setAnswers(result);
    } catch (error) {
      console.error(
        `[ModulesViewV2] Failed to load wrong answers for ${slug}`,
        error,
      );
      setAnswers([]);
    }
  }, [fetcher, slug]);

  const clear = React.useCallback(() => {
    try {
      clearWrongAnswersForModule(slug);
    } catch (error) {
      console.error(
        `[ModulesViewV2] Failed to clear wrong answers for ${slug}`,
        error,
      );
    }
    setAnswers([]);
  }, [slug]);

  return { answers, clear };
}

function LearningFocusCard({
  answers,
  onClear,
}: {
  answers: UserAnswer[];
  onClear: () => void;
}) {
  if (!answers.length) return null;

  return (
    <section className="rounded-3xl border border-amber-200 bg-amber-50/90 p-6 shadow-inner sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-amber-900">
            Target your weak spots
          </h2>
          <p className="text-sm text-amber-800">
            These notes come from your last attempt. Revisit the sections below
            before retrying the quiz.
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="self-start rounded-full border border-amber-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-amber-800 transition-colors hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
        >
          Mark as reviewed
        </button>
      </div>
      <ul className="mt-4 space-y-3 text-sm text-amber-900">
        {answers.map((answer, index) => (
          <li key={`focus-${index}`} className="flex gap-3">
            <span
              aria-hidden
              className="mt-1 h-2 w-2 flex-none rounded-full bg-amber-500"
            />
            <span>{decodeEntities(answer.questionText ?? "")}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ModulesViewV2({
  module,
  onModuleMastery,
  getWrongAnswersForModule,
}: Props) {
  const safeSlug = module.slug;
  const { answers: wrongAnswers, clear } = useWrongAnswers(
    safeSlug,
    getWrongAnswersForModule,
  );

  const sections = React.useMemo<ModuleSection[]>(
    () => parseModuleSections(module.content),
    [module.content],
  );

  const decodedSections = React.useMemo(
    () =>
      sections.map((section) => ({
        ...section,
        content: decodeEntities(section.content),
      })),
    [sections],
  );

  const tocItems = React.useMemo(
    () =>
      decodedSections.map((section) => ({
        id: section.id,
        label: section.title,
      })),
    [decodedSections],
  );

  return (
    <ModuleLayout>
      <ModuleHeader
        title={module.title}
        summary={module.summary}
        category={module.category}
        tags={module.tags}
      />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-8">
          <LearningFocusCard answers={wrongAnswers} onClear={clear} />
          {decodedSections.map((section) => (
            <SectionCard key={section.id} id={section.id} title={section.title}>
              <ModuleContent content={section.content} />
            </SectionCard>
          ))}
          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <header className="border-b border-slate-100 px-6 py-5 sm:px-8">
              <h2 className="text-2xl font-semibold text-slate-900">
                Test your understanding
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Finish the lesson by answering a focused mini quiz. You can use
                your keyboard to pick options.
              </p>
            </header>
            <div className="px-6 py-6 sm:px-8">
              <MiniQuiz module={module} onModuleMastery={onModuleMastery} />
            </div>
          </section>
        </div>
        <StickyTOC items={tocItems} />
      </div>
    </ModuleLayout>
  );
}
