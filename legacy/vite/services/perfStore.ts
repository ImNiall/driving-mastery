import { FinalQuizResults } from "../types";

const LS_QUIZ_HISTORY = "dm_quiz_history_v1";
const LS_CATEGORY_STATS = "dm_category_stats_v1";
const LS_MODULE_PROGRESS = "dm_module_progress_v1";

type CatStat = { correct: number; total: number };
export type ModuleProgress = Record<string, { name?: string; percent: number }>;

type QuizHistoryItem = {
  ts: number;
  total: number;
  correct: number;
  percentage: number;
  byCategory: Record<string, CatStat>;
  flaggedCount: number;
};

export type PerformanceSnapshot = {
  summary: { attempts: number; avgScore: number; recentScore?: number };
  categoryStats: Record<string, CatStat>;
  moduleProgress: ModuleProgress;
  recentQuizzes: QuizHistoryItem[];
};

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function appendQuizResult(results: FinalQuizResults) {
  const history = readJSON<QuizHistoryItem[]>(LS_QUIZ_HISTORY, []);
  const catStats = readJSON<Record<string, CatStat>>(LS_CATEGORY_STATS, {});

  const byCategory: Record<string, CatStat> = {};
  results.questions.forEach((q) => {
    const cat = q.category as string;
    const ua = results.finalUserAnswers.find((a) => a.questionId === q.id);
    const isCorrect = !!ua?.isCorrect;
    if (!byCategory[cat]) byCategory[cat] = { correct: 0, total: 0 };
    byCategory[cat].total += 1;
    if (isCorrect) byCategory[cat].correct += 1;
  });

  for (const k of Object.keys(byCategory)) {
    const prev = catStats[k] ?? { correct: 0, total: 0 };
    catStats[k] = {
      correct: prev.correct + byCategory[k].correct,
      total: prev.total + byCategory[k].total,
    };
  }

  const percentage = results.totalQuestions
    ? Math.round((results.totalCorrect / results.totalQuestions) * 100)
    : 0;
  history.unshift({
    ts: Date.now(),
    total: results.totalQuestions,
    correct: results.totalCorrect,
    percentage,
    byCategory,
    flaggedCount: results.flaggedQuestions.length,
  });
  writeJSON(LS_QUIZ_HISTORY, history.slice(0, 50));
  writeJSON(LS_CATEGORY_STATS, catStats);
}

export function recordModuleProgress(
  moduleId: string,
  percent: number,
  name?: string,
) {
  const mp = readJSON<ModuleProgress>(LS_MODULE_PROGRESS, {});
  const next = Math.max(0, Math.min(100, Math.round(percent)));
  const prev = mp[moduleId]?.percent ?? 0;
  mp[moduleId] = {
    name: mp[moduleId]?.name ?? name,
    percent: Math.max(prev, next),
  };
  writeJSON(LS_MODULE_PROGRESS, mp);
}

export function getPerformanceSnapshot(): PerformanceSnapshot {
  const history = readJSON<QuizHistoryItem[]>(LS_QUIZ_HISTORY, []);
  const catStats = readJSON<Record<string, CatStat>>(LS_CATEGORY_STATS, {});
  const moduleProgress = readJSON<ModuleProgress>(LS_MODULE_PROGRESS, {});
  const attempts = history.length;
  const avgScore = attempts
    ? Math.round(history.reduce((s, h) => s + h.percentage, 0) / attempts)
    : 0;
  const recentScore = history[0]?.percentage;
  return {
    summary: { attempts, avgScore, recentScore },
    categoryStats: catStats,
    moduleProgress,
    recentQuizzes: history,
  };
}
