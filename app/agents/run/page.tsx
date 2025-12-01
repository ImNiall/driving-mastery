"use client";
/**
 * Chat-style UI for Theo (Driving Mastery Agent). Sends POST /api/agents/run with { prompt } and renders assistant markdown replies.
 */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Markdown from "react-markdown";

type ChatRole = "user" | "assistant" | "system";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
};

type AgentResponse = {
  output?: string;
};

const suggestions = [
  "What are the trickiest UK theory test questions people miss?",
  "Create a 20-minute revision plan for hazard perception.",
  "Explain speed limits for different vehicle types.",
];

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

function formatTimestamp(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export default function AgentRunPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: makeId(),
      role: "assistant",
      content:
        "Hi, I'm Theo, your Driving Mastery mentor. Ask me anything about the UK theory test or hazard perception and I'll guide you.",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const hasUserMessages = useMemo(
    () => messages.some((message) => message.role === "user"),
    [messages],
  );

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!bottomRef.current) return;
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const sendMessage = async () => {
    const prompt = input.trim();
    if (!prompt || isSending) return;

    const now = new Date().toISOString();
    const userMessage: ChatMessage = {
      id: makeId(),
      role: "user",
      content: prompt,
      createdAt: now,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setErrorBanner(null);
    setIsSending(true);

    try {
      const res = await fetch("/api/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }

      const data = (await res.json()) as AgentResponse;
      const assistantContent =
        data.output ?? "I couldn't find a reply this time. Want to try again?";
      const assistantMessage: ChatMessage = {
        id: makeId(),
        role: "assistant",
        content: assistantContent,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Agent call failed", error);
      setErrorBanner("Could not reach Theo. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content: "Something went wrong, please try again in a moment.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-6 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Theo · Driving Mastery Agent
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Ask Theo anything about the UK theory test
            </h1>
            <p className="mt-2 max-w-3xl text-slate-600">
              Chat with our Driving Mastery Agent for explanations, revision
              plans, and quick answers. Theo replies with markdown so code and
              lists stay readable.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-full w-full max-w-5xl flex-1 flex-col px-4 pb-6 pt-4 sm:px-6 lg:px-8">
        <div className="flex h-full min-h-[70vh] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40">
          <div
            ref={chatRef}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-6"
          >
            {!hasUserMessages ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 sm:px-6">
                <div className="mb-2 text-sm font-semibold text-slate-900">
                  Try asking:
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setInput(suggestion)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((message) => {
              const isUser = message.role === "user";
              const isSystem = message.role === "system";
              const bubbleColor = isUser
                ? "bg-blue-600 text-white"
                : isSystem
                  ? "bg-amber-50 text-amber-900 border border-amber-100"
                  : "bg-slate-100 text-slate-900 border border-slate-200";

              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[80%] space-y-2">
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${bubbleColor}`}
                    >
                      {message.role === "assistant" ? (
                        <Markdown
                          className="space-y-3"
                          components={{
                            p: ({ children }) => (
                              <p className="leading-relaxed">{children}</p>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc space-y-1 pl-5">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal space-y-1 pl-5">
                                {children}
                              </ol>
                            ),
                            code: ({ children }) => (
                              <code className="rounded bg-slate-800/90 px-1 py-0.5 font-mono text-xs text-slate-50">
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-50">
                                {children}
                              </pre>
                            ),
                            a: ({ children, href }) => (
                              <a
                                href={href}
                                className="text-blue-700 underline underline-offset-2"
                                target="_blank"
                                rel="noreferrer"
                              >
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {message.content}
                        </Markdown>
                      ) : (
                        <p className="whitespace-pre-line">{message.content}</p>
                      )}
                    </div>
                    <div
                      className={`text-xs font-medium text-slate-500 ${isUser ? "text-right" : "text-left"}`}
                    >
                      {message.role === "assistant" ? "Theo" : "You"} ·{" "}
                      {formatTimestamp(message.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })}

            {isSending ? (
              <div className="flex justify-start">
                <div className="max-w-[80%]">
                  <div className="flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900 shadow-sm">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                    Theo is thinking…
                  </div>
                  <div className="mt-1 text-xs font-medium text-slate-500">
                    {formatTimestamp(new Date().toISOString())}
                  </div>
                </div>
              </div>
            ) : null}

            <div ref={bottomRef} />
          </div>

          {errorBanner ? (
            <div className="border-t border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700 sm:px-6">
              {errorBanner}
            </div>
          ) : null}

          <div className="border-t border-slate-200 bg-white/95 px-4 py-3 shadow-inner backdrop-blur sm:px-6">
            <label htmlFor="agent-input" className="sr-only">
              Message Theo
            </label>
            <div className="flex items-end gap-3">
              <div className="relative flex-1">
                <textarea
                  id="agent-input"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={3}
                  placeholder="Type your question…"
                  aria-label="Message Theo"
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-inner outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSending}
                />
                <p className="mt-1 text-xs text-slate-500">
                  Enter to send · Shift+Enter for a new line
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  void sendMessage();
                }}
                disabled={isSending || input.trim().length === 0}
                className="mb-1 inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSending ? "Sending…" : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
