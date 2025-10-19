"use client";
import { supabase } from "@/lib/supabase/client";

const TOKEN_BUFFER_MS = 30_000;
const FALLBACK_TTL_MS = 5 * 60 * 1000;

let cachedToken: { value: string; expiresAt: number } | null = null;
let inFlightToken: Promise<string> | null = null;

async function fetchToken(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.access_token) {
    throw new Error("No session");
  }
  const expiresAt = data.session.expires_at
    ? data.session.expires_at * 1000 - TOKEN_BUFFER_MS
    : Date.now() + FALLBACK_TTL_MS;
  cachedToken = {
    value: data.session.access_token,
    expiresAt,
  };
  return cachedToken.value;
}

async function getToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  if (!inFlightToken) {
    inFlightToken = fetchToken().finally(() => {
      inFlightToken = null;
    });
  }

  try {
    return await inFlightToken;
  } catch (err) {
    cachedToken = null;
    throw err;
  }
}

function clearTokenCache() {
  cachedToken = null;
}

async function callFn<T>(
  name: string,
  init?: RequestInit,
  attempt = 0,
): Promise<T> {
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

  if (res.status === 401 && attempt === 0) {
    clearTokenCache();
    return callFn<T>(name, init, 1);
  }

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return (await res.json()) as T;
}

export const ProgressService = {
  startAttempt: (
    source: "mock" | "mini" | "module" | "category" = "module",
    moduleSlug?: string | null,
    dvsaCategory?: string | null,
  ) =>
    callFn<{ attemptId: string; startedAt: string }>("attempt-start", {
      method: "POST",
      body: JSON.stringify({
        source,
        moduleSlug,
        dvsaCategory: dvsaCategory ?? null,
      }),
    }),

  recordAnswer: (payload: {
    attemptId: string;
    qIndex: number;
    questionId?: number | null;
    category?: string | null;
    choice: string;
    isCorrect: boolean;
  }) =>
    callFn<{ ok: true }>("answer-record", {
      method: "POST",
      body: JSON.stringify({
        attemptId: payload.attemptId,
        qIndex: payload.qIndex,
        questionId: payload.questionId ?? null,
        category: payload.category ?? null,
        isCorrect: payload.isCorrect,
        answer: {
          choice: payload.choice,
          correct: payload.isCorrect,
          questionId: payload.questionId ?? null,
        },
      }),
    }),

  answersBulk: (payload: {
    attemptId: string;
    answers: Array<{
      qIndex: number;
      questionId?: number | null;
      choice: string;
      correct: boolean;
      category?: string | null;
    }>;
  }) =>
    callFn<{ ok: true; count: number }>("answers-bulk", {
      method: "POST",
      body: JSON.stringify({
        attemptId: payload.attemptId,
        answers: payload.answers.map((answer) => ({
          qIndex: answer.qIndex,
          questionId: answer.questionId ?? null,
          category: answer.category ?? null,
          isCorrect: answer.correct,
          answer: {
            choice: answer.choice,
            correct: answer.correct,
            questionId: answer.questionId ?? null,
          },
        })),
      }),
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

  latestAttempt: (source: "mock" | "mini" | "module" | "category") =>
    callFn<{
      attemptId: string;
      source: string;
      started_at: string;
      current_index: number;
      questions: Array<{ id: number; category: string }> | null;
      finished: boolean;
      dvsa_category?: string | null;
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
  getMissedQuestions: () =>
    callFn<{
      questions: {
        questionId: number;
        category: string | null;
        correct: number;
        incorrect: number;
        total: number;
        lastSeen: string | null;
      }[];
    }>("questions-missed", { method: "GET" }),
  saveStudyPlan: (payload: { planKey: string; steps: any[] }) =>
    callFn<{ plan_key: string; steps: any[]; updated_at: string }>(
      "studyplan-save",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    ),

  getLeaderboard: () =>
    callFn<{
      leaderboard: Array<{
        rank: number;
        name: string;
        masteryPoints: number;
        categoriesMastered: number;
        isCurrentUser: boolean;
        lastActivity: string | null;
        currentStreak: number;
        longestStreak: number;
        totalQuizzes: number;
        perfectScores: number;
        averageScore: number;
        weeklyPoints: number;
        studyTime: string;
        memberSince: string | null;
        lastActive: string | null;
        country: string | null;
        region: string | null;
        testDate: string | null;
        rankChange: number;
      }>;
      currentUserRank: {
        rank: number;
        name: string;
        masteryPoints: number;
        categoriesMastered: number;
        isCurrentUser: boolean;
        lastActivity: string | null;
      } | null;
      totalEntries: number;
    }>("leaderboard", { method: "GET" }),

  updateProfile: (payload: {
    display_name?: string;
    name?: string;
    email?: string;
    country?: string;
    region?: string;
    test_date?: string;
  }) =>
    callFn<{
      user_id: string;
      display_name: string | null;
      name: string | null;
      email: string | null;
    }>("profile-update", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateUserStats: (payload: {
    action: "quiz_completed" | "module_completed" | "study_session";
    data: any;
  }) =>
    callFn<{ success: boolean }>("update-user-stats", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getStudyGroups: () =>
    callFn<{
      userGroups: Array<{
        id: string;
        name: string;
        description: string | null;
        role: string;
        memberCount: number;
        joinedAt: string;
        is_private: boolean;
        invite_code: string | null;
      }>;
      publicGroups: Array<{
        id: string;
        name: string;
        description: string | null;
        memberCount: number;
        is_private: boolean;
      }>;
    }>("study-groups", { method: "GET" }),

  createStudyGroup: (payload: {
    name: string;
    description?: string;
    isPrivate: boolean;
  }) =>
    callFn<{
      id: string;
      name: string;
      description: string | null;
      invite_code: string | null;
      memberCount: number;
    }>("study-groups", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  joinStudyGroup: (payload: { groupId: string; inviteCode?: string }) =>
    callFn<{ message: string }>("join-group", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  leaveStudyGroup: (payload: { groupId: string }) =>
    callFn<{ message: string }>("leave-group", {
      method: "DELETE",
      body: JSON.stringify(payload),
    }),

  getGroupLeaderboard: (groupId: string) =>
    callFn<{
      groupLeaderboard: Array<{
        rank: number;
        name: string;
        role: string;
        masteryPoints: number;
        currentStreak: number;
        totalQuizzes: number;
        averageScore: number;
        weeklyPoints: number;
        isCurrentUser: boolean;
        joinedAt: string;
      }>;
    }>("group-leaderboard", {
      method: "GET",
      body: JSON.stringify({ groupId }),
    }),
};
