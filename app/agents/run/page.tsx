"use client";
import { useState } from "react";

export default function AgentRunPage() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    const p = prompt.trim();
    if (!p) return;
    setLoading(true);
    setError(null);
    setOutput(null);
    try {
      const res = await fetch("/api/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: p }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed (${res.status})`);
      }
      const json = (await res.json()) as { output?: string };
      setOutput(json.output ?? "");
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Run Agent</h1>
        <p className="text-slate-600">
          Send a prompt to the local Agent endpoint and view the result.
        </p>
      </header>

      <section className="space-y-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask the agent..."
          rows={5}
          className="w-full rounded-xl border border-slate-300 p-3 text-base outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleRun}
          disabled={loading || prompt.trim().length === 0}
          className="rounded-xl bg-blue-600 px-4 py-2 text-white font-semibold disabled:opacity-60"
        >
          {loading ? "Running…" : "Run Agent"}
        </button>
      </section>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {output !== null ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Output</h2>
          <div className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-4 text-slate-800">
            {output || ""}
          </div>
        </section>
      ) : null}
    </main>
  );
}
