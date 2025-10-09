import React from "react";
import { LearningModule } from "../types";
import { SafeText } from "../utils/markdown";
import { BookOpenIcon, ArrowRightIcon } from "./icons";

interface ModuleCardV2Props {
  module: LearningModule;
  onSelect: (module: LearningModule) => void;
}

const ModuleCardV2: React.FC<ModuleCardV2Props> = ({ module, onSelect }) => {
  return (
    <div
      className="group bg-white p-5 rounded-xl border border-gray-200/70 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(module)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(module);
      }}
      aria-label={`Open module ${module.title}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-brand-blue-light flex items-center justify-center">
            <BookOpenIcon className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <span className="inline-block text-[10px] tracking-wide font-semibold bg-brand-blue-light text-brand-blue py-1 px-2 rounded-full">
              <SafeText value={module.category} />
            </span>
            <h3 className="text-base font-bold text-gray-900 mt-1">
              <SafeText value={module.title} />
            </h3>
          </div>
        </div>
      </div>

      <p
        className="text-sm text-gray-600 mt-3"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        <SafeText value={module.summary} />
      </p>

      <div className="mt-4 inline-flex items-center text-brand-blue font-semibold text-sm">
        Start Learning
        <ArrowRightIcon className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
      </div>
    </div>
  );
};

export default ModuleCardV2;
