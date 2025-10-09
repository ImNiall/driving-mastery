"use client";

import React from "react";
import ModulesViewV2 from "@/components/ModulesViewV2";
import type { LearningModule } from "@/types";
import { getWrongAnswersForModule } from "@/utils/wrongAnswers";

type Props = {
  module: LearningModule & { tags?: string[] };
};

export default function ModulePageClient({ module }: Props) {
  const handleModuleMastery = React.useCallback(
    (category: LearningModule["category"]) => {
      console.warn("Module mastered:", category);
    },
    [],
  );

  const memoisedGetWrongAnswers = React.useCallback((slug: string) => {
    try {
      return getWrongAnswersForModule(slug);
    } catch (error) {
      console.error("[ModulePageClient] Failed to read wrong answers", error);
      return [];
    }
  }, []);

  return (
    <ModulesViewV2
      module={module}
      onModuleMastery={handleModuleMastery}
      getWrongAnswersForModule={memoisedGetWrongAnswers}
    />
  );
}
