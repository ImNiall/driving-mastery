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
        className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue text-white shadow-xl transition hover:bg-brand-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue sm:bottom-16 sm:right-5 md:bottom-10 md:right-6"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <ChatIcon className="h-6 w-6" />
      </button>

      <div
        className={`fixed bottom-[8.5rem] right-4 z-40 h-[68vh] w-[calc(100vw-2.5rem)] max-h-[82vh] max-w-sm transition-all duration-300 sm:bottom-28 sm:right-5 sm:h-[70vh] sm:w-[calc(100vw-3rem)] sm:max-h-[84vh] sm:max-w-md md:bottom-24 md:right-6 md:h-[72vh] md:max-h-[85vh] md:max-w-lg ${
          isOpen
            ? "pointer-events-auto opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 translate-y-4"
        }`}
      >
        <ChatWindow className="min-h-[460px] h-full max-h-full shadow-2xl sm:min-h-[520px]" />
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
