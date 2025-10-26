"use client";

/* eslint-disable no-console */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

type Role = "user" | "assistant";

type ConnectionState = "idle" | "connecting" | "ready" | "error";

type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  streaming?: boolean;
};

type ChatkitMessagePayload = {
  id: string;
  role: Role;
  content?: string;
  created_at?: number;
};

type ChatkitIncomingEvent =
  | { type: "message.created"; message: ChatkitMessagePayload }
  | {
      type: "message.delta";
      message_id: string;
      delta?: string;
      done?: boolean;
    }
  | { type: "message.completed"; message_id: string }
  | {
      type: "response.output_text.delta";
      response_id?: string;
      message_id?: string;
      delta?: string;
      done?: boolean;
    }
  | { type: "response.completed"; response_id?: string }
  | { type: "response.error"; error: { message?: string } }
  | { type: "error"; error?: { message?: string } }
  | { type: "proxy.session"; model?: string }
  | { type: string; [key: string]: unknown };

const DEFAULT_MODEL = "gpt-realtime";
const WS_PROXY_PATH = "/api/chatkit/ws";
const MAX_RECONNECT_ATTEMPTS = 1;

function formatTimestamp(timestamp: number) {
  try {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function stableBrowserId() {
  try {
    const storageKey = "theo_uid";
    let value = window.localStorage.getItem(storageKey);
    if (!value) {
      const fallback =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2);
      value = fallback;
      window.localStorage.setItem(storageKey, value);
    }
    return `anon-${value}`;
  } catch (error) {
    console.warn("[CustomChat] unable to use localStorage", error);
    return "anon-browser";
  }
}

function createMessageFromPayload(payload: ChatkitMessagePayload): ChatMessage {
  const createdAt =
    payload.created_at != null
      ? typeof payload.created_at === "number"
        ? payload.created_at > 1e12
          ? payload.created_at
          : payload.created_at * 1000
        : Date.now()
      : Date.now();

  return {
    id: payload.id,
    role: payload.role ?? "assistant",
    content: payload.content ?? "",
    createdAt,
    streaming: payload.role === "assistant",
  };
}

export default function CustomChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<ConnectionState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [modelName, setModelName] = useState<string>(DEFAULT_MODEL);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const pendingAssistantId = useRef<string | null>(null);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const statusRef = useRef<ConnectionState>("idle");

  const userId = useMemo(() => stableBrowserId(), []);

  const appendOrUpdateMessage = useCallback(
    (updater: (existing: ChatMessage[]) => ChatMessage[]) => {
      setMessages((prev) => updater(prev));
    },
    [],
  );

  const applyAssistantDelta = useCallback(
    (messageId: string, delta: string, done?: boolean) => {
      pendingAssistantId.current = messageId;
      appendOrUpdateMessage((prev) => {
        const existingIndex = prev.findIndex((msg) => msg.id === messageId);
        if (existingIndex === -1) {
          return [
            ...prev,
            {
              id: messageId,
              role: "assistant",
              content: delta,
              createdAt: Date.now(),
              streaming: !done,
            },
          ];
        }
        const next = [...prev];
        const target = next[existingIndex]!;
        next[existingIndex] = {
          ...target,
          content: `${target.content ?? ""}${delta ?? ""}`,
          streaming: done ? false : true,
        };
        return next;
      });
      if (done) {
        setAwaitingResponse(false);
      }
    },
    [appendOrUpdateMessage],
  );

  const updateStatus = useCallback((next: ConnectionState) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const handleIncomingEvent = useCallback(
    (event: ChatkitIncomingEvent) => {
      switch (event.type) {
        case "proxy.session": {
          if (typeof event.model === "string" && event.model.length > 0) {
            setModelName(event.model);
          }
          break;
        }
        case "message.created": {
          if (!("message" in event) || !event.message) {
            break;
          }
          const createdEvent = event as Extract<
            ChatkitIncomingEvent,
            { type: "message.created" }
          >;
          if (createdEvent.message.role === "assistant") {
            pendingAssistantId.current = createdEvent.message.id;
            setAwaitingResponse(false);
          }
          appendOrUpdateMessage((prev) => {
            if (prev.some((m) => m.id === createdEvent.message.id)) {
              return prev.map((msg) =>
                msg.id === createdEvent.message.id
                  ? {
                      ...msg,
                      content: createdEvent.message.content ?? msg.content,
                      streaming: createdEvent.message.role === "assistant",
                      createdAt:
                        createdEvent.message.created_at != null
                          ? createMessageFromPayload(createdEvent.message)
                              .createdAt
                          : msg.createdAt,
                    }
                  : msg,
              );
            }
            return [...prev, createMessageFromPayload(createdEvent.message)];
          });
          break;
        }
        case "message.delta": {
          const messageId =
            typeof event.message_id === "string"
              ? event.message_id
              : (pendingAssistantId.current ?? "assistant");
          const delta = typeof event.delta === "string" ? event.delta : "";
          const doneFlag =
            typeof event.done === "boolean" ? event.done : undefined;
          applyAssistantDelta(messageId, delta, doneFlag);
          break;
        }
        case "message.completed": {
          const completeId =
            event.message_id ?? pendingAssistantId.current ?? undefined;
          if (completeId) {
            appendOrUpdateMessage((prev) =>
              prev.map((msg) =>
                msg.id === completeId ? { ...msg, streaming: false } : msg,
              ),
            );
            setAwaitingResponse(false);
            pendingAssistantId.current = null;
          }
          break;
        }
        case "response.output_text.delta": {
          const candidateIds = [
            event.message_id,
            event.response_id,
            pendingAssistantId.current,
          ];
          const targetId =
            candidateIds.find(
              (value): value is string => typeof value === "string",
            ) ?? `assistant-${Date.now()}`;
          const responseDelta =
            typeof event.delta === "string" ? event.delta : "";
          const doneFlag =
            typeof event.done === "boolean" ? event.done : undefined;
          applyAssistantDelta(targetId, responseDelta, doneFlag);
          break;
        }
        case "response.completed": {
          if (pendingAssistantId.current) {
            appendOrUpdateMessage((prev) =>
              prev.map((msg) =>
                msg.id === pendingAssistantId.current
                  ? { ...msg, streaming: false }
                  : msg,
              ),
            );
          }
          setAwaitingResponse(false);
          pendingAssistantId.current = null;
          break;
        }
        case "response.error":
        case "error": {
          const message =
            (event as { error?: { message?: string } })?.error?.message ??
            "ChatKit reported an error.";
          setError(message);
          setAwaitingResponse(false);
          break;
        }
        default: {
          // Ignore events we do not understand yet but log them for debugging in development.
          if (process.env.NODE_ENV === "development") {
            console.info("[CustomChat] Unhandled event", event);
          }
        }
      }
    },
    [appendOrUpdateMessage, applyAssistantDelta],
  );

  const teardownSocket = useCallback(() => {
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (err) {
        console.warn("[CustomChat] error closing websocket", err);
      }
    }
    wsRef.current = null;
  }, []);

  const connect = useCallback(async () => {
    if (statusRef.current === "connecting") {
      return;
    }
    teardownSocket();
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    updateStatus("connecting");
    setError(null);

    try {
      if (typeof window === "undefined") {
        throw new Error("Chat is unavailable in this environment.");
      }

      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      const wsUrl = new URL(`${protocol}://${window.location.host}`);
      wsUrl.pathname = WS_PROXY_PATH;
      wsUrl.searchParams.set("userId", userId ?? "anon-browser");

      const socket = new WebSocket(wsUrl.toString());
      wsRef.current = socket;

      socket.onopen = () => {
        reconnectAttempts.current = 0;
        updateStatus("ready");
      };

      socket.onmessage = (event) => {
        const frames: string[] = [];
        if (typeof event.data === "string") {
          frames.push(...event.data.split("\n").filter(Boolean));
        } else if (event.data instanceof ArrayBuffer) {
          const decoded = new TextDecoder().decode(event.data);
          frames.push(...decoded.split("\n").filter(Boolean));
        }

        for (const frame of frames) {
          try {
            const parsed = JSON.parse(frame) as ChatkitIncomingEvent;
            handleIncomingEvent(parsed);
          } catch (err) {
            console.warn("[CustomChat] unable to parse frame", frame, err);
          }
        }
      };

      socket.onerror = (event) => {
        console.error("[CustomChat] websocket error", event);
        setError("Chat connection experienced an error.");
      };

      socket.onclose = (event) => {
        console.error("[CustomChat] websocket closed", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });
        wsRef.current = null;
        if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts.current += 1;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect().catch((err) =>
              console.error("[CustomChat] reconnect failed", err),
            );
          }, 1000);
        } else {
          updateStatus("error");
          setError("Chat connection lost. Please retry.");
        }
      };
    } catch (err: any) {
      console.error("[CustomChat] failed to connect", err);
      updateStatus("error");
      setError(err?.message ?? "Failed to initialise chat.");
    }
  }, [handleIncomingEvent, teardownSocket, updateStatus, userId]);

  useEffect(() => {
    connect().catch((err) =>
      console.error("[CustomChat] initial connection failed", err),
    );
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      teardownSocket();
    };
  }, [connect, teardownSocket]);

  useEffect(() => {
    const anchor = scrollAnchorRef.current;
    if (anchor && typeof anchor.scrollIntoView === "function") {
      anchor.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, awaitingResponse]);

  const pushUserMessage = useCallback((content: string) => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? `user-${crypto.randomUUID()}`
        : `user-${Date.now()}`;
    const createdAt = Date.now();
    const message: ChatMessage = {
      id,
      role: "user",
      content,
      createdAt,
    };
    setMessages((prev) => [...prev, message]);
    return message;
  }, []);

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        setError("Chat is not connected. Please retry.");
        return;
      }
      const userMessage = pushUserMessage(content.trim());
      setAwaitingResponse(true);

      const payload = {
        type: "message.create",
        message: {
          id: userMessage.id,
          role: "user",
          content: userMessage.content,
          created_at: Math.floor(userMessage.createdAt / 1000),
        },
      };

      try {
        wsRef.current.send(JSON.stringify(payload));
      } catch (err) {
        console.error("[CustomChat] failed to send", err);
        setError("Unable to send message.");
        setAwaitingResponse(false);
      }
    },
    [pushUserMessage],
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = input.trim();
      if (!trimmed) return;
      sendMessage(trimmed);
      setInput("");
    },
    [input, sendMessage],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        const trimmed = input.trim();
        if (trimmed) {
          sendMessage(trimmed);
          setInput("");
        }
      }
    },
    [input, sendMessage],
  );

  const statusLabel =
    status === "ready"
      ? "Connected"
      : status === "connecting"
        ? "Connecting…"
        : status === "error"
          ? "Connection error"
          : "Idle";

  const statusClass =
    status === "ready"
      ? "text-emerald-600"
      : status === "connecting"
        ? "text-amber-600"
        : status === "error"
          ? "text-red-600"
          : "text-slate-500";

  return (
    <div className="flex h-[620px] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <p className="text-lg font-semibold text-slate-900">
            Theo · AI Mentor
          </p>
          <p className="text-xs text-slate-500">
            Model: <span className="font-medium">{modelName}</span>
          </p>
        </div>
        <span className={`text-xs font-medium ${statusClass}`}>
          {statusLabel}
        </span>
      </header>

      {error && (
        <div className="flex items-center justify-between gap-3 border-b border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button
            type="button"
            className="rounded-full border border-red-500 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
            onClick={() => connect()}
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex flex-col gap-4">
          {messages.length === 0 && status === "ready" && (
            <div className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-slate-500">
              Introduce yourself or ask Theo to build a revision plan.
            </div>
          )}
          {messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[80%] space-y-1">
                  <div
                    className={`rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                      isUser
                        ? "bg-brand-blue text-white"
                        : "bg-slate-100 text-slate-900"
                    } ${message.streaming ? "animate-pulse" : ""}`}
                  >
                    {message.content || (
                      <span className="opacity-60">Thinking…</span>
                    )}
                  </div>
                  <div
                    className={`text-[11px] uppercase tracking-wide ${
                      isUser ? "text-right text-slate-400" : "text-slate-400"
                    }`}
                  >
                    {formatTimestamp(message.createdAt)}
                  </div>
                </div>
              </div>
            );
          })}
          {awaitingResponse && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-brand-blue" />
              Theo is typing…
            </div>
          )}
          <div ref={scrollAnchorRef} />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-slate-200 bg-slate-50/60 px-5 py-4"
      >
        <div className="flex items-end gap-3">
          <textarea
            className="h-24 flex-1 resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            placeholder="Ask Theo anything about your driving theory prep…"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={status === "connecting"}
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-2xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-blue/90 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={
              !input.trim() ||
              status !== "ready" ||
              wsRef.current?.readyState !== WebSocket.OPEN
            }
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
