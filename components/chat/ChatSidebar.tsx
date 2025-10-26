"use client";

import { Plus, Search, Settings, X } from "lucide-react";
import { useMemo } from "react";

export type ChatSessionSummary = {
  id: string;
  title: string | null;
  created_at: string;
  archived?: boolean | null;
};

type ChatSidebarProps = {
  sessions: ChatSessionSummary[];
  selectedSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  isLoading?: boolean;
  userLabel?: string;
  onCloseMobile?: () => void;
  showMobileClose?: boolean;
};

function formatDateLabel(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function ChatSidebar({
  sessions,
  selectedSessionId,
  onSelectSession,
  onNewChat,
  isLoading = false,
  userLabel,
  onCloseMobile,
  showMobileClose = false,
}: ChatSidebarProps) {
  const recentSessions = useMemo(
    () => sessions.filter((session) => !session.archived),
    [sessions],
  );

  return (
    <aside className="flex h-full w-full flex-col rounded-[32px] bg-white/95 p-6 shadow-xl ring-1 ring-black/5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">
            Chat A.I+
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            Your conversations
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            aria-label="Search conversations"
          >
            <Search className="h-4 w-4" />
          </button>
          {showMobileClose ? (
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={onCloseMobile}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        onClick={onNewChat}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
      >
        <Plus className="h-4 w-4" />
        New chat
      </button>

      <div className="mt-8 flex-1 overflow-y-auto pr-2">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className="animate-pulse rounded-3xl bg-slate-100/80 p-4"
              >
                <div className="h-3 w-2/3 rounded-full bg-slate-200" />
                <div className="mt-2 h-2 w-1/2 rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        ) : recentSessions.length > 0 ? (
          <div className="space-y-2">
            {recentSessions.map((session) => {
              const isActive = selectedSessionId === session.id;
              return (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => {
                    onSelectSession(session.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full rounded-3xl border border-transparent bg-white px-4 py-4 text-left shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                    isActive
                      ? "border-indigo-200 bg-indigo-50/90 text-indigo-900 shadow-indigo-100"
                      : "hover:border-slate-200 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p
                      className="text-sm font-semibold leading-snug text-slate-900"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {session.title?.trim() || "Untitled conversation"}
                    </p>
                    <span className="whitespace-nowrap text-xs text-slate-400">
                      {formatDateLabel(session.created_at)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center text-sm text-slate-500">
            No chats yet. Start a new conversation to see it here.
          </div>
        )}
      </div>

      <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50/60 p-4">
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900"
        >
          <span className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </span>
        </button>
        <div className="mt-4 rounded-2xl bg-white px-3 py-3 text-sm font-medium text-slate-700 shadow-sm">
          {userLabel ?? "Anonymous"}
        </div>
      </div>
    </aside>
  );
}

export default ChatSidebar;
