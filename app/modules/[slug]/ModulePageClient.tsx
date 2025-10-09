"use client";

import React from "react";
import ModulesViewV2 from "@/components/ModulesViewV2";
import type { LearningModule } from "@/types";
import { getWrongAnswersForModule } from "@/utils/wrongAnswers";

type Props = {
  module: LearningModule & { tags?: string[] };
  onModuleMastery: (category: LearningModule["category"]) => void;
};

export default function ModulePageClient({ module, onModuleMastery }: Props) {
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
      onModuleMastery={onModuleMastery}
      getWrongAnswersForModule={memoisedGetWrongAnswers}
    />
  );
}
