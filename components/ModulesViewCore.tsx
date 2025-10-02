import React from 'react';
import { LearningModule, Category, FinalQuizResults } from '../types';
import ErrorBoundary from './ErrorBoundary';

interface ModulesViewProps {
  selectedModule: LearningModule | null;
  setSelectedModule: (module: LearningModule | null) => void;
  latestQuizResults: FinalQuizResults | null;
  onModuleMastery: (category: Category) => void;
  masteredModules: string[];
}

const ModulesViewCore: React.FC<ModulesViewProps> = ({ selectedModule, setSelectedModule }) => {
  // Core scaffold: no list, no SEO, no markdown, no quiz

  if (selectedModule) {
    return (
      <ErrorBoundary>
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-3xl mx-auto space-y-4">
          <button onClick={() => setSelectedModule(null)} className="text-brand-blue font-semibold">&larr; Back</button>
          <h1 className="text-2xl font-bold text-gray-800">Module detail (core)</h1>
          <p className="text-gray-600">Core scaffold only. We will add fields step-by-step.</p>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="bg-white p-6 rounded-lg shadow" data-build-version="modules-core">
        <h1 className="text-2xl font-bold text-gray-800">Modules (core)</h1>
        <p className="text-gray-600 mt-2">Scaffold only — no list yet.</p>
      </div>
    </ErrorBoundary>
  );
};

export default ModulesViewCore;
