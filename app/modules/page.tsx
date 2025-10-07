"use client";
import React from "react";
import ModulesViewV2 from "@/components/ModulesViewV2";
import type { Category, FinalQuizResults, LearningModule } from "@/types";

export default function ModulesPage() {
  const [selectedModule, setSelectedModule] =
    React.useState<LearningModule | null>(null);
  const [latestQuizResults] = React.useState<FinalQuizResults | null>(null);

  const handleModuleMastery = React.useCallback((category: Category) => {
    // Placeholder: could persist mastery to Supabase later
    console.warn("Module mastered:", category);
  }, []);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <ModulesViewV2
        selectedModule={selectedModule}
        setSelectedModule={setSelectedModule}
        latestQuizResults={latestQuizResults}
        onModuleMastery={handleModuleMastery}
        masteredModules={[]}
      />
    </main>
  );
}
