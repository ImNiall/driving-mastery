"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Markdown from "react-markdown";
import { AssistantStream } from "openai/lib/AssistantStream";
import type { AssistantStreamEvents } from "openai/lib/AssistantStream";
import type { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import type { AssistantMessageRecord } from "@/lib/assistant/types";
import styles from "./assistant-chat.module.css";

type StreamEvent = Parameters<AssistantStreamEvents["event"]>[0];
type RequiresActionEvent = Extract<
  StreamEvent,
  { event: "thread.run.requires_action" }
>;

type ChatMessage = AssistantMessageRecord & {
  optimistic?: boolean;
};

type ThreadSummary = {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
};

type ThreadDetail = {
  id: string;
  openaiThreadId: string;
  title: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

type ThreadResponse = {
  threadId: string;
  openaiThreadId: string;
  title: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  messages: AssistantMessageRecord[];
  nextCursor: string | null;
};

type MessagesResponse = {
  messages: AssistantMessageRecord[];
  nextCursor: string | null;
  hasMore?: boolean;
};

type AssistantChatProps = {
  functionCallHandler?: (
    toolCall: RequiredActionFunctionToolCall,
  ) => Promise<string>;
};

const MESSAGE_SYNC_LIMIT = 40;
const MESSAGE_PAGE_LIMIT = 30;

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
});

function compareMessagesByCreatedAt(a: ChatMessage, b: ChatMessage) {
  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
}

function toChatMessages(messages: AssistantMessageRecord[]): ChatMessage[] {
  return [...messages]
    .map((message) => ({ ...message, optimistic: false }))
    .sort(compareMessagesByCreatedAt);
}

function mergeMessages(
  existing: ChatMessage[],
  incoming: AssistantMessageRecord[],
) {
  const baseMap = new Map<string, ChatMessage>();
  existing
    .filter((message) => !message.optimistic)
    .forEach((message) => baseMap.set(message.id, message));

  incoming.forEach((message) =>
    baseMap.set(message.id, { ...message, optimistic: false }),
  );

  const optimistic = existing.filter((message) => message.optimistic);
  optimistic.forEach((message) => {
    if (!baseMap.has(message.id)) {
      baseMap.set(message.id, message);
    }
  });

  return [...baseMap.values()].sort(compareMessagesByCreatedAt);
}

function formatMessageTimestamp(isoString: string) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const now = new Date();
  const isSameDay = date.toDateString() === now.toDateString();
  return isSameDay
    ? timeFormatter.format(date)
    : `${dateFormatter.format(date)} · ${timeFormatter.format(date)}`;
}

function formatThreadTitle(summary: ThreadSummary) {
  if (summary.title && summary.title.trim().length > 0) {
    return summary.title;
  }
  const date = new Date(summary.createdAt);
  const formatted = Number.isNaN(date.getTime())
    ? "Conversation"
    : `Conversation started ${dateFormatter.format(date)}`;
  return formatted;
}

function formatRelativeUpdatedAt(isoString: string) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);
  if (diffMinutes <= 1) return "Updated just now";
  if (diffMinutes < 60) return `Updated ${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `Updated ${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `Updated ${diffDays}d ago`;
}

function pickOlderCursor(
  previousCursor: string | null,
  currentCursor: string | null,
) {
  if (!currentCursor) return previousCursor;
  if (!previousCursor) return currentCursor;
  return new Date(currentCursor) < new Date(previousCursor)
    ? currentCursor
    : previousCursor;
}

type MessageBubbleProps = {
  message: ChatMessage;
  onRetry: (message: ChatMessage) => void;
};

function MessageBubble({ message, onRetry }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const bubbleClass = [
    styles.messageBubble,
    isUser ? styles.userBubble : styles.assistantBubble,
  ]
    .filter(Boolean)
    .join(" ");

  const status = message.status ?? (message.optimistic ? "pending" : null);
  const showRetry = isUser && status === "error";

  let statusLabel: string | null = null;
  if (status && status !== "complete") {
    if (status === "pending") statusLabel = "Sending…";
    else if (status === "requires_action") statusLabel = "Waiting for tools…";
    else if (status === "error") statusLabel = "Something went wrong";
    else statusLabel = status;
  }

  return (
    <div
      className={[
        styles.messageRow,
        isUser ? styles.messageRowUser : styles.messageRowAssistant,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={bubbleClass}>
        <div className={styles.messageContent}>
          {message.role === "assistant" ? (
            <Markdown>{message.content}</Markdown>
          ) : (
            message.content
          )}
        </div>
        <div className={styles.messageMeta}>
          <span className={styles.messageTimestamp}>
            {formatMessageTimestamp(message.createdAt)}
          </span>
          {statusLabel ? (
            <span
              className={[
                styles.statusBadge,
                status === "error"
                  ? styles.statusBadgeError
                  : styles.statusBadgeMuted,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {statusLabel}
            </span>
          ) : null}
          {showRetry ? (
            <button
              type="button"
              className={styles.retryButton}
              onClick={() => onRetry(message)}
            >
              Retry
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const AssistantChat = ({
  functionCallHandler = async () => "",
}: AssistantChatProps) => {
  const [threadSummaries, setThreadSummaries] = useState<ThreadSummary[]>([]);
  const [activeThread, setActiveThread] = useState<ThreadDetail | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [userInput, setUserInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isThreadMenuOpen, setIsThreadMenuOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);
  const currentAssistantMessageIdRef = useRef<string | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  const loadThreadSummaries = useCallback(async () => {
    try {
      const response = await fetch("/api/assistants/threads");
      if (!response.ok) {
        throw new Error(`Failed to list threads (${response.status})`);
      }
      const data = (await response.json()) as ThreadSummary[];
      setThreadSummaries(data);
      setActiveThread((prev) => {
        if (!prev) return prev;
        const updated = data.find((item) => item.id === prev.id);
        if (!updated) return prev;
        if (
          updated.title === prev.title &&
          updated.updatedAt === prev.updatedAt
        ) {
          return prev;
        }
        return {
          ...prev,
          title: updated.title,
          updatedAt: updated.updatedAt,
        };
      });
    } catch (loadError) {
      console.error("[AssistantChat] failed to fetch thread summaries", {
        loadError,
      });
    }
  }, []);

  const hydrateThread = useCallback((data: ThreadResponse) => {
    const thread: ThreadDetail = {
      id: data.threadId,
      openaiThreadId: data.openaiThreadId,
      title: data.title,
      metadata: data.metadata ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
    setActiveThread(thread);
    setMessages(toChatMessages(data.messages));
    setNextCursor(data.nextCursor ?? null);
    currentAssistantMessageIdRef.current = null;
    shouldAutoScrollRef.current = true;
  }, []);

  const fetchLatestThread = useCallback(
    async (reset = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/assistants/threads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reset ? { reset: true } : {}),
        });
        if (!response.ok) {
          throw new Error(
            `Failed to initialise assistant (${response.status})`,
          );
        }
        const data = (await response.json()) as ThreadResponse;
        hydrateThread(data);
        void loadThreadSummaries();
      } catch (initialiseError) {
        console.error("[AssistantChat] failed to initialise thread", {
          initialiseError,
        });
        setError(
          "We couldn't load your assistant conversation. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [hydrateThread, loadThreadSummaries],
  );

  const fetchThreadById = useCallback(
    async (threadId: string) => {
      if (isStreaming) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/assistants/threads/${threadId}`);
        if (!response.ok) {
          throw new Error(`Failed to load thread (${response.status})`);
        }
        const data = (await response.json()) as ThreadResponse;
        hydrateThread(data);
      } catch (loadError) {
        console.error("[AssistantChat] failed to load thread", { loadError });
        setError("Unable to load that conversation. Please try again.");
      } finally {
        setIsLoading(false);
        setIsThreadMenuOpen(false);
      }
    },
    [hydrateThread, isStreaming],
  );

  useEffect(() => {
    void fetchLatestThread(false);
  }, [fetchLatestThread]);

  useEffect(() => {
    void loadThreadSummaries();
  }, [loadThreadSummaries]);

  const syncLatestMessages = useCallback(async (threadId: string) => {
    try {
      const response = await fetch(
        `/api/assistants/threads/${threadId}/messages?limit=${MESSAGE_SYNC_LIMIT}`,
      );
      if (!response.ok) {
        throw new Error(`Failed to sync messages (${response.status})`);
      }
      const data = (await response.json()) as MessagesResponse;
      setMessages((prev) => {
        const persisted = prev.filter((message) => !message.optimistic);
        return mergeMessages(persisted, data.messages);
      });
      setNextCursor((prev) => pickOlderCursor(prev, data.nextCursor ?? null));
    } catch (syncError) {
      console.error("[AssistantChat] failed to sync latest messages", {
        syncError,
      });
    }
  }, []);

  const loadOlderMessages = useCallback(async () => {
    if (!activeThread || !nextCursor || isLoadingOlder) return;
    setIsLoadingOlder(true);
    shouldAutoScrollRef.current = false;
    try {
      const response = await fetch(
        `/api/assistants/threads/${activeThread.id}/messages?cursor=${encodeURIComponent(
          nextCursor,
        )}&limit=${MESSAGE_PAGE_LIMIT}`,
      );
      if (!response.ok) {
        throw new Error(`Failed to load older messages (${response.status})`);
      }
      const data = (await response.json()) as MessagesResponse;
      setMessages((prev) => mergeMessages(prev, data.messages));
      setNextCursor(data.nextCursor ?? null);
    } catch (olderError) {
      console.error("[AssistantChat] load older messages failed", {
        olderError,
      });
    } finally {
      setIsLoadingOlder(false);
    }
  }, [activeThread, nextCursor, isLoadingOlder]);

  const attachStreamListeners = useCallback(
    (
      stream: AssistantStream,
      options?: {
        assistantMessageId?: string | null;
        initialContent?: string;
      },
    ) => {
      const threadId = activeThread?.id;
      if (!threadId) return;

      let assistantMessageId = options?.assistantMessageId ?? null;
      let initialised = Boolean(assistantMessageId);

      const ensureAssistantMessage = () => {
        if (assistantMessageId) {
          return assistantMessageId;
        }
        const id = `assistant-${Date.now()}`;
        const nowIso = new Date().toISOString();
        assistantMessageId = id;
        currentAssistantMessageIdRef.current = id;
        shouldAutoScrollRef.current = true;
        setMessages((prev) => [
          ...prev,
          {
            id,
            threadId,
            role: "assistant",
            content: options?.initialContent ?? "",
            raw: null,
            status: "pending",
            createdAt: nowIso,
            updatedAt: nowIso,
            optimistic: true,
          },
        ]);
        initialised = true;
        return id;
      };

      if (assistantMessageId && options?.initialContent) {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantMessageId
              ? {
                  ...message,
                  content: options.initialContent ?? message.content,
                }
              : message,
          ),
        );
      }

      const updateAssistantContent = (delta: string) => {
        const id = ensureAssistantMessage();
        shouldAutoScrollRef.current = true;
        setMessages((prev) =>
          prev.map((message) =>
            message.id === id
              ? {
                  ...message,
                  content: `${message.content}${delta}`,
                  updatedAt: new Date().toISOString(),
                }
              : message,
          ),
        );
      };

      const finaliseAssistantMessage = (
        status: AssistantMessageRecord["status"],
      ) => {
        const id = assistantMessageId;
        if (!id) return;
        setMessages((prev) =>
          prev.map((message) =>
            message.id === id
              ? {
                  ...message,
                  status,
                  optimistic: true,
                  updatedAt: new Date().toISOString(),
                }
              : message,
          ),
        );
        currentAssistantMessageIdRef.current = null;
        if (status !== "requires_action") {
          setIsStreaming(false);
          void syncLatestMessages(threadId);
          void loadThreadSummaries();
        }
      };

      const handleRequiresAction = async (
        event: RequiresActionEvent,
      ): Promise<void> => {
        const submitAction = event.data.required_action;
        if (!submitAction || submitAction.type !== "submit_tool_outputs") {
          finaliseAssistantMessage("error");
          return;
        }

        const assistantId = ensureAssistantMessage();
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? { ...message, status: "requires_action" }
              : message,
          ),
        );

        const toolCalls = (submitAction.submit_tool_outputs.tool_calls ??
          []) as RequiredActionFunctionToolCall[];

        try {
          const toolOutputs = await Promise.all(
            toolCalls.map(async (toolCall) => ({
              tool_call_id: toolCall.id,
              output: await functionCallHandler(toolCall),
            })),
          );

          const response = await fetch(
            `/api/assistants/threads/${threadId}/actions`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                runId: event.data.id,
                toolCallOutputs: toolOutputs,
              }),
            },
          );

          if (!response.ok || !response.body) {
            throw new Error(
              `Failed to submit tool outputs (${response.status})`,
            );
          }

          const continuationStream = AssistantStream.fromReadableStream(
            response.body,
          );

          attachStreamListeners(continuationStream, {
            assistantMessageId,
          });
        } catch (requiresActionError) {
          console.error("[AssistantChat] tool outputs failed", {
            requiresActionError,
          });
          finaliseAssistantMessage("error");
        }
      };

      stream.on("textCreated", () => {
        if (!initialised) {
          ensureAssistantMessage();
        }
      });

      stream.on("textDelta", (delta) => {
        if (typeof delta.value === "string" && delta.value.length > 0) {
          updateAssistantContent(delta.value);
        }
      });

      stream.on("imageFileDone", (image) => {
        updateAssistantContent(
          `\n![${image.file_id}](/api/files/${image.file_id})\n`,
        );
      });

      stream.on("event", (event) => {
        if (event.event === "thread.run.requires_action") {
          void handleRequiresAction(event as RequiresActionEvent);
        }
        if (event.event === "thread.run.completed") {
          finaliseAssistantMessage("complete");
          setActiveThread((prev) =>
            prev && prev.id === threadId
              ? { ...prev, updatedAt: new Date().toISOString() }
              : prev,
          );
        }
        if (
          event.event === "thread.run.failed" ||
          event.event === "thread.run.cancelled" ||
          event.event === "thread.run.expired"
        ) {
          finaliseAssistantMessage("error");
        }
      });

      stream.on("error", (streamError) => {
        console.error("[AssistantChat] stream error", { streamError });
        finaliseAssistantMessage("error");
      });
    },
    [
      activeThread?.id,
      functionCallHandler,
      loadThreadSummaries,
      syncLatestMessages,
    ],
  );

  const sendMessage = useCallback(
    async (
      text: string,
      options?: {
        retryMessageId?: string;
      },
    ) => {
      const threadId = activeThread?.id;
      if (!threadId) return;

      const trimmed = text.trim();
      if (!trimmed) return;

      const nowIso = new Date().toISOString();
      const messageId = options?.retryMessageId ?? `temp-${Date.now()}`;

      if (options?.retryMessageId) {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === messageId
              ? {
                  ...message,
                  content: trimmed,
                  status: "pending",
                  updatedAt: nowIso,
                  optimistic: true,
                }
              : message,
          ),
        );
      } else {
        shouldAutoScrollRef.current = true;
        setMessages((prev) => [
          ...prev,
          {
            id: messageId,
            threadId,
            role: "user",
            content: trimmed,
            raw: null,
            status: "pending",
            createdAt: nowIso,
            updatedAt: nowIso,
            optimistic: true,
          },
        ]);
      }

      setIsStreaming(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/assistants/threads/${threadId}/messages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: trimmed }),
          },
        );

        if (!response.ok || !response.body) {
          throw new Error(`Assistant stream failed (${response.status})`);
        }

        setMessages((prev) =>
          prev.map((message) =>
            message.id === messageId
              ? {
                  ...message,
                  status: "complete",
                  optimistic: true,
                  updatedAt: new Date().toISOString(),
                }
              : message,
          ),
        );

        const stream = AssistantStream.fromReadableStream(response.body);
        attachStreamListeners(stream);
        setActiveThread((prev) =>
          prev && prev.id === threadId
            ? { ...prev, updatedAt: new Date().toISOString() }
            : prev,
        );
      } catch (sendError) {
        console.error("[AssistantChat] send error", { sendError });
        setMessages((prev) =>
          prev.map((message) =>
            message.id === messageId
              ? {
                  ...message,
                  status: "error",
                  updatedAt: new Date().toISOString(),
                }
              : message,
          ),
        );
        setIsStreaming(false);
        setError(
          "We couldn't send that message. Please check your connection and try again.",
        );
      } finally {
        setUserInput("");
      }
    },
    [activeThread?.id, attachStreamListeners],
  );
  const handleRetryMessageMemo = useCallback(
    (message: ChatMessage) => {
      void sendMessage(message.content, { retryMessageId: message.id });
    },
    [sendMessage],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = userInput.trim();
      if (!trimmed || !activeThread || isStreaming) return;
      await sendMessage(trimmed);
    },
    [userInput, activeThread, isStreaming, sendMessage],
  );

  const handleStartNewThread = useCallback(() => {
    if (isStreaming) return;
    void fetchLatestThread(true);
  }, [fetchLatestThread, isStreaming]);

  const handleSelectThread = useCallback(
    (threadId: string) => {
      if (activeThread?.id === threadId || isStreaming) return;
      void fetchThreadById(threadId);
    },
    [activeThread?.id, fetchThreadById, isStreaming],
  );

  const activeThreadTitle = useMemo(() => {
    if (!activeThread) return "Theo, your AI mentor";
    if (activeThread.title && activeThread.title.trim().length > 0) {
      return activeThread.title;
    }
    const date = new Date(activeThread.createdAt);
    return Number.isNaN(date.getTime())
      ? "Assistant conversation"
      : `Conversation started ${dateFormatter.format(date)}`;
  }, [activeThread]);

  const inputPlaceholder = useMemo(() => {
    if (!activeThread) return "Preparing assistant…";
    if (isStreaming) return "Assistant thinking…";
    return "Ask Theo anything about your driving theory prep";
  }, [activeThread, isStreaming]);

  return (
    <div className={styles.chatShell}>
      <aside className={styles.threadSidebar}>
        <div className={styles.threadSidebarHeader}>
          <h2>History</h2>
          <button
            type="button"
            className={styles.newChatButton}
            onClick={handleStartNewThread}
            disabled={isStreaming}
          >
            New chat
          </button>
        </div>
        <div className={styles.threadList}>
          {threadSummaries.length === 0 ? (
            <p className={styles.threadListEmpty}>No conversations yet</p>
          ) : (
            threadSummaries.map((summary) => {
              const isActive = summary.id === activeThread?.id;
              return (
                <button
                  key={summary.id}
                  type="button"
                  onClick={() => handleSelectThread(summary.id)}
                  className={[
                    styles.threadListItem,
                    isActive ? styles.threadListItemActive : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className={styles.threadListTitle}>
                    {formatThreadTitle(summary)}
                  </span>
                  <span className={styles.threadListMeta}>
                    {formatRelativeUpdatedAt(summary.updatedAt)}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </aside>

      <div className={styles.chatPanel}>
        <header className={styles.chatHeader}>
          <div>
            <h2>{activeThreadTitle}</h2>
            {activeThread ? (
              <p className={styles.chatHeaderMeta}>
                {formatRelativeUpdatedAt(activeThread.updatedAt)}
              </p>
            ) : null}
          </div>
          <div className={styles.chatHeaderActions}>
            <button
              type="button"
              className={styles.historyToggle}
              onClick={() => setIsThreadMenuOpen(true)}
            >
              History
            </button>
            <button
              type="button"
              className={styles.newChatButtonMobile}
              onClick={handleStartNewThread}
              disabled={isStreaming}
            >
              New chat
            </button>
          </div>
        </header>

        <div className={styles.messagesWrapper}>
          {error ? <div className={styles.errorBanner}>{error}</div> : null}

          {isLoading ? (
            <div className={styles.loadingState}>Loading your chat…</div>
          ) : (
            <>
              {nextCursor ? (
                <button
                  type="button"
                  className={styles.loadMoreButton}
                  onClick={() => void loadOlderMessages()}
                  disabled={isLoadingOlder}
                >
                  {isLoadingOlder ? "Loading…" : "Load earlier messages"}
                </button>
              ) : null}
              <div className={styles.messagesList}>
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    onRetry={handleRetryMessageMemo}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </>
          )}
        </div>

        <form className={styles.inputForm} onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.input}
            value={userInput}
            placeholder={inputPlaceholder}
            disabled={!activeThread || isStreaming}
            onChange={(event) => setUserInput(event.target.value)}
          />
          <button
            type="submit"
            className={styles.button}
            disabled={
              !activeThread || isStreaming || userInput.trim().length === 0
            }
          >
            Send
          </button>
        </form>
      </div>

      {isThreadMenuOpen ? (
        <div className={styles.mobileThreadsOverlay}>
          <div className={styles.mobileThreads}>
            <div className={styles.mobileThreadsHeader}>
              <h3>Conversations</h3>
              <button
                type="button"
                onClick={() => setIsThreadMenuOpen(false)}
                className={styles.closeMobileThreads}
              >
                Close
              </button>
            </div>
            <div className={styles.mobileThreadList}>
              {threadSummaries.map((summary) => {
                const isActive = summary.id === activeThread?.id;
                return (
                  <button
                    key={summary.id}
                    type="button"
                    className={[
                      styles.threadListItem,
                      isActive ? styles.threadListItemActive : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => handleSelectThread(summary.id)}
                  >
                    <span className={styles.threadListTitle}>
                      {formatThreadTitle(summary)}
                    </span>
                    <span className={styles.threadListMeta}>
                      {formatRelativeUpdatedAt(summary.updatedAt)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AssistantChat;
