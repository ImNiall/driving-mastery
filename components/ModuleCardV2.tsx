import React from "react";
import { LearningModule } from "../types";
import { SafeText } from "../utils/markdown";

interface ModuleCardV2Props {
  module: LearningModule;
  onSelect: (module: LearningModule) => void;
}

const ModuleCardV2: React.FC<ModuleCardV2Props> = ({ module, onSelect }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200/70 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
      <div>
        <span className="inline-block text-xs font-semibold bg-brand-blue-light text-brand-blue py-1 px-2 rounded-full">
          <SafeText value={module.category} />
        </span>
        <h3 className="text-lg font-bold text-gray-800 mt-3">
          <SafeText value={module.title} />
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          <SafeText value={module.summary} />
        </p>
      </div>
      <button
        onClick={() => onSelect(module)}
        className="mt-4 self-start text-brand-blue text-sm font-semibold hover:underline inline-flex items-center gap-1"
      >
        Start Learning <span aria-hidden>→</span>
      </button>
    </div>
  );
};

export default ModuleCardV2;
