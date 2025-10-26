"use client";

import React from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function BasicChat() {
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [loading, setLoading] = React.useState(false);

  async function send() {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    const resp = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: text }),
      headers: { "Content-Type": "application/json" },
    });

    if (!resp.ok || !resp.body) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Server error." },
      ]);
      setLoading(false);
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let assistant = "";
    let buffer = "";

    function handleEvent(event: string, data: string) {
      if (event === "openai") {
        try {
          const j = JSON.parse(data);
          if (j.type === "response.output_text.delta") {
            assistant += j.delta;
            setMessages((m) => {
              const copy = [...m];
              const last = copy[copy.length - 1];
              if (last && last.role === "assistant") {
                copy[copy.length - 1] = {
                  role: "assistant",
                  content: assistant,
                };
              } else {
                copy.push({ role: "assistant", content: assistant });
              }
              return copy;
            });
          }
        } catch {}
      }
      if (event === "done") setLoading(false);
      if (event === "error") {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "API error." },
        ]);
        setLoading(false);
      }
    }

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const chunks = buffer.split("\n\n");
      buffer = chunks.pop() || "";
      for (const chunk of chunks) {
        const lines = chunk.split("\n");
        let event = "message";
        let data = "";
        for (const line of lines) {
          if (line.startsWith("event: ")) event = line.slice(7).trim();
          else if (line.startsWith("data: ")) data += line.slice(6).trim();
        }
        handleEvent(event, data);
      }
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-3">
      <div className="border rounded-lg p-3 h-80 overflow-auto bg-white">
        {messages.map((m, i) => (
          <div key={i} className="mb-2">
            <div
              className={`text-xs ${m.role === "user" ? "text-blue-500" : "text-green-600"}`}
            >
              {m.role}
            </div>
            <div>{m.content}</div>
          </div>
        ))}
        {loading && <div className="text-gray-400 text-sm">…thinking</div>}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something…"
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button
          onClick={send}
          disabled={loading}
          className="border rounded px-4 py-2 bg-black text-white disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
