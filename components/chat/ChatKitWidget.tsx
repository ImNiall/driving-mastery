"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { env } from "@/lib/env";
import { supabase } from "@/lib/supabase/client";

type SessionPayload = {
  client_secret: string;
  expires_after?: number | null;
};

type Status = "loading" | "ready" | "error";

export default function ChatKitWidget() {
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  const fetchClientSecret = useCallback(
    async (current: string | null = null) => {
      if (current) {
        return current;
      }
      try {
        setStatus("loading");
        setError(null);
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
        const response = await fetch(`/api/chatkit/session${query}`, {
          method: "POST",
        });
        if (!response.ok) {
          const payload = (await response.json().catch(() => ({}))) as Record<
            string,
            unknown
          >;
          const message =
            (payload?.error as string) ??
            `ChatKit session failed (${response.status})`;
          throw new Error(message);
        }
        const payload = (await response.json()) as SessionPayload;
        setStatus("ready");
        return payload.client_secret;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to initialise chat";
        setError(message);
        setStatus("error");
        throw err instanceof Error ? err : new Error(message);
      }
    },
    [],
  );

  useEffect(() => {
    fetchClientSecret().catch(() => {
      // error state handled inside fetchClientSecret
    });
  }, [fetchClientSecret]);

  const domainKey = env.NEXT_PUBLIC_CHATKIT_DOMAIN_PUBLIC_KEY;

  // Check if domain key is missing
  const hasDomainKey = Boolean(domainKey);

  const options = useMemo(
    () => ({
      api: {
        domainKey: domainKey || "",
        getClientSecret: fetchClientSecret,
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
    [domainKey, fetchClientSecret],
  );

  const { control, ref } = useChatKit(options);

  useEffect(() => {
    console.log("[ChatKitWidget] Initialization", {
      status,
      error,
      domainKeyPresent: hasDomainKey,
      hasControl: Boolean(control),
      hasRef: Boolean(ref?.current),
    });
  }, [status, error, hasDomainKey, control, ref]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-gray-200 bg-white text-sm text-gray-600">
        Connecting to your AI mentor…
      </div>
    );
  }

  if (!hasDomainKey) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center text-sm text-amber-700">
        <p className="font-semibold">ChatKit configuration missing</p>
        <p className="text-xs">
          Please ensure NEXT_PUBLIC_CHATKIT_DOMAIN_PUBLIC_KEY is set in your
          environment variables.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
        <p className="font-semibold">Connection failed</p>
        <p>{error}</p>
        <button
          type="button"
          onClick={() =>
            fetchClientSecret().catch(() => {
              // retry handled internally
            })
          }
          className="rounded-full bg-red-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          Retry connection
        </button>
      </div>
    );
  }

  if (!control || !ref) {
    return (
      <div className="flex min-h-[540px] items-center justify-center rounded-3xl border border-gray-200 bg-white text-sm text-gray-600">
        Initializing chat interface…
      </div>
    );
  }

  return (
    <div className="min-h-[540px] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <ChatKit control={control} ref={ref} className="h-[540px] w-full" />
    </div>
  );
}
