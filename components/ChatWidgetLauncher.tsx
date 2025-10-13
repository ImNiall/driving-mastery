"use client";

import React from "react";
import { usePathname } from "next/navigation";
import ChatWindow from "@/components/ChatWindow";
import { ChatIcon } from "@/components/icons";

export default function ChatWidgetLauncher() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (pathname === "/mentor") {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue text-white shadow-xl transition hover:bg-brand-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <ChatIcon className="h-6 w-6" />
      </button>

      <div
        className={`fixed bottom-24 right-6 z-40 w-[calc(100vw-2rem)] max-w-lg transition-all duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 translate-y-4"
        }`}
      >
        <ChatWindow className="min-h-[520px] shadow-2xl" />
      </div>

      {isOpen && (
        <button
          type="button"
          aria-hidden
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[1px]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
