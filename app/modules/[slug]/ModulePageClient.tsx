"use client";

import React from "react";
import ModulesViewV2 from "@/components/ModulesViewV2";
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

  return (
    <ModulesViewV2 module={module} onModuleMastery={handleModuleMastery} />
  );
}
