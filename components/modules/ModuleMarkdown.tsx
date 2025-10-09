import React from "react";
import ModuleSectionHeading from "./ModuleSectionHeading";

type Props = { content: string };

function escapeHtml(s: string) {
  return s
    .replaceAll(/&/g, "&amp;")
    .replaceAll(/</g, "&lt;")
    .replaceAll(/>/g, "&gt;");
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let index = 0;
  const pushText = (value: string) => {
    if (!value) return;
    parts.push(<React.Fragment key={`t-${index++}`}>{value}</React.Fragment>);
  };

  let working = text;
  working = working.replace(/\*\*(.+?)\*\*/g, (_, p1) => `§§BOLD:${p1}§§`);
  working = working.replace(/\*(.+?)\*/g, (_, p1) => `§§ITALIC:${p1}§§`);

  for (const token of working.split("§§")) {
    if (!token) continue;
    if (token.startsWith("BOLD:")) {
      parts.push(
        <strong key={`b-${index++}`} className="font-semibold text-gray-800">
          {token.slice(5)}
        </strong>,
      );
      continue;
    }
    if (token.startsWith("ITALIC:")) {
      parts.push(
        <em key={`i-${index++}`} className="italic">
          {token.slice(7)}
        </em>,
      );
      continue;
    }
    pushText(token);
  }

  return parts;
}

type ListBuffer = { type: "ul" | "ol"; items: string[] };
type QuoteBuffer = { variant: "info" | "warning" | "note"; lines: string[] };

export default function ModuleMarkdown({ content }: Props) {
  const safe = escapeHtml(content);
  const lines = safe.split(/\r?\n/);

  const blocks: React.ReactNode[] = [];
  let index = 0;
  let listBuffer: ListBuffer | null = null;
  let quoteBuffer: QuoteBuffer | null = null;

  const flushList = () => {
    if (!listBuffer) return;
    if (listBuffer.type === "ul") {
      blocks.push(
        <ul
          key={`ul-${index++}`}
          className="list-disc pl-6 space-y-2 text-gray-600"
        >
          {listBuffer.items.map((item, liIndex) => (
            <li key={`uli-${liIndex}`}>{renderInline(item)}</li>
          ))}
        </ul>,
      );
    } else {
      blocks.push(
        <ol
          key={`ol-${index++}`}
          className="list-decimal pl-6 space-y-2 text-gray-600"
        >
          {listBuffer.items.map((item, liIndex) => (
            <li key={`oli-${liIndex}`}>{renderInline(item)}</li>
          ))}
        </ol>,
      );
    }
    listBuffer = null;
  };

  const flushQuote = () => {
    if (!quoteBuffer) return;
    const styles: Record<QuoteBuffer["variant"], string> = {
      info: "bg-blue-50 border-blue-200 text-blue-900",
      warning: "bg-amber-50 border-amber-200 text-amber-900",
      note: "bg-indigo-50 border-indigo-200 text-indigo-900",
    };
    blocks.push(
      <div
        key={`quote-${index++}`}
        className={`rounded-xl border-l-4 px-4 py-3 space-y-2 ${styles[quoteBuffer.variant]}`}
      >
        {quoteBuffer.lines.map((line, lineIndex) => (
          <p
            key={`q-${lineIndex}`}
            className="text-sm leading-relaxed sm:text-base"
          >
            {renderInline(line)}
          </p>
        ))}
      </div>,
    );
    quoteBuffer = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      flushQuote();
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushList();
      flushQuote();
      const text = trimmed.slice(4).trim();
      blocks.push(
        <ModuleSectionHeading key={`h3-${index++}`}>
          {renderInline(text)}
        </ModuleSectionHeading>,
      );
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      if (!listBuffer || listBuffer.type !== "ol") {
        flushList();
        listBuffer = { type: "ol", items: [] };
      }
      listBuffer.items.push(trimmed.replace(/^\d+\.\s+/, ""));
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      if (!listBuffer || listBuffer.type !== "ul") {
        flushList();
        listBuffer = { type: "ul", items: [] };
      }
      listBuffer.items.push(trimmed.slice(2));
      continue;
    }

    if (trimmed.startsWith(">")) {
      flushList();
      const indicator = trimmed[1];
      let variant: QuoteBuffer["variant"] = "info";
      let text = trimmed.slice(1).trim();
      if (indicator === "!" || indicator === "W") {
        variant = indicator === "!" ? "warning" : "note";
        text = trimmed.slice(2).trim();
      }
      if (!quoteBuffer || quoteBuffer.variant !== variant) {
        flushQuote();
        quoteBuffer = { variant, lines: [] };
      }
      quoteBuffer.lines.push(text);
      continue;
    }

    flushList();
    flushQuote();
    blocks.push(
      <p key={`p-${index++}`} className="leading-relaxed text-gray-600">
        {renderInline(trimmed)}
      </p>,
    );
  }

  flushList();
  flushQuote();

  return <div className="space-y-4">{blocks}</div>;
}
