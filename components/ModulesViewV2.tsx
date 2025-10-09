import React from "react";
import { LearningModule, FinalQuizResults, Category } from "../types";
import { LEARNING_MODULES } from "../constants";
import ErrorBoundary from "./ErrorBoundary";
import MiniQuiz from "./MiniQuiz";
import Markdown from "./Markdown";
import ModuleCardV2 from "./ModuleCardV2";
import {
  getWrongAnswersForModule,
  clearWrongAnswersForModule,
} from "../utils/wrongAnswers";

interface ModulesViewProps {
  selectedModule: LearningModule | null;
  setSelectedModule: (module: LearningModule | null) => void;
  latestQuizResults: FinalQuizResults | null;
  onModuleMastery: (category: Category) => void;
  masteredModules: string[];
}
const ModuleDetailView: React.FC<{
  module: LearningModule;
  onBack: () => void;
  onModuleMastery: (category: Category) => void;
}> = ({ module, onBack, onModuleMastery }) => {
  const [learningPointsKey, setLearningPointsKey] = React.useState(0);
  const safeSlug = module.slug;
  const wrongAnswers = getWrongAnswersForModule(safeSlug) || [];
  return (
    <ErrorBoundary>
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-4xl mx-auto space-y-6">
        <button onClick={onBack} className="text-brand-blue font-semibold">
          &larr; Back to all modules
        </button>
        <h1 className="text-3xl font-bold text-gray-800">{module.title}</h1>
        <span className="inline-block text-xs font-semibold bg-brand-blue-light text-brand-blue py-1 px-2 rounded-full">
          {module.category}
        </span>
        <p className="text-gray-700">{module.summary}</p>

        {wrongAnswers.length > 0 && (
          <div
            className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg"
            key={`learning-points-${learningPointsKey}`}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">
                Your Learning Points
              </h3>
              <button
                onClick={() => {
                  clearWrongAnswersForModule(safeSlug);
                  setLearningPointsKey((prev) => prev + 1);
                }}
                className="text-xs text-amber-700 hover:text-amber-900 underline"
              >
                Mark as reviewed
              </button>
            </div>
            <p className="text-sm text-amber-700 mb-3">
              Based on your quiz performance, focus on these concepts:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              {wrongAnswers.map((answer, idx) => (
                <li key={`wrong-${idx}`} className="text-amber-800">
                  <span className="font-medium">You had difficulty with:</span>{" "}
                  &ldquo;{answer.questionText}&rdquo;
                </li>
              ))}
            </ul>
            <p className="text-sm text-amber-700 mt-3">
              These concepts are covered in this module. Pay special attention
              to the sections below.
            </p>
          </div>
        )}

        <div className="mt-6">
          <Markdown content={module.content} className="prose max-w-none" />
        </div>
        <div className="mt-8 pt-8 border-t-2 border-gray-100">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              Test Your Knowledge
            </h3>
          </div>
          <ErrorBoundary
            fallback={
              <div className="text-center p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <p className="text-yellow-800">
                  Quiz temporarily unavailable. You can still study the content
                  above.
                </p>
              </div>
            }
          >
            <MiniQuiz module={module} onModuleMastery={onModuleMastery} />
          </ErrorBoundary>
        </div>
        <p className="text-gray-500 text-sm">
          Detail view (v2) — title + category + summary + content + quiz
        </p>
      </div>
    </ErrorBoundary>
  );
};

const ModuleListView: React.FC<{
  latestQuizResults: FinalQuizResults | null;
  onSelect: (m: LearningModule) => void;
}> = ({ latestQuizResults, onSelect }) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "recommended">("all");
  const recommendedCategories = React.useMemo(() => {
    if (!latestQuizResults) return [] as string[];
    return latestQuizResults.results
      .filter((r) => r.total > 0 && (r.correct / r.total) * 100 < 86)
      .sort((a, b) => a.correct / a.total - b.correct / b.total)
      .map((r) => r.category);
  }, [latestQuizResults]);

  const filteredModules = React.useMemo(() => {
    let mods = LEARNING_MODULES;
    if (filter === "recommended" && recommendedCategories.length > 0) {
      mods = mods
        .filter((m) => recommendedCategories.includes(m.category))
        .sort(
          (a, b) =>
            recommendedCategories.indexOf(a.category) -
            recommendedCategories.indexOf(b.category),
        );
    }
    const q = searchTerm.trim().toLowerCase();
    if (!q) return mods;
    try {
      return mods.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          m.summary.toLowerCase().includes(q),
      );
    } catch (e) {
      console.error("[ModulesViewV2] search/recommended filter error:", e);
      return mods;
    }
  }, [searchTerm, filter, recommendedCategories]);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200/70 shadow-sm">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          DVSA Learning Modules
        </h2>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Browse all 14 official categories. Each module contains key
          information and a mini-quiz to test your understanding.
        </p>
      </div>
      <div className="max-w-2xl mx-auto mt-3 flex items-center justify-center space-x-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${filter === "all" ? "bg-brand-blue text-white shadow" : "bg-white text-gray-600 hover:bg-gray-100"}`}
        >
          All Modules
        </button>
        {recommendedCategories.length > 0 && (
          <button
            onClick={() => setFilter("recommended")}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${filter === "recommended" ? "bg-brand-blue text-white shadow" : "bg-white text-gray-600 hover:bg-gray-100"}`}
          >
            Recommended
          </button>
        )}
      </div>
      {filter === "recommended" && (
        <p className="text-center text-xs text-gray-500 mt-1">
          based on your most recent performance
        </p>
      )}
      <div className="max-w-2xl mx-auto mt-4">
        <input
          type="text"
          placeholder="Search for a topic..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition"
        />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredModules.map((m) => (
          <ModuleCardV2 key={String(m.slug)} module={m} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
};

const ModulesViewV2: React.FC<ModulesViewProps> = ({
  selectedModule,
  setSelectedModule,
  latestQuizResults,
  onModuleMastery,
}) => {
  if (selectedModule) {
    return (
      <ModuleDetailView
        module={selectedModule}
        onBack={() => setSelectedModule(null)}
        onModuleMastery={onModuleMastery}
      />
    );
  }
  return (
    <ModuleListView
      latestQuizResults={latestQuizResults}
      onSelect={setSelectedModule}
    />
  );
};

export default ModulesViewV2;
