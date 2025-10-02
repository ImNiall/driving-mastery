import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { LearningModule, Category, FinalQuizResults, Question as QuestionType, UserAnswer } from '../types';
import { LEARNING_MODULES, QUESTION_BANK } from '../constants';
import ErrorBoundary from './ErrorBoundary';
import ModuleCard from './ModuleCard';
import Seo from './Seo';
import JsonLd from './JsonLd';
import { SITE_URL } from '../config/seo';
import { parseInlineMarkdown, SafeText } from '../utils/markdown';
import { assertString } from '../utils/assertString';
import QuestionCard from './QuestionCard';

interface ModulesViewProps {
  selectedModule: LearningModule | null;
  setSelectedModule: (module: LearningModule | null) => void;
  latestQuizResults: FinalQuizResults | null;
  onModuleMastery: (category: Category) => void;
  masteredModules: string[];
}

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

// Lightweight MiniQuiz for module detail
const MiniQuizV2: React.FC<{ module: LearningModule; onModuleMastery: (category: Category) => void; }> = ({ module, onModuleMastery }) => {
  const [state, setState] = useState<'idle' | 'active' | 'finished'>('idle');
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);

  const load = useCallback(() => {
    const filtered = QUESTION_BANK.filter(q => q.category === module.category);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
  }, [module.category]);

  useEffect(() => { load(); }, [load]);

  const score = answers.filter(a => a.isCorrect).length;

  if (questions.length < 5) {
    return (
      <div className="text-center p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600">More practice questions for this module are coming soon!</p>
      </div>
    );
  }

  if (state === 'idle') {
    return (
      <div className="bg-slate-100 p-6 rounded-lg text-center">
        <h3 className="text-xl font-bold text-gray-800">Ready to test your knowledge?</h3>
        <button className="mt-4 bg-brand-blue text-white font-semibold px-4 py-2 rounded" onClick={() => { setState('active'); setIndex(0); setSelected(null); setSubmitted(false); setAnswers([]); load(); }}>Start Quiz</button>
      </div>
    );
  }

  if (state === 'finished') {
    const passed = score >= 4;
    return (
      <div className="bg-slate-100 p-6 rounded-lg text-center">
        <h3 className="text-xl font-bold text-gray-800">{passed ? 'Excellent Work!' : 'Good Effort!'}</h3>
        <p className="text-gray-700 mt-2">You scored {score} / {questions.length}</p>
        <div className="mt-4 space-x-2">
          <button className="bg-gray-800 text-white px-4 py-2 rounded" onClick={() => { setState('active'); setIndex(0); setSelected(null); setSubmitted(false); setAnswers([]); load(); }}>Try Again</button>
        </div>
      </div>
    );
  }

  // active
  return (
    <div className="bg-slate-100 p-4 rounded-lg">
      <p className="text-center text-sm font-semibold text-gray-600 mb-3">Question {index + 1} of {questions.length}</p>
      <QuestionCard
        question={questions[index]}
        selectedOption={selected}
        isAnswered={submitted}
        onOptionSelect={(opt) => { if (!submitted) setSelected(opt); }}
      />
      <div className="mt-4">
        {submitted ? (
          <button className="w-full bg-brand-blue text-white py-2 rounded" onClick={() => {
            if (index < questions.length - 1) {
              setIndex(i => i + 1); setSelected(null); setSubmitted(false);
            } else {
              if (score >= 4) onModuleMastery(module.category);
              setState('finished');
            }
          }}> {index < questions.length - 1 ? 'Next Question' : 'Finish Quiz'} </button>
        ) : (
          <button className="w-full bg-gray-800 text-white py-2 rounded disabled:bg-gray-300" disabled={!selected} onClick={() => {
            if (!selected) return;
            const isCorrect = questions[index].options.find(o => o.text === selected)?.isCorrect || false;
            setAnswers(prev => [...prev, { questionId: questions[index].id, selectedOption: selected, isCorrect }]);
            setSubmitted(true);
          }}> Submit Answer </button>
        )}
      </div>
    </div>
  );
};

const ModulesViewCore: React.FC<ModulesViewProps> = ({ selectedModule, setSelectedModule, latestQuizResults, onModuleMastery }) => {
  // V2 safe feature set (incremental)
  const [searchTerm, setSearchTerm] = useState('');

  const recommendedCategories = useMemo(() => {
    if (!latestQuizResults) return [] as string[];
    return latestQuizResults.results
      .filter(r => r.total > 0 && (r.correct / r.total) * 100 < 86)
      .sort((a, b) => (a.correct / a.total) - (b.correct / b.total))
      .map(r => assertString('results.category', r.category));
  }, [latestQuizResults]);

  if (selectedModule) {
    console.log('[ModulesViewCore] detail title-only');
    return (
      <ErrorBoundary>
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-4xl mx-auto space-y-4" data-build-version="modules-core-detail-title-1">
          <button onClick={() => setSelectedModule(null)} className="text-brand-blue font-semibold">&larr; Back to all modules</button>
          <h1 className="text-3xl font-bold text-gray-800"><SafeText value={selectedModule.title} /></h1>
        </div>
      </ErrorBoundary>
    );
  }

  const filteredModules = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return LEARNING_MODULES;
    try {
      return LEARNING_MODULES.filter(m =>
        assertString('module.title', m.title).toLowerCase().includes(q) ||
        assertString('module.category', m.category).toLowerCase().includes(q) ||
        assertString('module.summary', m.summary).toLowerCase().includes(q)
      );
    } catch (e) {
      console.error('[ModulesViewCore] search error:', e);
      return LEARNING_MODULES;
    }
  }, [searchTerm]);

  return (
    <ErrorBoundary>
      <div className="bg-white p-6 rounded-lg shadow" data-build-version="modules-core-v2-search-1">
        <h1 className="text-2xl font-bold text-gray-800 text-center">Modules</h1>
        <div className="max-w-2xl mx-auto mt-4">
          <input
            type="text"
            placeholder="Search for a topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition"
          />
        </div>
        <ul className="mt-4 divide-y divide-gray-100">
          {filteredModules.map((m) => (
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
    </ErrorBoundary>
  );
};

export default ModulesViewCore;
