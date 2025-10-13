"use client";

import React from "react";
import SectionCard from "@/components/modules/SectionCard";
import StickyTOC from "@/components/modules/StickyTOC";
import ModuleContent, {
  parseModuleSections,
} from "@/components/modules/moduleContent";
import MiniQuiz from "@/components/MiniQuiz";
import { decodeEntities } from "@/lib/decodeEntities";
import type { Category, LearningModule, UserAnswer } from "@/types";

type ModulesViewV2Props = {
  module: LearningModule;
  onModuleMastery: (category: Category) => void;
  getWrongAnswersForModule?: (moduleSlug: string) => UserAnswer[];
};

export default function ModulesViewV2({
  module,
  onModuleMastery,
  getWrongAnswersForModule,
}: ModulesViewV2Props) {
  const sections = React.useMemo(
    () => parseModuleSections(module.content),
    [module.content],
  );

  const tocItems = React.useMemo(
    () =>
      sections.map((section) => ({
        id: section.id,
        label: section.title,
      })),
    [sections],
  );

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 sm:gap-8 sm:p-6 xl:grid-cols-[1fr_260px]">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <a
            href="/modules"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:text-brand-blue/80"
          >
            <span aria-hidden="true">&larr;</span>
            Back to Modules
          </a>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 sm:text-sm sm:capitalize">
            {module.category}
          </p>
        </div>
        {sections.map((section) => (
          <SectionCard key={section.id} id={section.id} title={section.title}>
            <ModuleContent content={decodeEntities(section.content)} />
          </SectionCard>
        ))}

        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-md sm:p-8">
          <MiniQuiz
            module={module}
            onModuleMastery={onModuleMastery}
            getWrongAnswersForModule={getWrongAnswersForModule}
          />
        </div>
      </div>

      <div className="hidden xl:block">
        <StickyTOC items={tocItems} />
      </div>
    </div>
  );
}
