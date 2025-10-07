"use client";
import { supabase } from "@/lib/supabase/client";

async function getToken(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.access_token) throw new Error("No session");
  return data.session.access_token;
}

async function callFn<T>(name: string, init?: RequestInit): Promise<T> {
  const token = await getToken();
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
  startAttempt: (source: "mock" | "mini" | "module" = "module") =>
    callFn<{ attemptId: string; startedAt: string }>("attempt.start", {
      method: "POST",
      body: JSON.stringify({ source }),
    }),

  recordAnswer: (payload: {
    attemptId: string;
    questionId: number;
    category: string;
    isCorrect: boolean;
  }) =>
    callFn<{ ok: true }>("answer.record", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  finishAttempt: (attemptId: string) =>
    callFn<{
      total: number;
      correct: number;
      score_percent: number;
      duration_sec: number;
    }>("attempt.finish", {
      method: "POST",
      body: JSON.stringify({ attemptId }),
    }),

  recordMastery: (category: string, points: number = 0) =>
    callFn<{ category: string; points: number; mastered_at: string }>(
      "mastery.record",
      {
        method: "POST",
        body: JSON.stringify({ category, points }),
      },
    ),

  getOverview: () =>
    callFn<{
      categories: { category: string; correct: number; total: number }[];
      attempts: any[];
      masteryPoints: number;
      studyPlan: any;
    }>("progress.overview", { method: "GET" }),
};
