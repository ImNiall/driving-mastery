"use client";

import React from "react";

type TOCItem = { id: string; label: string };

type StickyTOCProps = {
  items: TOCItem[];
};

export default function StickyTOC({ items }: StickyTOCProps) {
  const [activeId, setActiveId] = React.useState<string | null>(
    items[0]?.id ?? null,
  );

  React.useEffect(() => {
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-50% 0px -40% 0px",
        threshold: [0, 1],
      },
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav className="hidden xl:block" aria-label="On this page">
      <div className="sticky top-24 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            On this page
          </p>
          <ul className="mt-3 space-y-1">
            {items.map((item) => {
              const isActive = item.id === activeId;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`block rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
                      isActive
                        ? "bg-sky-50 font-semibold text-sky-700"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
