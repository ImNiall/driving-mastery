import { Question, Category } from "../types";
import { getPerformanceSnapshot } from "./perfStore";
import {
  getAvoidSet,
  pushToAvoidSet,
  popDueSRItems,
  popRecentWrongs,
  takeRecentWrongsFromPool,
} from "./rotation";

export type Blueprint = Record<Category, number>;
export type DifficultyMix = { easy: number; med: number; hard: number };

export function buildAdaptiveWeights(base: Blueprint, boost = 0.35): Blueprint {
  const perf = getPerformanceSnapshot();
  const cat = perf.categoryStats || {};
  const acc: Record<string, number> = {};
  for (const k of Object.keys(base)) {
    const s = cat[k] || { correct: 0, total: 0 };
    acc[k] = s.total ? s.correct / s.total : 0.75;
  }
  const adjusted: Record<string, number> = {};
  for (const k of Object.keys(base)) {
    const penalty = 1 - acc[k];
    adjusted[k] = base[k] * (1 + boost * penalty);
  }
  const sum = Object.values(adjusted).reduce((a, b) => a + b, 0) || 1;
  const out: any = {};
  for (const k of Object.keys(adjusted)) out[k] = adjusted[k] / sum;
  return out;
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function part(all: Question[]) {
  const e: Question[] = [],
    m: Question[] = [],
    h: Question[] = [];
  for (const q of all) {
    const d = (q as any).difficulty || "med";
    (d === "easy" ? e : d === "hard" ? h : m).push(q);
  }
  return { e, m, h };
}

export function sampleMock(
  all: Question[],
  opts: {
    length: number;
    blueprint: Blueprint;
    difficultyMix?: DifficultyMix;
    includeSR?: number;
    includeRecentWrongs?: number;
  },
): Question[] {
  const {
    length,
    blueprint,
    difficultyMix = { easy: 0.3, med: 0.5, hard: 0.2 },
    includeSR = 5,
    includeRecentWrongs = 5,
  } = opts;
  const avoid = getAvoidSet();
  const idMap = new Map<number, Question>();
  for (const q of all) idMap.set(q.id, q);
  const rwr = popRecentWrongs(Math.min(includeRecentWrongs, length));
  const srs = popDueSRItems(
    Math.min(includeSR, Math.max(0, length - rwr.length)),
  );
  const basePool = all.filter(
    (q) => !avoid.has(q.id) && !rwr.includes(q.id) && !srs.includes(q.id),
  );

  const buckets: Record<string, Question[]> = {};
  for (const q of basePool) (buckets[q.category] ||= []).push(q);
  const target: Record<string, number> = {};
  for (const c of Object.keys(blueprint))
    target[c] = Math.round(blueprint[c as Category] * length);
  while (Object.values(target).reduce((a, b) => a + b, 0) !== length) {
    const keys = Object.keys(target);
    const k = keys[Math.floor(Math.random() * keys.length)];
    target[k] += Math.sign(
      length - Object.values(target).reduce((a, b) => a + b, 0),
    );
    if (target[k] < 0) target[k] = 0;
  }

  const chosenIds = new Set<number>([...rwr, ...srs]);
  const chosen: Question[] = [...rwr, ...srs]
    .map((id) => idMap.get(id)!)
    .filter(Boolean);

  for (const cat of Object.keys(target)) {
    const need = Math.max(0, target[cat]);
    if (!need) continue;
    const pool = (buckets[cat] || []).filter((q) => !chosenIds.has(q.id));
    const { e, m, h } = part(pool);
    const take = (arr: Question[], n: number) =>
      shuffle(arr).slice(0, Math.min(n, arr.length));
    const te = take(e, Math.round(need * difficultyMix.easy));
    const tm = take(m, Math.round(need * difficultyMix.med));
    const th = take(h, need - te.length - tm.length);
    const picks = [...te, ...tm, ...th];
    picks.forEach((p) => chosenIds.add(p.id));
    chosen.push(...picks);
  }
  const finalQ = shuffle(chosen).slice(0, length);
  pushToAvoidSet(finalQ.map((q) => q.id));
  return finalQ;
}

export function sampleCategoryQuiz(
  all: Question[],
  category: Category,
  opts: {
    length: number;
    difficultyMix?: DifficultyMix;
    includeSR?: number;
    includeRecentWrongs?: number;
  },
): Question[] {
  const {
    length,
    difficultyMix = { easy: 0.3, med: 0.5, hard: 0.2 },
    includeSR = 4,
    includeRecentWrongs = 4,
  } = opts;
  const catAll = all.filter((q) => q.category === category);
  const idMap = new Map<number, Question>();
  for (const q of catAll) idMap.set(q.id, q);
  const rwr = takeRecentWrongsFromPool(
    catAll.map((q) => q.id),
    Math.min(includeRecentWrongs, length),
  );
  const srs = popDueSRItems(
    Math.min(includeSR, Math.max(0, length - rwr.length)),
  ).filter((id) => idMap.has(id));
  const chosenIds = new Set<number>([...rwr, ...srs]);
  const chosen: Question[] = [...rwr, ...srs]
    .map((id) => idMap.get(id)!)
    .filter(Boolean);
  const pool = catAll.filter((q) => !chosenIds.has(q.id));
  const { e, m, h } = part(pool);
  const need = Math.max(0, length - chosen.length);
  const take = (arr: Question[], n: number) =>
    shuffle(arr).slice(0, Math.min(n, arr.length));
  const te = take(e, Math.round(need * difficultyMix.easy));
  const tm = take(m, Math.round(need * difficultyMix.med));
  const th = take(h, need - te.length - tm.length);
  const finalQ = shuffle([...chosen, ...te, ...tm, ...th]).slice(0, length);
  pushToAvoidSet(finalQ.map((q) => q.id));
  return finalQ;
}

export function sampleMistakesOnlyCategory(
  all: Question[],
  category: Category,
  length: number,
): Question[] {
  const catAll = all.filter((q) => q.category === category);
  const catIds = new Set(catAll.map((q) => q.id));
  const map = new Map<number, Question>();
  for (const q of catAll) map.set(q.id, q);
  const ids = takeRecentWrongsFromPool(Array.from(catIds), length);
  return shuffle(ids.map((id) => map.get(id)!).filter(Boolean));
}

export function sampleMistakesMixed(
  all: Question[],
  length: number,
): Question[] {
  const map = new Map<number, Question>();
  for (const q of all) map.set(q.id, q);
  const ids = popRecentWrongs(length);
  return shuffle(ids.map((id) => map.get(id)!).filter(Boolean));
}
