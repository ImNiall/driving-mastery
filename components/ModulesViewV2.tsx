import React from 'react';
import { LearningModule, FinalQuizResults, Category } from '../types';
import { LEARNING_MODULES } from '../constants';
import ErrorBoundary from './ErrorBoundary';
import { SafeText } from '../utils/markdown';

interface ModulesViewProps {
  selectedModule: LearningModule | null;
  setSelectedModule: (module: LearningModule | null) => void;
  latestQuizResults: FinalQuizResults | null;
  onModuleMastery: (category: Category) => void;
  masteredModules: string[];
}
const ModulesViewV2: React.FC<ModulesViewProps> = ({ selectedModule, setSelectedModule }) => {
  if (selectedModule) {
    return (
      <ErrorBoundary>
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-4xl mx-auto space-y-6">
          <button onClick={() => setSelectedModule(null)} className="text-brand-blue font-semibold">&larr; Back to all modules</button>
          <h1 className="text-3xl font-bold text-gray-800">Module detail (v2)</h1>
          <p className="text-gray-600">We will restore fields step-by-step.</p>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800">Modules (v2)</h1>
      <ul className="mt-4 divide-y divide-gray-100">
        {LEARNING_MODULES.map((m) => (
          <li key={String(m.slug)} className="py-4 flex items-start justify-between">
            <div className="pr-4">
              <span className="text-xs font-semibold bg-brand-blue-light text-brand-blue py-1 px-2 rounded-full">
                <SafeText value={m.category} />
              </span>
              <h3 className="text-lg font-bold text-gray-800 mt-2">
                <SafeText value={m.title} />
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                <SafeText value={m.summary} />
              </p>
            </div>
            <button
              onClick={() => setSelectedModule(m)}
              className="self-center bg-brand-blue text-white text-sm font-semibold px-3 py-2 rounded hover:bg-blue-700"
            >
              Open
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModulesViewV2;
