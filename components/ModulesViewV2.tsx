import React from 'react';
import { LearningModule, FinalQuizResults, Category } from '../types';
import { LEARNING_MODULES } from '../constants';
import ErrorBoundary from './ErrorBoundary';
import { parseInlineMarkdown, SafeText } from '../utils/markdown';
import { assertString } from '../utils/assertString';

// Simple, safe markdown renderer (headings + paragraphs)
const SimpleMarkdown: React.FC<{ content: unknown }> = ({ content }) => {
  const text = assertString('module.content', content);
  if (!text || !text.trim()) {
    return (
      <div className="my-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
        <p className="text-yellow-800 text-sm">Module content coming soon.</p>
      </div>
    );
  }
  const lines = text.split('\n').filter(l => l.trim() !== '');
  const elements: React.ReactNode[] = [];
  lines.forEach((line, index) => {
    const t = line.trim();
    if (t.startsWith('# ')) {
      elements.push(
        <h2 key={`h1-${index}`} className="text-2xl font-bold mt-6 mb-3 text-gray-900 border-b pb-1">{t.substring(2)}</h2>
      );
      return;
    }
    if (t.startsWith('## ')) {
      elements.push(
        <h3 key={`h2-${index}`} className="text-xl font-semibold mt-5 mb-2 text-gray-800">{t.substring(3)}</h3>
      );
      return;
    }
    elements.push(
      <p key={`p-${index}`} className="my-3 text-gray-700 leading-relaxed">{parseInlineMarkdown(t)}</p>
    );
  });
  return <div>{elements}</div>;
};

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
          <h1 className="text-3xl font-bold text-gray-800">
            <SafeText value={selectedModule.title} />
          </h1>
          <span className="inline-block text-xs font-semibold bg-brand-blue-light text-brand-blue py-1 px-2 rounded-full">
            <SafeText value={selectedModule.category} />
          </span>
          <p className="text-gray-700">
            <SafeText value={selectedModule.summary} />
          </p>
          <div className="mt-6">
            <SimpleMarkdown content={selectedModule.content} />
          </div>
          <p className="text-gray-500 text-sm">Detail view (v2) — title + category + summary + content</p>
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
