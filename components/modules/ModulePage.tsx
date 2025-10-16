"use client";

import React from "react";
import ModuleHeader from "@/components/modules/ModuleHeader";
import ModuleStepper from "@/components/modules/ModuleStepper";
import SectionCard from "@/components/modules/SectionCard";
import Checklist from "@/components/modules/Checklist";
import PracticeTips from "@/components/modules/PracticeTips";
import MiniQuiz from "@/components/modules/MiniQuiz";
import CompleteCta from "@/components/modules/CompleteCta";
import type { Module } from "@/types/module";

interface ModulePageProps {
  module: Module;
  moduleNumber: number;
  totalModules: number;
  nextModule?: { slug: string; title: string } | null;
}

function calculateChecklistProgress(module: Module) {
  if (!module.checklist?.length) return 0;
  try {
    if (typeof window === "undefined") return 0;
    const raw = window.localStorage.getItem(`module:${module.slug}:checklist`);
    if (!raw) return 0;
    const state = JSON.parse(raw) as Record<string, boolean>;
    const total = module.checklist.length || 1;
    const complete = module.checklist.filter(
      (item) => state[item.id] || item.done,
    ).length;
    return Math.round((complete / total) * 100);
  } catch {
    return 0;
  }
}

function calculateQuizProgress(module: Module) {
  if (!module.quiz?.questions?.length) return 0;
  try {
    if (typeof window === "undefined") return 0;
    const raw = window.localStorage.getItem(`module:${module.slug}:quiz`);
    if (!raw) return 0;
    const state = JSON.parse(raw) as {
      answers?: Record<string, string>;
      questionOrder?: string[];
    };
    const answered = Object.keys(state.answers ?? {}).length;
    const total =
      state.questionOrder?.length || module.quiz.questions.length || 1;
    const safeTotal = total || 1;
    return Math.round((Math.min(answered, safeTotal) / safeTotal) * 100);
  } catch {
    return 0;
  }
}

export default function ModulePage({
  module,
  moduleNumber,
  totalModules,
  nextModule,
}: ModulePageProps) {
  const [checklistProgress, setChecklistProgress] = React.useState(0);
  const [quizProgress, setQuizProgress] = React.useState(0);
  const [manualComplete, setManualComplete] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  React.useEffect(() => {
    setChecklistProgress(calculateChecklistProgress(module));
    setQuizProgress(calculateQuizProgress(module));
    if (typeof window !== "undefined") {
      setManualComplete(
        window.localStorage.getItem(`module:${module.slug}:completed`) ===
          "true",
      );
      setIsBookmarked(
        window.localStorage.getItem(`module:${module.slug}:bookmark`) ===
          "true",
      );
    }
  }, [module]);

  const interactiveSegments = React.useMemo(() => {
    const segments: number[] = [];
    if (module.checklist?.length) segments.push(checklistProgress);
    if (module.quiz?.questions?.length) segments.push(quizProgress);
    return segments;
  }, [module, checklistProgress, quizProgress]);

  const derivedProgress = React.useMemo(() => {
    if (manualComplete) return 100;
    if (interactiveSegments.length) {
      const total = interactiveSegments.reduce((acc, value) => acc + value, 0);
      return Math.round(total / interactiveSegments.length);
    }
    return module.progress;
  }, [interactiveSegments, module.progress, manualComplete]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      `module:${module.slug}:progress`,
      derivedProgress.toString(),
    );
  }, [module.slug, derivedProgress]);

  const handleBookmark = () => {
    if (typeof window === "undefined") return;
    const next = !isBookmarked;
    setIsBookmarked(next);
    window.localStorage.setItem(`module:${module.slug}:bookmark`, String(next));
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const shareData = {
      title: module.title,
      text: module.summary,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.warn("Share cancelled", error);
      }
    } else {
      await navigator.clipboard.writeText(shareData.url);
      alert("Link copied to clipboard");
    }
  };

  const markComplete = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`module:${module.slug}:completed`, "true");
    }
    setManualComplete(true);
    setChecklistProgress(100);
    setQuizProgress(100);
  };

  return (
    <div className="space-y-8">
      <ModuleHeader
        slug={module.slug}
        title={module.title}
        summary={module.summary}
        progress={derivedProgress}
        moduleNumber={moduleNumber}
        totalModules={totalModules}
        onBookmark={handleBookmark}
        onShare={handleShare}
        isBookmarked={isBookmarked}
        nextModule={nextModule}
      />

      <ModuleStepper steps={module.steps} currentStep={module.stepIndex} />

      <div className="space-y-6">
        {module.sections.map((section) => (
          <SectionCard
            key={section.id}
            id={section.id}
            title={section.title}
            body={section.body}
            items={section.items}
          />
        ))}
      </div>

      {module.checklist?.length ? (
        <Checklist
          slug={module.slug}
          items={module.checklist}
          onProgressChange={setChecklistProgress}
        />
      ) : null}

      {module.practiceTips?.length ? (
        <PracticeTips tips={module.practiceTips} />
      ) : null}

      {module.quiz ? (
        <MiniQuiz
          slug={module.slug}
          title={module.quiz.title}
          questions={module.quiz.questions}
          onProgressChange={setQuizProgress}
        />
      ) : null}

      <CompleteCta onComplete={markComplete} nextModule={nextModule} />
    </div>
  );
}
