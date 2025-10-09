export type SRItem = { id: number; nextDue: number; intervalDays: number };

const LS_AVOID = "dm_avoid_ids_v1";
const LS_SR_QUEUE = "dm_sr_queue_v1";
const LS_RECENT_WRONG = "dm_recent_wrong_ids_v1";

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

export function getAvoidSet(): Set<number> {
  return new Set(readJSON<number[]>(LS_AVOID, []));
}
export function pushToAvoidSet(ids: number[], max = 400) {
  const arr = readJSON<number[]>(LS_AVOID, []);
  const merged = Array.from(new Set([...arr, ...ids]));
  writeJSON(LS_AVOID, merged.slice(-max));
}

export function getSRQueue(): SRItem[] {
  return readJSON<SRItem[]>(LS_SR_QUEUE, []);
}
export function upsertSRItem(id: number, days: number) {
  const q = getSRQueue();
  const now = Date.now();
  const idx = q.findIndex((x) => x.id === id);
  const item: SRItem = {
    id,
    intervalDays: days,
    nextDue: now + days * 86400000,
  };
  if (idx >= 0) q[idx] = item;
  else q.push(item);
  writeJSON(LS_SR_QUEUE, q);
}
export function popDueSRItems(max: number): number[] {
  const q = getSRQueue();
  const now = Date.now();
  const due = q.filter((x) => x.nextDue <= now).slice(0, max);
  const remaining = q.filter((x) => !due.some((d) => d.id === x.id));
  writeJSON(LS_SR_QUEUE, remaining);
  return due.map((d) => d.id);
}

export function pushRecentWrongs(ids: number[], max = 100) {
  const arr = readJSON<number[]>(LS_RECENT_WRONG, []);
  const merged = Array.from(new Set([...ids.reverse(), ...arr]));
  writeJSON(LS_RECENT_WRONG, merged.slice(0, max));
}
export function popRecentWrongs(max: number): number[] {
  const arr = readJSON<number[]>(LS_RECENT_WRONG, []);
  const take = arr.slice(0, Math.max(0, max));
  const keep = arr.slice(take.length);
  writeJSON(LS_RECENT_WRONG, keep);
  return take;
}
export function takeRecentWrongsFromPool(
  poolIds: number[],
  max: number,
): number[] {
  const pool = new Set(poolIds);
  const arr = readJSON<number[]>(LS_RECENT_WRONG, []);
  const take: number[] = [];
  const keep: number[] = [];
  for (const id of arr) {
    if (take.length < Math.max(0, max) && pool.has(id)) take.push(id);
    else keep.push(id);
  }
  writeJSON(LS_RECENT_WRONG, keep);
  return take;
}

export function scheduleAfterAnswer(questionId: number, isCorrect: boolean) {
  if (isCorrect) upsertSRItem(questionId, 21);
  else upsertSRItem(questionId, 0);
}
