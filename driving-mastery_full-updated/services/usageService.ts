const API_URL = "/api/usage";

function authHeaders(token?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function checkUsed(token?: string, feature?: string): Promise<boolean> {
  if (!feature) throw new Error('feature is required');
  const resp = await fetch(`${API_URL}?feature=${encodeURIComponent(feature)}`, { headers: authHeaders(token) });
  if (!resp.ok) throw new Error(await resp.text());
  const data = await resp.json();
  return !!data.used;
}

export async function markUsed(params: { feature: string }, token?: string): Promise<{ used: boolean }> {
  const resp = await fetch(API_URL, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(params),
  });
  if (!resp.ok && resp.status !== 409) throw new Error(await resp.text());
  const data = await resp.json().catch(() => ({ used: resp.status === 409 }));
  return { used: !!data.used };
}
