"use client";

import React from "react";
import ModulesViewV2 from "@/components/ModulesViewV2";
import { getWrongAnswersForModule } from "@/utils/wrongAnswers";
import type { LearningModule } from "@/types";

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

  const memoisedGetWrongAnswers = React.useCallback(
    (moduleSlug: string) => getWrongAnswersForModule(moduleSlug),
    [],
  );

  return (
    <ModulesViewV2
      module={module}
      onModuleMastery={handleModuleMastery}
      getWrongAnswersForModule={memoisedGetWrongAnswers}
    />
  );
}
