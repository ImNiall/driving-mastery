"use client";
import React from "react";
import type { LearningModule, Category } from "../types";
import { ProgressService } from "@/lib/services/progress";

interface MiniQuizWrapperProps {
  module: LearningModule;
  onModuleMastery: (category: Category) => void;
}

export default function MiniQuizWrapper({
  module,
  onModuleMastery,
}: MiniQuizWrapperProps) {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
      <p className="text-gray-700">
        Mini-quiz for <span className="font-semibold">{module.title}</span>{" "}
        coming soon.
      </p>
      <button
        className="mt-3 inline-flex items-center rounded-full bg-brand-blue px-4 py-2 text-white text-sm font-semibold hover:opacity-90"
        onClick={async () => {
          try {
            await ProgressService.recordMastery(module.category, 50);
          } catch (e) {
            console.error("recordMastery failed", e);
          }
          onModuleMastery(module.category);
        }}
      >
        Mark as Mastered
      </button>
    </div>
  );
}
