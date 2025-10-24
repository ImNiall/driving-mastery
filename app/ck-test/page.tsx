"use client";

import { ChatKit, useChatKit } from "@openai/chatkit-react";

export default function ChatKitTestPage() {
  const { control } = useChatKit({
    api: {
      async getClientSecret(current) {
        console.debug("[CK TEST] getClientSecret", {
          hasCurrent: Boolean(current),
        });

        const url = current
          ? "/api/chatkit/session/refresh"
          : "/api/chatkit/session?userId=ck-test";
        const res = await fetch(url, { method: "POST" });
        const payload = await res.json();
        console.debug("[CK TEST] received", {
          status: res.status,
          hasSecret: Boolean(payload?.client_secret),
        });
        if (!res.ok || !payload?.client_secret) {
          throw new Error("No client_secret");
        }
        return payload.client_secret;
      },
    },
  });

  return (
    <div className="p-6">
      <div className="mb-2 text-sm text-slate-500">CK minimal repro</div>
      <ChatKit
        control={control}
        className="h-[600px] w-full rounded border border-slate-200"
      />
    </div>
  );
}
