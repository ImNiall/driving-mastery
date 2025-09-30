export type HistoryItem = {
  id: string;
  clerk_user_id: string;
  score: number;
  total: number;
  details: any | null;
  created_at: string;
};

const API_URL = "/api/history";

function authHeaders(token?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function getHistory(token?: string, days = 7): Promise<HistoryItem[]> {
  const url = `${API_URL}?days=${encodeURIComponent(String(days))}`;
  const resp = await fetch(url, { headers: authHeaders(token) });
  if (!resp.ok) throw new Error(await resp.text());
  const data = await resp.json();
  return (data.items || []) as HistoryItem[];
}

export async function logAttempt(
  params: { score: number; total: number; details?: any },
  token?: string
): Promise<void> {
  const resp = await fetch(API_URL, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(params),
  });
  if (!resp.ok) throw new Error(await resp.text());
}
