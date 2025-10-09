import React from "react";

export type ModuleSection = {
  id: string;
  title: string;
  content: string;
};

type Block =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 3 | 4; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "callout"; variant: "tip" | "warning" | "info"; lines: string[] }
  | { type: "quote"; lines: string[] };

type ModuleContentProps = {
  content: string;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-b-${index}`}>{part.slice(2, -2)}</strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={`${keyPrefix}-i-${index}`}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={`${keyPrefix}-c-${index}`}
          className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[0.9em] text-slate-800"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return (
      <React.Fragment key={`${keyPrefix}-t-${index}`}>{part}</React.Fragment>
    );
  });
}

function parseBlocks(content: string): Block[] {
  const normalized = content.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const blocks: Block[] = [];

  let paragraphBuffer: string[] = [];
  let listBuffer: { ordered: boolean; items: string[] } | null = null;
  let calloutBuffer: {
    variant: "tip" | "warning" | "info";
    lines: string[];
  } | null = null;
  let quoteBuffer: string[] = [];

  const flushParagraph = () => {
    if (!paragraphBuffer.length) return;
    const text = paragraphBuffer.join(" ").trim();
    if (text) blocks.push({ type: "paragraph", text });
    paragraphBuffer = [];
  };

  const flushList = () => {
    if (listBuffer && listBuffer.items.length) {
      blocks.push({ type: "list", ...listBuffer });
    }
    listBuffer = null;
  };

  const flushCallout = () => {
    if (calloutBuffer && calloutBuffer.lines.length) {
      blocks.push({ type: "callout", ...calloutBuffer });
    }
    calloutBuffer = null;
  };

  const flushQuote = () => {
    if (quoteBuffer.length) {
      blocks.push({ type: "quote", lines: [...quoteBuffer] });
    }
    quoteBuffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/g, "");
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      flushCallout();
      flushQuote();
      continue;
    }

    const headingMatch = /^(#{3,4})\s+(.*)$/.exec(trimmed);
    if (headingMatch) {
      flushParagraph();
      flushList();
      flushCallout();
      flushQuote();
      const level = headingMatch[1]!.length === 3 ? 3 : 4;
      blocks.push({
        type: "heading",
        level: level === 3 ? 3 : 4,
        text: headingMatch[2]!.trim(),
      });
      continue;
    }

    const calloutMatch = /^>\s?(.*)$/.exec(trimmed);
    if (calloutMatch) {
      const indicator = calloutMatch[1]?.at(0) ?? "";
      const isCalloutIndicator = indicator === "!" || indicator === "W";
      flushParagraph();
      flushList();
      if (!isCalloutIndicator) {
        flushCallout();
        quoteBuffer.push(calloutMatch[1] ?? "");
      } else {
        flushQuote();
        const variant = indicator === "W" ? "warning" : "tip";
        const text = (calloutMatch[1] ?? "").slice(1).trimStart();
        if (calloutBuffer && calloutBuffer.variant === variant) {
          calloutBuffer.lines.push(text);
        } else {
          flushCallout();
          calloutBuffer = { variant, lines: [text] };
        }
      }
      continue;
    }

    const infoMatch = /^>!?(.*)$/.exec(trimmed);
    if (infoMatch && trimmed.startsWith(">!")) {
      // Already handled above when indicator detected; this branch safeguards
      continue;
    }

    const unorderedMatch = /^[-*]\s+(.*)$/.exec(trimmed);
    if (unorderedMatch) {
      flushParagraph();
      flushCallout();
      flushQuote();
      const text = unorderedMatch[1]!.trim();
      if (listBuffer && !listBuffer.ordered) {
        listBuffer.items.push(text);
      } else {
        flushList();
        listBuffer = { ordered: false, items: [text] };
      }
      continue;
    }

    const orderedMatch = /^(\d+)\.\s+(.*)$/.exec(trimmed);
    if (orderedMatch) {
      flushParagraph();
      flushCallout();
      flushQuote();
      const text = orderedMatch[2]!.trim();
      if (listBuffer && listBuffer.ordered) {
        listBuffer.items.push(text);
      } else {
        flushList();
        listBuffer = { ordered: true, items: [text] };
      }
      continue;
    }

    flushList();
    flushCallout();
    flushQuote();
    paragraphBuffer.push(trimmed);
  }

  flushParagraph();
  flushList();
  flushCallout();
  flushQuote();

  return blocks;
}

function Callout({
  variant,
  lines,
}: {
  variant: "tip" | "warning" | "info";
  lines: string[];
}) {
  const styles = {
    tip: {
      container: "border-l-4 border-emerald-400 bg-emerald-50 text-emerald-900",
      label: "text-emerald-800",
      title: "Tip",
    },
    warning: {
      container: "border-l-4 border-amber-400 bg-amber-50 text-amber-900",
      label: "text-amber-800",
      title: "Warning",
    },
    info: {
      container: "border-l-4 border-sky-400 bg-sky-50 text-sky-900",
      label: "text-sky-800",
      title: "Note",
    },
  } as const;

  const style = styles[variant] ?? styles.info;

  return (
    <div
      role={variant === "warning" ? "alert" : "note"}
      className={`rounded-2xl px-5 py-4 text-sm sm:text-base ${style.container}`}
    >
      <p className={`mb-2 text-xs font-semibold uppercase ${style.label}`}>
        {style.title}
      </p>
      <div className="space-y-2">
        {lines.map((line, index) => (
          <p key={index} className="leading-relaxed">
            {renderInline(line, `callout-${index}`)}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function ModuleContent({ content }: ModuleContentProps) {
  const blocks = React.useMemo(() => parseBlocks(content), [content]);

  return (
    <div className="space-y-4 text-slate-700">
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p key={`p-${index}`} className="leading-relaxed">
              {renderInline(block.text, `p-${index}`)}
            </p>
          );
        }
        if (block.type === "heading") {
          const Tag = block.level === 3 ? "h3" : "h4";
          return (
            <Tag
              key={`h-${index}`}
              className="text-xl font-semibold text-slate-900"
            >
              {renderInline(block.text, `h-${index}`)}
            </Tag>
          );
        }
        if (block.type === "list") {
          const ListTag = block.ordered ? "ol" : "ul";
          return (
            <ListTag
              key={`list-${index}`}
              className={
                block.ordered
                  ? "list-decimal space-y-2 pl-6"
                  : "list-disc space-y-2 pl-6"
              }
            >
              {block.items.map((item, itemIndex) => (
                <li
                  key={`li-${index}-${itemIndex}`}
                  className="marker:text-slate-400"
                >
                  {renderInline(item, `li-${index}-${itemIndex}`)}
                </li>
              ))}
            </ListTag>
          );
        }
        if (block.type === "callout") {
          return (
            <Callout
              key={`callout-${index}`}
              variant={block.variant}
              lines={block.lines}
            />
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote
              key={`quote-${index}`}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm italic text-slate-700"
            >
              <div className="space-y-2">
                {block.lines.map((line, quoteIndex) => (
                  <p
                    key={`quote-${index}-${quoteIndex}`}
                    className="leading-relaxed"
                  >
                    {renderInline(line, `quote-${index}-${quoteIndex}`)}
                  </p>
                ))}
              </div>
            </blockquote>
          );
        }
        return null;
      })}
    </div>
  );
}

export function parseModuleSections(content: string): ModuleSection[] {
  const normalized = (content ?? "").replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const sections: ModuleSection[] = [];

  let currentTitle = "Overview";
  let currentContent: string[] = [];
  let seen = new Map<string, number>();
  let hasAnySection = false;

  const pushSection = () => {
    const contentBody = currentContent.join("\n").trim();
    if (!contentBody) return;
    let idBase = slugify(currentTitle || "section");
    if (!idBase) idBase = "section";
    const count = seen.get(idBase) ?? 0;
    seen.set(idBase, count + 1);
    const id = count === 0 ? idBase : `${idBase}-${count + 1}`;
    sections.push({ id, title: currentTitle, content: contentBody });
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/g, "");
    const match = /^##\s+(.*)$/.exec(line.trim());
    if (match) {
      if (currentContent.length) {
        pushSection();
      }
      currentTitle = match[1]?.trim() || "Section";
      currentContent = [];
      hasAnySection = true;
    } else {
      currentContent.push(rawLine);
    }
  }

  if (currentContent.length) {
    if (!hasAnySection) {
      currentTitle = currentTitle || "Overview";
    }
    pushSection();
  }

  if (!sections.length) {
    const fallback = normalized.trim();
    if (fallback) {
      sections.push({ id: "overview", title: "Overview", content: fallback });
    }
  }

  return sections;
}
