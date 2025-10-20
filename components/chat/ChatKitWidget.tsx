"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { env } from "@/lib/env";
import { supabase } from "@/lib/supabase/client";

type Status = "idle" | "loading" | "ready" | "error";

const CHATKIT_LOADER_URL =
  process.env.NEXT_PUBLIC_CHATKIT_LOADER_URL ??
  "https://cdn.openai.com/chatkit/v1/chatkit.js";

let chatKitLoaderPromise: Promise<void> | null = null;

function loadChatKitScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.customElements?.get("openai-chatkit")) {
    return Promise.resolve();
  }

  if (chatKitLoaderPromise) {
    return chatKitLoaderPromise;
  }

  chatKitLoaderPromise = new Promise((resolve, reject) => {
    const attach = (element: HTMLScriptElement) => {
      const handleLoad = () => {
        element.removeEventListener("load", handleLoad);
        element.removeEventListener("error", handleError);
        resolve();
      };
      const handleError = () => {
        element.removeEventListener("load", handleLoad);
        element.removeEventListener("error", handleError);
        element.remove();
        chatKitLoaderPromise = null;
        reject(
          new Error("Failed to load the chat experience. Please try again."),
        );
      };
      element.addEventListener("load", handleLoad, { once: true });
      element.addEventListener("error", handleError, { once: true });
    };

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-chatkit-loader="true"]',
    );
    if (existing) {
      attach(existing);
      return;
    }

    const script = document.createElement("script");
    script.type = "module";
    script.async = true;
    script.src = CHATKIT_LOADER_URL;
    script.dataset.chatkitLoader = "true";
    attach(script);
    document.head.appendChild(script);
  });

  return chatKitLoaderPromise;
}

export default function ChatKitWidget() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);

  const domainKey = env.NEXT_PUBLIC_CHATKIT_DOMAIN_PUBLIC_KEY;
  const hasDomainKey = Boolean(domainKey);

  const fetchClientSecret = useCallback(
    async (current: string | null = null) => {
      if (current) {
        return current;
      }

      try {
        setStatus((prev) => (prev === "ready" ? prev : "loading"));
        setError(null);

        const {
          data: { session },
        } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
        const response = await fetch(`/api/chatkit/session${query}`, {
          method: "POST",
        });

        const payload = (await response.json().catch(() => ({}))) as Record<
          string,
          unknown
        >;

        if (!response.ok) {
          const message =
            (typeof payload.error === "string" && payload.error.length > 0
              ? payload.error
              : null) ?? `ChatKit session failed (${response.status})`;
          throw new Error(message);
        }

        const clientSecret = payload.client_secret;
        if (typeof clientSecret !== "string" || clientSecret.length === 0) {
          throw new Error("ChatKit session response malformed");
        }

        setStatus("ready");
        return clientSecret;
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
    if (!hasDomainKey) {
      setScriptReady(false);
      setScriptError(null);
      return;
    }

    let active = true;
    loadChatKitScript()
      .then(() => {
        if (!active) return;
        setScriptReady(true);
        setScriptError(null);
      })
      .catch((err) => {
        if (!active) return;
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load the chat experience.";
        setScriptReady(false);
        setScriptError(message);
      });

    return () => {
      active = false;
    };
  }, [hasDomainKey]);

  useEffect(() => {
    if (!scriptReady || !hasDomainKey) {
      return;
    }

    fetchClientSecret().catch(() => {
      // error state handled inside fetchClientSecret
    });
  }, [scriptReady, hasDomainKey, fetchClientSecret]);

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

  const handleRetry = useCallback(() => {
    if (!hasDomainKey) {
      return;
    }

    (async () => {
      setError(null);
      setStatus("idle");

      try {
        await loadChatKitScript();
        setScriptReady(true);
        setScriptError(null);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load the chat experience.";
        setScriptReady(false);
        setScriptError(message);
        return;
      }

      fetchClientSecret().catch(() => {
        // session errors are handled inside fetchClientSecret
      });
    })();
  }, [hasDomainKey, fetchClientSecret]);

  const showConnecting = status === "idle" || status === "loading";

  const renderErrorPanel = (
    title: string,
    message: string,
    actionLabel = "Retry connection",
  ) => (
    <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
      <p className="font-semibold">{title}</p>
      <p>{message}</p>
      <button
        type="button"
        onClick={handleRetry}
        className="rounded-full bg-red-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-red-700"
      >
        {actionLabel}
      </button>
    </div>
  );

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

  if (scriptError) {
    return renderErrorPanel("Unable to load chat", scriptError, "Try again");
  }

  if (status === "error") {
    return renderErrorPanel(
      "Connection failed",
      error ?? "We couldn't connect to your mentor. Please try again.",
      "Retry connection",
    );
  }

  if (!scriptReady) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-gray-200 bg-white text-sm text-gray-600">
        Loading chat experience…
      </div>
    );
  }

  if (showConnecting) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-gray-200 bg-white text-sm text-gray-600">
        Connecting to your AI mentor…
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
