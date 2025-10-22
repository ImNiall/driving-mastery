"use client";

import { MessageSquare, User } from "lucide-react";
import { memo, useMemo } from "react";

import type { ChatMessage } from "@/types/chat";
import MessageContent from "./MessageContent";

type MessageBubbleProps = {
  message: ChatMessage;
  isTyping?: boolean;
};

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

const MessageBubble = memo(function MessageBubble({
  message,
  isTyping,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const timestamp = useMemo(
    () => formatTimestamp(message.createdAt),
    [message.createdAt],
  );

  return (
    <div
      className={`group flex gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      role="group"
    >
      <span
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-gray-200 text-gray-700"
            : "bg-gradient-to-br from-blue-600 to-blue-400 text-white"
        }`}
        aria-hidden
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <MessageSquare className="h-4 w-4" />
        )}
      </span>
      <div
        className={`flex min-w-0 flex-1 flex-col ${isUser ? "items-end" : "items-start"}`}
      >
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="font-medium text-gray-900">
            {isUser ? "You" : "Chat A.I+"}
          </span>
          {timestamp ? (
            <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {timestamp}
            </span>
          ) : null}
        </div>
        <div
          className={`${
            isUser
              ? "rounded-2xl rounded-tr-sm bg-blue-600 text-white"
              : "rounded-2xl rounded-tl-sm bg-gray-100 text-gray-900"
          } max-w-full whitespace-pre-wrap px-4 py-3 text-sm sm:max-w-[80%]`}
        >
          <MessageContent content={message.content} isTyping={isTyping} />
        </div>
      </div>
    </div>
  );
});

export default MessageBubble;
