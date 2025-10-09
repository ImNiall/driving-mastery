"use client";
import React from "react";

// Lightweight markdown renderer to support headings, bold, italics, lists and paragraphs
// without adding a new dependency. It is intentionally conservative to avoid XSS.
// Content is treated as plain text and transformed into React elements.

type Props = { content: unknown; className?: string };

function escapeHtml(s: string) {
  return s
    .replaceAll(/&/g, "&amp;")
    .replaceAll(/</g, "&lt;")
    .replaceAll(/>/g, "&gt;");
}

function renderInline(md: string): React.ReactNode[] {
  // Bold **text** and italics *text*
  const parts: React.ReactNode[] = [];
  let i = 0;
  const pushText = (t: string) => {
    if (!t) return;
    parts.push(<React.Fragment key={`t-${i++}`}>{t}</React.Fragment>);
  };
  let s = md;
  // Replace bold then italics
  s = s.replace(/\*\*(.+?)\*\*/g, (_, p1) => `§§BOLD:${p1}§§`);
  s = s.replace(/\*(.+?)\*/g, (_, p1) => `§§ITALIC:${p1}§§`);
  for (const token of s.split("§§")) {
    if (!token) continue;
    if (token.startsWith("BOLD:")) {
      parts.push(<strong key={`b-${i++}`}>{token.slice(5)}</strong>);
    } else if (token.startsWith("ITALIC:")) {
      parts.push(<em key={`i-${i++}`}>{token.slice(7)}</em>);
    } else {
      pushText(token);
    }
  }
  return parts;
}

export default function Markdown({ content, className }: Props) {
  const raw = typeof content === "string" ? content : String(content ?? "");
  const safe = escapeHtml(raw);
  const lines = safe.split(/\r?\n/);

  const blocks: React.ReactNode[] = [];
  let i = 0;
  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (inList) {
      blocks.push(
        <ul key={`ul-${i++}`} className="list-disc pl-6 space-y-1">
          {listItems}
        </ul>,
      );
      inList = false;
      listItems = [];
    }
  };

  for (const lineRaw of lines) {
    const line = lineRaw.trimEnd();
    if (line.trim() === "") {
      flushList();
      continue;
    }
    const mH = /^(#{1,3})\s+(.*)$/.exec(line);
    if (mH) {
      flushList();
      const level = (mH[1] || "#").length;
      const text = mH[2] || "";
      const tag = level === 1 ? "h1" : level === 2 ? "h2" : "h3";
      blocks.push(
        React.createElement(
          tag,
          { key: `h-${i++}`, className: "font-bold text-gray-800 mt-4 mb-2" },
          renderInline(text),
        ),
      );
      continue;
    }
    const mLi = /^[-*]\s+(.*)$/.exec(line);
    if (mLi) {
      const text = mLi[1] || "";
      inList = true;
      listItems.push(<li key={`li-${i++}`}>{renderInline(text)}</li>);
      continue;
    }
    // Paragraph
    flushList();
    blocks.push(
      <p key={`p-${i++}`} className="text-gray-700 leading-relaxed">
        {renderInline(line)}
      </p>,
    );
  }
  flushList();

  return <div className={className}>{blocks}</div>;
}
