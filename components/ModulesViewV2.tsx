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

export default function ModulesViewV2({
  module,
  onModuleMastery,
  getWrongAnswersForModule,
}: {
  module: LearningModule;
  onModuleMastery: (category: Category) => void;
  getWrongAnswersForModule?: (moduleSlug: string) => UserAnswer[];
}) {
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
    <div className="mx-auto max-w-5xl grid xl:grid-cols-[1fr_260px] gap-8 p-6">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <a
            href="/modules"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:text-brand-blue/80"
          >
            <span aria-hidden="true">&larr;</span>
            Back to Modules
          </a>
          <p className="text-sm text-gray-500 capitalize">{module.category}</p>
        </div>
        {sections.map((section) => (
          <SectionCard key={section.id} id={section.id} title={section.title}>
            <ModuleContent content={decodeEntities(section.content)} />
          </SectionCard>
        ))}

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100 space-y-4">
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
