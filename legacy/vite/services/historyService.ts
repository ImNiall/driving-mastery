export type HistoryItem = {
  id: string;
  clerk_user_id: string;
  score: number;
  total: number;
  details: any | null;
  created_at: string;
};

export type WrongAnswer = {
  questionId: string;
  selected: string; // user's choice
  correct: string; // correct answer
  category?: string; // optional DVSA category
  timestamp?: string; // ISO string
};

const API_URL = "/api/history";

function authHeaders(token?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function getHistory(
  token?: string,
  days = 7,
): Promise<HistoryItem[]> {
  const url = `${API_URL}?days=${encodeURIComponent(String(days))}`;
  const resp = await fetch(url, { headers: authHeaders(token) });
  if (!resp.ok) throw new Error(await resp.text());
  const data = await resp.json();
  return (data.items || []) as HistoryItem[];
}

// Dedicated helper for wrong answers
export async function storeWrongAnswers(
  attemptId: string,
  wrong: WrongAnswer[],
  token?: string,
) {
  const res = await fetch("/api/history", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({
      type: "wrong_answers",
      attemptId,
      details: { wrong },
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `historyService.storeWrongAnswers failed: ${res.status} ${text}`,
    );
  }
  try {
    return await res.json();
  } catch {
    return {};
  }
}

// Generic attempt logger for scores etc.
export async function logAttempt(
  payload: {
    attemptId: string;
    score: number;
    total: number;
    meta?: Record<string, any>;
  },
  token?: string,
): Promise<any> {
  const res = await fetch("/api/history", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ type: "attempt", ...payload }),
  });
  if (!res.ok)
    throw new Error(`historyService.logAttempt failed: ${res.status}`);
  try {
    return await res.json();
  } catch {
    return null;
  }
}
