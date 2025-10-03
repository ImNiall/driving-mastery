import React from 'react';
import { LearningModule, FinalQuizResults, Category, Question as QuestionType, UserAnswer } from '../types';
import { LEARNING_MODULES, QUESTION_BANK } from '../constants';
import ErrorBoundary from './ErrorBoundary';
import { parseInlineMarkdown, SafeText } from '../utils/markdown';
import { assertString } from '../utils/assertString';
import Seo from './Seo';
import { SITE_URL } from '../config/seo';
import JsonLd from './JsonLd';
import QuestionCard from './QuestionCard';
import ModuleCardV2 from './ModuleCardV2';

// Simple, safe markdown renderer (headings + paragraphs)
const SimpleMarkdown: React.FC<{ content: unknown }> = ({ content }) => {
  // Outer guard around coercion
  let text: string;
  try {
    text = assertString('module.content', content);
  } catch (e) {
    console.error('[SimpleMarkdown] content assert failed, falling back:', e);
    const fallback = String(content ?? '').trim();
    if (!fallback) {
      return (
        <div className="my-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
          <p className="text-yellow-800 text-sm">Module content coming soon.</p>
        </div>
      );
    }
    return (
      <div>
        {fallback.split('\n').filter(Boolean).map((l, idx) => (
          <p key={`assert-fallback-${idx}`} className="my-3 text-gray-700 leading-relaxed">{l}</p>
        ))}
      </div>
    );
  }
  if (!text || !text.trim()) {
    return (
      <div className="my-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
        <p className="text-yellow-800 text-sm">Module content coming soon.</p>
      </div>
    );
  }
  try {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const t = raw.trim();
    if (!t) continue;

    // Note callout: group consecutive lines starting with variants of "Note"
    const noteRe = /^(?:>\s*)?(?:note|n)\s*[:\-–—]?\s*/i;
    const firstMatch = t.match(noteRe);
    if (firstMatch) {
      const noteItems: React.ReactNode[] = [];
      const start = i;
      while (i < lines.length) {
        const s = lines[i].trim();
        const mm = s.match(noteRe);
        if (!mm) break;
        const body = s.slice(mm[0].length);
        noteItems.push(
          <p key={`note-${i}`} className="text-sm leading-relaxed">{parseInlineMarkdown(body)}</p>
        );
        i++;
      }
      i -= 1; // compensate for for-loop increment
      elements.push(
        <div key={`note-block-${start}`} className="my-4 p-4 rounded-md border border-blue-200 bg-blue-50">
          <div className="text-blue-900 space-y-2">
            {noteItems}
          </div>
        </div>
      );
      continue;
    }

    // Blockquotes: group consecutive lines starting with '>', but NOT callout shorthands (Note/Warning/Tip/N/W/T/!)
    const quoteRe = /^>\s*(?!([Nn]ote|[Nn]|[Ww]arning|[Ww]|[Tt]ip|[Tt]|!))/;
    if (quoteRe.test(t)) {
      const paras: React.ReactNode[] = [];
      const start = i;
      while (i < lines.length) {
        const s = lines[i].trim();
        if (!quoteRe.test(s)) break;
        const body = s.replace(quoteRe, '');
        paras.push(
          <p key={`q-${i}`} className="text-gray-700">{parseInlineMarkdown(body)}</p>
        );
        i++;
      }
      i -= 1; // compensate
      elements.push(
        <blockquote key={`quote-${start}`} className="my-4 pl-4 border-l-4 border-gray-300 bg-gray-50 py-2">
          <div className="space-y-2">{paras}</div>
        </blockquote>
      );
      continue;
    }

    // Warning callout: group consecutive lines starting with variants of "Warning"
    const warnRe = /^(?:>\s*)?(?:warning|w)\s*[:\-–—]?\s*/i;
    const warnMatch = t.match(warnRe);
    if (warnMatch) {
      const warnItems: React.ReactNode[] = [];
      const start = i;
      while (i < lines.length) {
        const s = lines[i].trim();
        const mm = s.match(warnRe);
        if (!mm) break;
        const body = s.slice(mm[0].length);
        warnItems.push(
          <p key={`warn-${i}`} className="text-sm leading-relaxed">{parseInlineMarkdown(body)}</p>
        );
        i++;
      }
      i -= 1; // compensate for loop
      elements.push(
        <div key={`warn-block-${start}`} className="my-4 p-4 rounded-md border border-yellow-300 bg-yellow-50">
          <div className="text-yellow-900 space-y-2">
            {warnItems}
          </div>
        </div>
      );
      continue;
    }

    // Tip callout: group consecutive lines starting with variants of "Tip"
    const tipRe = /^(?:>\s*)?(?:tip|t|!)\s*[:\-–—]?\s*/i;
    const tipMatch = t.match(tipRe);
    if (tipMatch) {
      const tipItems: React.ReactNode[] = [];
      const start = i;
      while (i < lines.length) {
        const s = lines[i].trim();
        const mm = s.match(tipRe);
        if (!mm) break;
        const body = s.slice(mm[0].length);
        tipItems.push(
          <p key={`tip-${i}`} className="text-sm leading-relaxed">{parseInlineMarkdown(body)}</p>
        );
        i++;
      }
      i -= 1;
      elements.push(
        <div key={`tip-block-${start}`} className="my-4 p-4 rounded-md border border-green-300 bg-green-50">
          <div className="text-green-900 space-y-2">
            {tipItems}
          </div>
        </div>
      );
      continue;
    }

    // Unordered lists: group consecutive lines starting with -, *, or •
    const listRe = /^(?:-|\*|•)\s+/;
    if (listRe.test(t)) {
      const items: React.ReactNode[] = [];
      const start = i;
      while (i < lines.length) {
        const s = lines[i].trim();
        if (!s || !listRe.test(s)) break;
        const body = s.replace(listRe, '');
        items.push(
          <li key={`li-${i}`} className="ml-4 list-disc"><span>{parseInlineMarkdown(body)}</span></li>
        );
        i++;
      }
      i -= 1; // for-loop compensation
      elements.push(
        <ul key={`ul-${start}`} className="my-3 pl-5 text-gray-700 space-y-1">
          {items}
        </ul>
      );
      continue;
    }

    if (t.startsWith('# ')) {
      elements.push(
        <h2 key={`h1-${i}`} className="text-2xl font-bold mt-6 mb-3 text-gray-900 border-b pb-1">{t.substring(2)}</h2>
      );
      continue;
    }
    if (t.startsWith('## ')) {
      elements.push(
        <h3 key={`h2-${i}`} className="text-xl font-semibold mt-5 mb-2 text-gray-800">{t.substring(3)}</h3>
      );
      continue;
    }
    if (t.startsWith('### ')) {
      elements.push(
        <h4 key={`h3-${i}`} className="text-lg font-semibold mt-4 mb-2 text-gray-800">{t.substring(4)}</h4>
      );
      continue;
    }
    elements.push(
      <p key={`p-${i}`} className="my-3 text-gray-700 leading-relaxed">{parseInlineMarkdown(t)}</p>
    );
    }
    return <div>{elements}</div>;
  } catch (err) {
    console.error('[SimpleMarkdown] parsing error, falling back:', err);
    const safeLines = String(text).split('\n').filter(l => l.trim() !== '');
    return (
      <div>
        {safeLines.map((l, idx) => (
          <p key={`fallback-${idx}`} className="my-3 text-gray-700 leading-relaxed">{l}</p>
        ))}
      </div>
    );
  }
};

// Lightweight MiniQuiz for module detail
const MiniQuizV2: React.FC<{ module: LearningModule; onModuleMastery: (category: Category) => void; }> = ({ module, onModuleMastery }) => {
  const [state, setState] = React.useState<'idle' | 'active' | 'finished'>('idle');
  const [questions, setQuestions] = React.useState<QuestionType[]>([]);
  const [index, setIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [answers, setAnswers] = React.useState<UserAnswer[]>([]);

  // Persist quiz progress per module to survive remounts/HMR
  const storageKey = React.useMemo(() => `miniQuiz:${String(module.slug)}`, [module.slug]);
  const restoredRef = React.useRef(false);

  // Configurable question count (default 10), bounded by available questions in the bank for this category
  const questionCount = React.useMemo(() => {
    // @ts-ignore Vite env
    const desired = Number(((import.meta as any)?.env?.VITE_MINI_QUIZ_COUNT) ?? 10);
    const available = QUESTION_BANK.filter(q => q.category === module.category).length;
    const bounded = Math.max(1, Math.min(isFinite(desired) && desired > 0 ? desired : 10, available));
    return bounded;
  }, [module.category]);

  // Deterministic seeded RNG (Mulberry32) based on slug + current day string
  const seedFromString = (s: string) => {
    let h = 1779033703 ^ s.length;
    for (let i = 0; i < s.length; i++) {
      h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return (h >>> 0);
  };
  const mulberry32 = (a: number) => () => {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const deterministicPick = React.useCallback((arr: QuestionType[], count: number) => {
    const seed = seedFromString(`${module.slug}-${new Date().toDateString()}`);
    const rand = mulberry32(seed);
    const copy = [...arr];
    // Fisher-Yates with seeded RNG
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, count);
  }, [module.slug]);

  // Helper: persist safely
  const persist = React.useCallback(() => {
    try {
      if (state === 'idle') {
        sessionStorage.removeItem(storageKey);
        return;
      }
      if (questions.length < 1) return;
      const ids = questions.map(q => String(q.id));
      const snapshot = questions.map(q => ({ id: q.id, question: q.question, options: q.options, explanation: q.explanation, image: (q as any).image ?? null, category: q.category }));
      const payload = { ids, snapshot, index, answers, state, selected, submitted, ts: Date.now(), questionCount };
      sessionStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (e) {
      console.warn('[MiniQuizV2] persist failed:', e);
    }
  }, [storageKey, questions, index, answers, state, selected, submitted, questionCount]);

  const load = React.useCallback(() => {
    const filtered = QUESTION_BANK.filter(q => q.category === module.category);
    const picked = filtered.length <= questionCount ? filtered : deterministicPick(filtered, questionCount);
    setQuestions(picked);
  }, [module.category, questionCount, deterministicPick]);

  // Try restore from sessionStorage first
  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data) return;
      if (Array.isArray(data.snapshot) && data.snapshot.length > 0) {
        setQuestions(data.snapshot as QuestionType[]);
      } else if (Array.isArray(data.ids) && data.ids.length > 0) {
        const qs: QuestionType[] = data.ids
          .map((id: string) => QUESTION_BANK.find(q => String(q.id) === String(id)))
          .filter(Boolean) as QuestionType[];
        if (qs.length !== data.ids.length) return; // fall back to load
        setQuestions(qs);
      } else {
        return;
      }
      setIndex(Number(data.index) || 0);
      setAnswers(Array.isArray(data.answers) ? data.answers : []);
      setSelected(data.selected ?? null);
      setSubmitted(Boolean(data.submitted));
      setState(data.state === 'finished' ? 'finished' : 'active');
      restoredRef.current = true;
    } catch (e) {
      console.warn('[MiniQuizV2] restore failed:', e);
    }
  }, [storageKey]);

  // Load fresh questions only if we didn't restore
  React.useEffect(() => { if (!restoredRef.current) load(); }, [load]);

  // Persist on change
  React.useEffect(() => {
    persist();
  }, [persist]);

  // Extra safety: persist on tab hide/unload and heartbeat every 10s while active
  React.useEffect(() => {
    const onVis = () => { if (document.visibilityState !== 'visible') persist(); };
    const onUnload = () => { persist(); };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('beforeunload', onUnload);
    let timer: number | undefined;
    if (state === 'active') {
      timer = window.setInterval(() => persist(), 10000) as unknown as number;
    }
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('beforeunload', onUnload);
      if (timer) window.clearInterval(timer);
    };
  }, [state, persist]);

  // Fallback delayed load if restore didn't complete in time (defensive against effect ordering)
  React.useEffect(() => {
    if (restoredRef.current) return;
    const t = window.setTimeout(() => {
      if (!restoredRef.current) load();
    }, 250);
    return () => window.clearTimeout(t);
  }, [load]);

  const score = answers.filter(a => a.isCorrect).length;

  if (questions.length < 1) {
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
    const passMark = Math.ceil(0.8 * questions.length);
    const passed = score >= passMark;
    return (
      <div className="bg-slate-100 p-6 rounded-lg text-center">
        <h3 className="text-xl font-bold text-gray-800">{passed ? 'Excellent Work!' : 'Good Effort!'}</h3>
        <p className="text-gray-700 mt-2">You scored {score} / {questions.length} (pass {passMark}+)</p>
        <div className="mt-4 space-x-2">
          <button className="bg-gray-800 text-white px-4 py-2 rounded" onClick={() => {
            try { sessionStorage.removeItem(storageKey); } catch {}
            setState('active'); setIndex(0); setSelected(null); setSubmitted(false); setAnswers([]); load();
          }}>Try Again</button>
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
              const nextIndex = index + 1;
              setIndex(nextIndex); 
              setSelected(null); 
              setSubmitted(false);
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

interface ModulesViewProps {
  selectedModule: LearningModule | null;
  setSelectedModule: (module: LearningModule | null) => void;
  latestQuizResults: FinalQuizResults | null;
  onModuleMastery: (category: Category) => void;
  masteredModules: string[];
}
const ModulesViewV2: React.FC<ModulesViewProps> = ({ selectedModule, setSelectedModule, latestQuizResults, onModuleMastery }) => {
  if (selectedModule) {
    const safeTitle = assertString('seo.title', selectedModule.title);
    const safeSummary = assertString('seo.description', selectedModule.summary);
    const safeSlug = assertString('seo.slug', selectedModule.slug);
    return (
      <ErrorBoundary>
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-4xl mx-auto space-y-6">
          <Seo
            title={`${safeTitle} – UK Theory Module`}
            description={safeSummary}
            url={`${SITE_URL}/modules/${safeSlug}`}
          />
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: "Modules", item: `${SITE_URL}/modules` },
                { "@type": "ListItem", position: 3, name: safeTitle, item: `${SITE_URL}/modules/${safeSlug}` }
              ]
            }}
          />
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
          <div className="mt-8 pt-8 border-t-2 border-gray-100">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Test Your Knowledge</h3>
            </div>
            <ErrorBoundary fallback={<div className="text-center p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400"><p className="text-yellow-800">Quiz temporarily unavailable. You can still study the content above.</p></div>}>
              <MiniQuizV2 module={selectedModule} onModuleMastery={onModuleMastery} />
            </ErrorBoundary>
          </div>
          <p className="text-gray-500 text-sm">Detail view (v2) — title + category + summary + content + quiz</p>
        </div>
      </ErrorBoundary>
    );
  }

  // L1: search-only filtering
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | 'recommended'>('all');
  const recommendedCategories = React.useMemo(() => {
    if (!latestQuizResults) return [] as string[];
    return latestQuizResults.results
      .filter(r => r.total > 0 && (r.correct / r.total) * 100 < 86)
      .sort((a, b) => (a.correct / a.total) - (b.correct / b.total))
      .map(r => assertString('results.category', r.category));
  }, [latestQuizResults]);

  const filteredModules = React.useMemo(() => {
    let mods = LEARNING_MODULES;
    if (filter === 'recommended' && recommendedCategories.length > 0) {
      mods = mods
        .filter(m => recommendedCategories.includes(assertString('module.category', m.category)))
        .sort((a, b) =>
          recommendedCategories.indexOf(assertString('module.category', a.category)) -
          recommendedCategories.indexOf(assertString('module.category', b.category))
        );
    }
    const q = searchTerm.trim().toLowerCase();
    if (!q) return mods;
    try {
      return mods.filter(m =>
        assertString('module.title', m.title).toLowerCase().includes(q) ||
        assertString('module.category', m.category).toLowerCase().includes(q) ||
        assertString('module.summary', m.summary).toLowerCase().includes(q)
      );
    } catch (e) {
      console.error('[ModulesViewV2] search/recommended filter error:', e);
      return mods;
    }
  }, [searchTerm, filter, recommendedCategories]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800">Modules (v2)</h1>
      <div className="max-w-2xl mx-auto mt-3 flex items-center justify-center space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${filter === 'all' ? 'bg-brand-blue text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
        >
          All
        </button>
        {recommendedCategories.length > 0 && (
          <button
            onClick={() => setFilter('recommended')}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${filter === 'recommended' ? 'bg-brand-blue text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            Recommended
          </button>
        )}
      </div>
      {filter === 'recommended' && (
        <p className="text-center text-xs text-gray-500 mt-1">based on your most recent performance</p>
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
          <ModuleCardV2 key={String(m.slug)} module={m} onSelect={setSelectedModule} />
        ))}
      </div>
    </div>
  );
};

export default ModulesViewV2;
