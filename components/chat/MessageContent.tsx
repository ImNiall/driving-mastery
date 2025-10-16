"use client";

import { createElement, type ReactNode } from "react";
import TypingIndicator from "./TypingIndicator";

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  const nodes: ReactNode[] = [];
  parts.forEach((part, index) => {
    if (!part) return;
    const key = `inline-${index}`;
    if (part.startsWith("`") && part.endsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.85rem] text-gray-700"
        >
          {part.slice(1, -1)}
        </code>,
      );
      return;
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-gray-900">
          {part.slice(2, -2)}
        </strong>,
      );
      return;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      nodes.push(
        <em key={key} className="text-gray-800">
          {part.slice(1, -1)}
        </em>,
      );
      return;
    }
    nodes.push(<span key={key}>{part}</span>);
  });
  return nodes;
}

function renderTextBlocks(text: string): ReactNode[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let listItems: ReactNode[] = [];
  let inList = false;
  let key = 0;

  const flushList = () => {
    if (!inList) return;
    blocks.push(
      <ul
        key={`list-${key++}`}
        className="list-disc space-y-1 pl-6 text-gray-700"
      >
        {listItems}
      </ul>,
    );
    listItems = [];
    inList = false;
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (!line.trim()) {
      flushList();
      continue;
    }
    const headingMatch = /^(#{1,3})\s+(.*)$/.exec(line);
    if (headingMatch) {
      flushList();
      const [, hashesRaw, titleRaw] = headingMatch;
      const level = Math.min((hashesRaw ?? "#").length, 3);
      const tag: "h3" | "h4" | "h5" =
        level === 1 ? "h3" : level === 2 ? "h4" : "h5";
      const headingText = titleRaw?.trim() ?? "";
      blocks.push(
        createElement(
          tag,
          { key: `heading-${key++}`, className: "font-semibold text-gray-900" },
          renderInline(headingText),
        ),
      );
      continue;
    }
    const listMatch = /^[-*]\s+(.*)$/.exec(line);
    if (listMatch) {
      inList = true;
      listItems.push(
        <li key={`item-${key++}`}>
          {renderInline((listMatch[1] ?? "").trim())}
        </li>,
      );
      continue;
    }
    flushList();
    blocks.push(
      <p key={`p-${key++}`} className="text-gray-700">
        {renderInline(line)}
      </p>,
    );
  }

  flushList();
  return blocks.length ? blocks : [<p key="empty">&nbsp;</p>];
}

function parseSegments(content: string) {
  const segments: Array<
    | { type: "text"; value: string }
    | { type: "code"; value: string; language?: string }
  > = [];

  const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeRegex.exec(content)) !== null) {
    const [full, language, body] = match;
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        value: content.slice(lastIndex, match.index),
      });
    }
    segments.push({
      type: "code",
      value: (body ?? "").replace(/\n$/g, ""),
      language: language ?? undefined,
    });
    lastIndex = match.index + full.length;
  }

  if (lastIndex < content.length) {
    segments.push({ type: "text", value: content.slice(lastIndex) });
  }

  return segments;
}

type MessageContentProps = {
  content: string;
  isTyping?: boolean;
};

export default function MessageContent({
  content,
  isTyping,
}: MessageContentProps) {
  if (isTyping) {
    return (
      <div className="inline-flex rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3">
        <TypingIndicator />
      </div>
    );
  }

  const trimmed = content.trim();
  if (!trimmed) {
    return null;
  }

  const segments = parseSegments(trimmed);

  return (
    <div className="space-y-4 text-sm leading-relaxed text-gray-900">
      {segments.map((segment, index) => {
        if (segment.type === "code") {
          return (
            <div
              key={`code-${index}`}
              className="overflow-hidden rounded-xl border border-gray-200 bg-gray-900"
            >
              <div className="flex items-center justify-between border-b border-gray-800 bg-gray-800/80 px-4 py-2 text-xs uppercase tracking-wide text-gray-300">
                <span>{segment.language ?? "code"}</span>
              </div>
              <pre className="overflow-x-auto p-4 text-[0.85rem] leading-relaxed text-gray-100">
                <code>{segment.value}</code>
              </pre>
            </div>
          );
        }
        return (
          <div key={`text-${index}`} className="space-y-3">
            {renderTextBlocks(segment.value)}
          </div>
        );
      })}
    </div>
  );
}
