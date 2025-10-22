"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { env } from "@/lib/env";
import { supabase } from "@/lib/supabase/client";

export default function ChatKitWidget() {
  const [mounted, setMounted] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const domainKey = env.NEXT_PUBLIC_CHATKIT_DOMAIN_PUBLIC_KEY ?? "";

  console.log("[ChatKit] has domain key:", Boolean(domainKey));

  const options = useMemo(
    () => ({
      api: {
        domainKey,
        async getClientSecret() {
          console.log("[ChatKit] fetching client token…");
          const {
            data: { session },
          } = await supabase.auth.getSession();

          let userId = session?.user?.id ?? null;

          if (!userId) {
            const storageKey = "chatkitAnonId";
            let anonId = null;

            try {
              anonId = window.localStorage.getItem(storageKey);
            } catch (error) {
              console.warn("[ChatKit] localStorage unavailable", error);
            }

            if (!anonId) {
              anonId = crypto.randomUUID();
              try {
                window.localStorage.setItem(storageKey, anonId);
              } catch (error) {
                console.warn("[ChatKit] unable to persist anon id", error);
              }
            }

            userId = `anon-${anonId}`;
            console.log("[ChatKit] using anonymous user id");
          }

          const query = `?userId=${encodeURIComponent(userId)}`;

          const response = await fetch(`/api/chatkit/session${query}`, {
            method: "POST",
          });
          const payload = await response.json();

          if (!response.ok || typeof payload?.client_secret !== "string") {
            throw new Error("No client_secret");
          }

          return payload.client_secret;
        },
      },
      header: {
        enabled: true,
        title: {
          enabled: true,
          text: "Theo · Driving Mastery Mentor",
        },
      },
      history: {
        enabled: true,
      },
      theme: {
        colorScheme: "light" as const,
      },
      composer: {
        placeholder: "Ask anything about your theory prep…",
      },
    }),
    [domainKey],
  );

  const { control } = useChatKit(options);

  useEffect(() => {
    console.log("[ChatKit] widget mounted");
    setMounted(true);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    const element = host?.querySelector("openai-chatkit");
    if (!element) {
      return;
    }

    const handleError = (event: Event) => {
      const detail = (event as CustomEvent)?.detail;
      console.error("[ChatKit] ui error:", detail?.error ?? event);
    };

    element.addEventListener("chatkit.error", handleError as EventListener);
    return () => {
      element.removeEventListener(
        "chatkit.error",
        handleError as EventListener,
      );
    };
  }, [control]);

  const showSkeleton = !mounted || !control;

  return (
    <div
      ref={hostRef}
      style={{ width: "100%", height: 600, position: "relative" }}
    >
      {showSkeleton && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            background: "#ffffff",
            zIndex: 1,
          }}
        >
          <div>Loading Theo…</div>
        </div>
      )}
      <ChatKit control={control} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
