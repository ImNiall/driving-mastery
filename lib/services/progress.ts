"use client";
import { supabase } from "@/lib/supabase/client";

async function getToken(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.access_token) throw new Error("No session");
  return data.session.access_token;
}

async function callFn<T>(name: string, init?: RequestInit): Promise<T> {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.access_token) throw new Error("No session");
  const token = data.session.access_token;
  const res = await fetch(`/.netlify/functions/${name}`, {
    ...(init || {}),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

export const ProgressService = {
  startAttempt: (
    source: "mock" | "mini" | "module" = "module",
    moduleSlug?: string,
  ) =>
    callFn<{ attemptId: string; startedAt: string }>("attempt-start", {
      method: "POST",
      body: JSON.stringify({ source, moduleSlug }),
    }),

  recordAnswer: (payload: {
    attemptId: string;
    questionId: number;
    category: string;
    isCorrect: boolean;
  }) =>
    callFn<{ ok: true }>("answer-record", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  answersBulk: (payload: {
    attemptId: string;
    answers: Array<{
      qid: number;
      choice: string;
      correct: boolean;
      category: string;
    }>;
  }) =>
    callFn<{ ok: true; count: number }>("answers-bulk", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  finishAttempt: (attemptId: string) =>
    callFn<{
      total: number;
      correct: number;
      score_percent: number;
      duration_sec: number;
    }>("attempt-finish", {
      method: "POST",
      body: JSON.stringify({ attemptId }),
    }),

  recordMastery: (category: string, points: number = 0) =>
    callFn<{ category: string; points: number; mastered_at: string }>(
      "mastery-record",
      {
        method: "POST",
        body: JSON.stringify({ category, points }),
      },
    ),

  saveProgress: (payload: {
    attemptId: string;
    currentIndex: number;
    state?: "active" | "finished" | "idle";
    questions?: Array<{ id: number; category: string }>;
  }) =>
    callFn<{ ok: true }>("attempt-save-progress", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  latestAttempt: (source: "mock" | "mini" | "module") =>
    callFn<{
      attemptId: string;
      source: string;
      started_at: string;
      current_index: number;
      questions: Array<{ id: number; category: string }> | null;
      finished: boolean;
    } | null>("attempt-latest", {
      method: "POST",
      body: JSON.stringify({ source }),
    }),

  getOverview: () =>
    callFn<{
      categories: { category: string; correct: number; total: number }[];
      attempts: any[];
      masteryPoints: number;
      studyPlan: any;
    }>("progress-overview", { method: "GET" }),
  saveStudyPlan: (payload: { planKey: string; steps: any[] }) =>
    callFn<{ plan_key: string; steps: any[]; updated_at: string }>(
      "studyplan-save",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    ),
};
