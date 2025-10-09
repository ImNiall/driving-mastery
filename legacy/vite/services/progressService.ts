import { QuizAction } from "../types";

export type ProgressItem = {
  id: string;
  clerk_user_id: string;
  category: string;
  correct: number;
  total: number;
  updated_at: string;
};

const API_URL = "/api/progress";

function authHeaders(token?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function getProgress(
  token?: string,
  category?: string,
): Promise<ProgressItem[]> {
  const url = category
    ? `${API_URL}?category=${encodeURIComponent(category)}`
    : API_URL;
  const resp = await fetch(url, { headers: authHeaders(token) });
  if (!resp.ok) throw new Error(await resp.text());
  const data = await resp.json();
  return (data.items || []) as ProgressItem[];
}

export async function upsertProgress(
  params: { category: string; correct: number; total: number },
  token?: string,
): Promise<ProgressItem> {
  const resp = await fetch(API_URL, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(params),
  });
  if (!resp.ok) throw new Error(await resp.text());
  const data = await resp.json();
  return data.item as ProgressItem;
}

export async function incrementProgress(
  params: { category: string; deltaCorrect?: number; deltaTotal?: number },
  token?: string,
): Promise<ProgressItem> {
  const resp = await fetch(API_URL, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(params),
  });
  if (!resp.ok) throw new Error(await resp.text());
  const data = await resp.json();
  return data.item as ProgressItem;
}

export async function deleteProgress(
  token?: string,
  category?: string,
): Promise<void> {
  const url = category
    ? `${API_URL}?category=${encodeURIComponent(category)}`
    : API_URL;
  const resp = await fetch(url, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!resp.ok && resp.status !== 204) throw new Error(await resp.text());
}
