"use client";
import React from "react";
import type { LearningModule, Category } from "../types";

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
        onClick={() => onModuleMastery(module.category)}
      >
        Mark as Mastered
      </button>
    </div>
  );
}
