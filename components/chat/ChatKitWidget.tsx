"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  ChatKit,
  useChatKit,
  type UseChatKitOptions,
} from "@openai/chatkit-react";

function ChatUnavailable({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: 16,
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        background: "#fff",
      }}
    >
      {message}
    </div>
  );
}

function ChatKitGuard({
  children,
}: {
  children: (domainKey: string) => ReactNode;
}) {
  const rawKey =
    process.env.NEXT_PUBLIC_CHATKIT_DOMAIN_PUBLIC_KEY?.trim() ?? "";

  if (!rawKey) {
    console.error("[ChatKit] Missing NEXT_PUBLIC_CHATKIT_DOMAIN_PUBLIC_KEY");
    return (
      <ChatUnavailable message="Chat is unavailable (missing domain key)." />
    );
  }

  if (!rawKey.startsWith("domain_pk_")) {
    console.error(
      "[ChatKit] Invalid domain key format:",
      `${rawKey.slice(0, 12)}…`,
    );
    return (
      <ChatUnavailable message="Chat is unavailable (invalid domain key)." />
    );
  }

  return <>{children(rawKey)}</>;
}

function ChatKitInner({ domainKey }: { domainKey: string }) {
  const [ready, setReady] = useState(false);

  const workflowEnv = process.env.NEXT_PUBLIC_WORKFLOW_ID?.trim();
  if (workflowEnv && !/^wf_/.test(workflowEnv)) {
    console.error(
      "[ChatKit] NEXT_PUBLIC_WORKFLOW_ID is set but not wf_* format",
    );
  }

  const { control } = useChatKit({
    domainPublicKey: domainKey,
    api: {
      async getClientSecret() {
        const res = await fetch("/api/chatkit/session", { method: "POST" });
        const payload = await res.json();
        if (!res.ok || !payload?.client_secret) {
          throw new Error("No client_secret");
        }
        return payload.client_secret;
      },
    },
  } as UseChatKitOptions);

  useEffect(() => setReady(true), []);

  return (
    <div style={{ width: "100%", height: 600, position: "relative" }}>
      {!ready && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            background: "#fff",
          }}
        >
          <div>Loading chat…</div>
        </div>
      )}
      <ChatKit control={control} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

export default function ChatKitWidget() {
  return (
    <ChatKitGuard>
      {(domainKey) => <ChatKitInner domainKey={domainKey} />}
    </ChatKitGuard>
  );
}
