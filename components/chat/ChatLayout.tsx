"use client";

import { Loader2, Menu } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import ChatSidebar, { type ChatSessionSummary } from "./ChatSidebar";
import ChatWindow, { type ChatMessageRecord } from "./ChatWindow";
import { supabase } from "@/lib/supabase/client";

type ApiSessionResponse = {
  sessions?: Array<{
    id: string;
    title: string | null;
    created_at: string;
    archived?: boolean | null;
  }>;
  error?: string;
};

type ApiMessageResponse = {
  messages?: ChatMessageRecord[];
  message?: ChatMessageRecord;
  error?: string;
};

const MAX_TITLE_LENGTH = 48;

function trimTitle(title: string | null | undefined) {
  if (!title) return "New chat";
  const normalized = title.trim();
  if (!normalized) return "New chat";
  if (normalized.length <= MAX_TITLE_LENGTH) return normalized;
  return `${normalized.slice(0, MAX_TITLE_LENGTH - 1)}…`;
}

function createDefaultTitle() {
  return `Chat — ${new Date().toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })}`;
}

function generateTitleFromMessage(message: string) {
  const normalized = message.trim().replace(/\s+/g, " ");
  if (!normalized) return createDefaultTitle();
  if (normalized.length <= MAX_TITLE_LENGTH) return normalized;
  return `${normalized.slice(0, MAX_TITLE_LENGTH - 1)}…`;
}

function isDefaultGeneratedTitle(title: string | null | undefined) {
  if (!title) return true;
  const trimmed = title.trim();
  if (!trimmed) return true;
  if (trimmed === "New Chat") return true;
  return /^Chat\s—\s/.test(trimmed);
}

export type ChatLayoutProps = {
  headerSlot?: ReactNode;
  variant?: "full" | "embedded";
};

export default function ChatLayout({
  headerSlot,
  variant = "full",
}: ChatLayoutProps) {
  const isEmbedded = variant === "embedded";
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [messagesBySession, setMessagesBySession] = useState<
    Record<string, ChatMessageRecord[]>
  >({});
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [creatingSession, setCreatingSession] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setAuthChecked(true);
    };
    bootstrap().catch((err) => {
      console.error("[ChatLayout] failed to bootstrap session", err);
      setAuthChecked(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        setUser(session?.user ?? null);
      },
    );

    return () => {
      mounted = false;
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const fetchSessions = useCallback(async () => {
    if (!user?.id) return;
    setSessionsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/chat/session?user_id=${encodeURIComponent(user.id)}`,
        { cache: "no-store", credentials: "include" },
      );
      if (!response.ok) {
        throw new Error(`Failed to load sessions (${response.status})`);
      }
      const payload = (await response.json()) as ApiSessionResponse;
      if (payload.error) throw new Error(payload.error);
      const fetched = payload.sessions ?? [];
      setSessions(fetched);
      if (fetched.length === 0) {
        setSelectedSessionId(null);
        return;
      }
      setSelectedSessionId((prev) => {
        if (prev && fetched.some((session) => session.id === prev)) {
          return prev;
        }
        return fetched[0]?.id ?? null;
      });
    } catch (err) {
      console.error("[ChatLayout] load sessions error", err);
      setError(
        err instanceof Error ? err.message : "Unable to load conversations.",
      );
    } finally {
      setSessionsLoading(false);
    }
  }, [user?.id]);

  const fetchMessages = useCallback(async (sessionId: string) => {
    if (!sessionId) return;
    setMessagesLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/chat/message?session_id=${encodeURIComponent(sessionId)}`,
        { cache: "no-store", credentials: "include" },
      );
      if (!response.ok) {
        throw new Error(`Failed to load messages (${response.status})`);
      }
      const payload = (await response.json()) as ApiMessageResponse;
      if (payload.error) throw new Error(payload.error);
      const loadedMessages = payload.messages ?? [];
      setMessagesBySession((prev) => ({
        ...prev,
        [sessionId]: loadedMessages,
      }));
    } catch (err) {
      console.error("[ChatLayout] load messages error", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load chat history right now.",
      );
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  const createSession = useCallback(
    async (title?: string) => {
      if (!user?.id) return null;
      setCreatingSession(true);
      setError(null);
      try {
        const response = await fetch("/api/chat/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            user_id: user.id,
            title: title ?? createDefaultTitle(),
          }),
        });
        if (!response.ok) {
          throw new Error(`Failed to create chat (${response.status})`);
        }
        const payload = (await response.json()) as {
          session?: ChatSessionSummary;
          error?: string;
        };
        if (payload.error) throw new Error(payload.error);
        if (!payload.session) {
          throw new Error("Session payload missing");
        }
        setSessions((prev) => [payload.session!, ...prev]);
        setMessagesBySession((prev) => ({
          ...prev,
          [payload.session!.id]: [],
        }));
        setSelectedSessionId(payload.session!.id);
        return payload.session!;
      } catch (err) {
        console.error("[ChatLayout] create session error", err);
        setError(
          err instanceof Error ? err.message : "Unable to start a new chat.",
        );
        return null;
      } finally {
        setCreatingSession(false);
      }
    },
    [user?.id],
  );

  const updateSessionTitle = useCallback(
    async (sessionId: string, sourceText: string) => {
      const nextTitle = generateTitleFromMessage(sourceText);
      setSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId ? { ...session, title: nextTitle } : session,
        ),
      );

      try {
        const response = await fetch("/api/chat/session", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ session_id: sessionId, title: nextTitle }),
        });
        if (!response.ok) {
          const text = await response.text().catch(() => "");
          throw new Error(text || `Failed to rename chat (${response.status})`);
        }
      } catch (err) {
        console.error("[ChatLayout] update session title error", err);
      }
    },
    [],
  );

  // Consume the /api/chat SSE stream so we can surface either the assistant
  // reply or any backend error directly in the UI.
  const fetchAssistantResponse = useCallback(async (prompt: string) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message: prompt }),
    });
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(
        text || `Failed to contact assistant (${response.status})`,
      );
    }

    const body = response.body;
    if (!body) {
      throw new Error("Assistant response stream missing");
    }

    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let assistantContent = "";
    let errorMessage: string | null = null;

    const processEvent = (block: string) => {
      const lines = block.split("\n");
      let eventType = "message";
      let data = "";
      for (const line of lines) {
        if (line.startsWith("event:")) {
          eventType = line.slice("event:".length).trim();
        } else if (line.startsWith("data:")) {
          data += `${line.slice("data:".length).trimStart()}\n`;
        }
      }

      const trimmed = data.trim();
      if (!trimmed) return;

      if (eventType === "assistant_message") {
        try {
          const parsed = JSON.parse(trimmed) as { content?: string };
          if (typeof parsed?.content === "string") {
            assistantContent = parsed.content;
          }
        } catch (parseError) {
          console.error(
            "[ChatLayout] failed to parse assistant message",
            parseError,
          );
        }
      } else if (eventType === "error") {
        try {
          const parsed = JSON.parse(trimmed) as {
            message?: string;
            detail?: string;
            status?: number;
          };
          const baseMessage =
            typeof parsed?.message === "string"
              ? parsed.message
              : "Assistant failed to respond.";
          const detail =
            typeof parsed?.detail === "string" && parsed.detail
              ? parsed.detail
              : null;
          const status =
            typeof parsed?.status === "number" ? ` (${parsed.status})` : "";
          errorMessage = detail
            ? `${baseMessage}${status}: ${detail}`
            : `${baseMessage}${status}`;
        } catch {
          errorMessage = "Assistant failed to respond.";
        }
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let delimiter = buffer.indexOf("\n\n");
      while (delimiter !== -1) {
        const chunk = buffer.slice(0, delimiter);
        buffer = buffer.slice(delimiter + 2);
        if (chunk.trim().length > 0) {
          processEvent(chunk);
        }
        delimiter = buffer.indexOf("\n\n");
      }
    }

    if (buffer.trim().length > 0) {
      processEvent(buffer);
    }

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    if (!assistantContent) {
      throw new Error("Assistant returned no content.");
    }

    return assistantContent;
  }, []);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!user?.id) {
        setError("You need to be signed in to chat with Theo.");
        return;
      }
      const trimmed = content.trim();
      if (!trimmed) return;

      let sessionId = selectedSessionId;
      let shouldRenameSession = false;

      if (!sessionId) {
        const newSession = await createSession(
          generateTitleFromMessage(trimmed),
        );
        sessionId = newSession?.id ?? null;
      }
      if (!sessionId) return;

      const targetSession = sessions.find(
        (session) => session.id === sessionId,
      );
      const existingMessages = messagesBySession[sessionId] ?? [];
      const hasUserMessages = existingMessages.some(
        (msg) => msg.role === "user",
      );
      if (!hasUserMessages && isDefaultGeneratedTitle(targetSession?.title)) {
        shouldRenameSession = true;
      }

      const targetSessionId = sessionId;
      setError(null);
      const optimistic: ChatMessageRecord = {
        id: `temp-${Date.now()}`,
        session_id: targetSessionId,
        role: "user",
        content: trimmed,
        created_at: new Date().toISOString(),
      };
      setMessagesBySession((prev) => {
        const current = prev[targetSessionId] ?? [];
        return {
          ...prev,
          [targetSessionId]: [...current, optimistic],
        };
      });
      setSending(true);

      let userMessageSaved = false;
      let assistantOptimisticId: string | null = null;

      try {
        const response = await fetch("/api/chat/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            session_id: targetSessionId,
            user_id: user.id,
            role: "user",
            content: trimmed,
          }),
        });
        if (!response.ok) {
          throw new Error(`Failed to send message (${response.status})`);
        }
        const payload = (await response.json()) as ApiMessageResponse;
        if (payload.error) throw new Error(payload.error);
        const savedMessage = payload.message;
        if (!savedMessage) {
          throw new Error("Failed to persist user message.");
        }
        userMessageSaved = true;
        setMessagesBySession((prev) => {
          const current = prev[targetSessionId] ?? [];
          return {
            ...prev,
            [targetSessionId]: current.map((msg) =>
              msg.id === optimistic.id ? savedMessage : msg,
            ),
          };
        });

        if (shouldRenameSession) {
          void updateSessionTitle(targetSessionId, trimmed);
        }

        const assistantContent = await fetchAssistantResponse(trimmed);
        const assistantOptimistic: ChatMessageRecord = {
          id: `assistant-temp-${Date.now()}`,
          session_id: targetSessionId,
          role: "assistant",
          content: assistantContent,
          created_at: new Date().toISOString(),
        };
        assistantOptimisticId = assistantOptimistic.id;
        setMessagesBySession((prev) => {
          const current = prev[targetSessionId] ?? [];
          return {
            ...prev,
            [targetSessionId]: [...current, assistantOptimistic],
          };
        });

        const assistantSave = await fetch("/api/chat/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            session_id: targetSessionId,
            user_id: user.id,
            role: "assistant",
            content: assistantContent,
          }),
        });
        if (!assistantSave.ok) {
          const text = await assistantSave.text().catch(() => "");
          throw new Error(
            text || `Failed to save assistant reply (${assistantSave.status})`,
          );
        }
        const assistantPayload =
          (await assistantSave.json()) as ApiMessageResponse;
        if (assistantPayload.error) throw new Error(assistantPayload.error);
        const persistedAssistant = assistantPayload.message;
        if (persistedAssistant) {
          setMessagesBySession((prev) => {
            const current = prev[targetSessionId] ?? [];
            return {
              ...prev,
              [targetSessionId]: current.map((msg) =>
                msg.id === assistantOptimisticId ? persistedAssistant : msg,
              ),
            };
          });
        }
      } catch (err) {
        console.error("[ChatLayout] send message error", err);
        setMessagesBySession((prev) => {
          const current = prev[targetSessionId] ?? [];
          let next = current;
          if (!userMessageSaved) {
            next = next.filter((msg) => msg.id !== optimistic.id);
          }
          if (assistantOptimisticId) {
            next = next.filter((msg) => msg.id !== assistantOptimisticId);
          }
          return {
            ...prev,
            [targetSessionId]: next,
          };
        });
        setError(
          err instanceof Error ? err.message : "Failed to send your message.",
        );
      } finally {
        setSending(false);
      }
    },
    [createSession, fetchAssistantResponse, selectedSessionId, user?.id],
  );

  useEffect(() => {
    if (!user?.id) return;
    fetchSessions().catch((err) =>
      console.error("[ChatLayout] initial session load error", err),
    );
  }, [user?.id, fetchSessions]);

  useEffect(() => {
    if (!selectedSessionId) return;
    if (messagesBySession[selectedSessionId]) return;
    fetchMessages(selectedSessionId).catch((err) =>
      console.error("[ChatLayout] session history error", err),
    );
  }, [fetchMessages, selectedSessionId, messagesBySession]);

  const selectedSession = useMemo(
    () =>
      selectedSessionId
        ? (sessions.find((session) => session.id === selectedSessionId) ?? null)
        : null,
    [selectedSessionId, sessions],
  );

  const currentMessages = selectedSessionId
    ? (messagesBySession[selectedSessionId] ?? [])
    : [];

  const userLabel =
    user?.user_metadata?.full_name ??
    user?.email ??
    user?.phone ??
    "Guest account";

  const showAuthPrompt = authChecked && !user;

  const headerWrapperClass = isEmbedded
    ? "mb-6 w-full"
    : "mx-auto mb-10 w-full max-w-6xl px-5";

  const layoutWrapperClass = isEmbedded
    ? "flex w-full flex-col gap-6 lg:flex-row"
    : "mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 lg:flex-row";

  const chatContainerClass = isEmbedded
    ? "flex min-h-[520px] flex-1 flex-col"
    : "flex min-h-[70vh] flex-1 flex-col";

  const shell = (
    <>
      {headerSlot ? (
        <div className={headerWrapperClass}>{headerSlot}</div>
      ) : null}
      <div className={layoutWrapperClass}>
        <div className="hidden w-[320px] flex-shrink-0 lg:block">
          <ChatSidebar
            sessions={sessions}
            selectedSessionId={selectedSessionId}
            onSelectSession={setSelectedSessionId}
            onNewChat={() => void createSession()}
            isLoading={sessionsLoading || creatingSession}
            userLabel={userLabel}
          />
        </div>

        <div className="flex flex-1 min-h-0 flex-col gap-4">
          <div className="flex items-center justify-between lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm shadow-indigo-100"
            >
              <Menu className="h-4 w-4" />
              Conversations
            </button>
            {(sessionsLoading || creatingSession) && (
              <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
            )}
          </div>

          <div className={`${chatContainerClass} min-h-0`}>
            {showAuthPrompt ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-[40px] border border-dashed border-indigo-200 bg-white/80 p-10 text-center shadow-lg shadow-indigo-100">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Sign in to continue
                </h2>
                <p className="max-w-md text-sm leading-6 text-slate-500">
                  You need to be logged in to save conversations with Theo.
                  Please sign in or create an account to get started.
                </p>
              </div>
            ) : (
              <ChatWindow
                messages={currentMessages}
                sessionTitle={trimTitle(selectedSession?.title)}
                isLoadingMessages={messagesLoading}
                isSending={sending}
                onSendMessage={handleSendMessage}
                disabled={!user}
                onStartNewChat={() => void createSession()}
                errorMessage={error}
              />
            )}
          </div>
        </div>
      </div>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative ml-auto flex h-full w-[calc(100%-2.5rem)] max-w-xs flex-col p-4">
            <ChatSidebar
              sessions={sessions}
              selectedSessionId={selectedSessionId}
              onSelectSession={(sessionId) => {
                setSelectedSessionId(sessionId);
                setSidebarOpen(false);
              }}
              onNewChat={async () => {
                await createSession();
                setSidebarOpen(false);
              }}
              isLoading={sessionsLoading || creatingSession}
              userLabel={userLabel}
              onCloseMobile={() => setSidebarOpen(false)}
              showMobileClose
            />
          </div>
        </div>
      ) : null}
    </>
  );

  if (isEmbedded) {
    return <div className="relative flex flex-col gap-6">{shell}</div>;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#EEF3FF] via-[#EFF2FF] to-[#F7F9FF] pb-10 pt-8">
      {shell}
    </div>
  );
}
