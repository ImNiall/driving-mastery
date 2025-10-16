"use client";

import { memo } from "react";

const dotClass = "h-2 w-2 rounded-full bg-gray-400 motion-safe:animate-bounce";

const TypingIndicator = memo(function TypingIndicator() {
  return (
    <div className="flex items-center gap-1" aria-label="Assistant is typing">
      <span className={`${dotClass}`} style={{ animationDelay: "0ms" }} />
      <span className={`${dotClass}`} style={{ animationDelay: "150ms" }} />
      <span className={`${dotClass}`} style={{ animationDelay: "300ms" }} />
    </div>
  );
});

export default TypingIndicator;
