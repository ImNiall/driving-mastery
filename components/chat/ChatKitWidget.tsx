"use client";

import { useEffect, useState } from "react";
import {
  ChatKit,
  useChatKit,
  type UseChatKitOptions,
} from "@openai/chatkit-react";

export default function ChatKitWidget() {
  const [ready, setReady] = useState(false);

  const { control } = useChatKit({
    domainPublicKey: process.env.NEXT_PUBLIC_CHATKIT_DOMAIN_PUBLIC_KEY!,
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
