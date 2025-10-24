// Proxy websocket endpoint that authenticates with OpenAI ChatKit on behalf of the browser.
import { Buffer } from "node:buffer";
import WebSocket from "ws";
import "websocket-polyfill";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 0;
export const dynamic = "force-dynamic";

type SessionResponse = {
  client_secret?: string;
  session?: {
    id?: string;
    model?: string;
  };
  model?: string;
  error?: unknown;
};

async function createChatkitSession(
  request: NextRequest,
  userId?: string,
): Promise<{ clientSecret: string; model: string; sessionId?: string }> {
  const sessionUrl = new URL("/api/chatkit/session", request.url);
  if (userId) {
    sessionUrl.searchParams.set("userId", userId);
  }

  const response = await fetch(sessionUrl.toString(), { method: "POST" });
  const json = (await response.json()) as SessionResponse;

  if (!response.ok || typeof json?.client_secret !== "string") {
    throw new Error("Unable to create ChatKit session");
  }

  const model =
    json.session?.model ?? json.model ?? "gpt-4o-realtime-preview-2024-12-17";

  return {
    clientSecret: json.client_secret,
    model,
    sessionId: json.session?.id,
  };
}

function toBuffer(data: unknown): Buffer | string {
  if (typeof data === "string") return data;
  if (data instanceof ArrayBuffer) return Buffer.from(data);
  if (ArrayBuffer.isView(data)) {
    return Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  }
  if (Buffer.isBuffer(data)) return data;
  return Buffer.from([]);
}

export async function GET(request: NextRequest) {
  if (request.headers.get("upgrade")?.toLowerCase() !== "websocket") {
    return NextResponse.json(
      { error: "Expected websocket upgrade" },
      { status: 400 },
    );
  }

  const userId = request.nextUrl.searchParams.get("userId") ?? undefined;

  let clientSecret: string;
  let model: string;
  let sessionId: string | undefined;
  try {
    const session = await createChatkitSession(request, userId);
    clientSecret = session.clientSecret;
    model = session.model;
    sessionId = session.sessionId;
  } catch (error: any) {
    const message =
      error?.message ?? "Failed to create ChatKit session for websocket";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const PairConstructor = (globalThis as any).WebSocketPair;
  if (!PairConstructor) {
    return NextResponse.json(
      { error: "WebSocketPair is not available in this environment" },
      { status: 500 },
    );
  }

  const pair = new PairConstructor();
  const client = pair[0];
  const server = pair[1];

  server.accept();

  // Inform the browser about the model being used.
  try {
    server.send(JSON.stringify({ type: "proxy.session", model }));
  } catch {
    // ignore
  }

  const upstreamUrl = new URL("wss://api.openai.com/v1/realtime");
  upstreamUrl.searchParams.set("model", model);
  upstreamUrl.searchParams.set("openai-beta", "chatkit_beta=v1");
  if (sessionId) {
    upstreamUrl.searchParams.set("session_id", sessionId);
  }

  const upstream = new WebSocket(upstreamUrl.toString(), {
    headers: {
      Authorization: `Bearer ${clientSecret}`,
      "OpenAI-Beta": "chatkit_beta=v1",
    },
  });

  let upstreamOpen = false;
  const queuedMessages: Array<Buffer | string> = [];

  const flushQueue = () => {
    if (!upstreamOpen) return;
    while (queuedMessages.length > 0) {
      const payload = queuedMessages.shift();
      if (payload != null) {
        upstream.send(payload);
      }
    }
  };

  const closeBoth = (code = 1000, reason?: string) => {
    try {
      if (upstream.readyState === WebSocket.OPEN) {
        upstream.close(code, reason);
      }
    } catch {
      // ignore
    }
    try {
      server.close(code, reason);
    } catch {
      // ignore
    }
  };

  server.addEventListener("message", (event: MessageEvent) => {
    const payload = toBuffer(event.data);
    if (upstreamOpen) {
      upstream.send(payload);
    } else {
      queuedMessages.push(payload);
    }
  });

  server.addEventListener("close", (event: CloseEvent) => {
    closeBoth(event.code ?? 1000, event.reason);
  });

  server.addEventListener("error", () => {
    closeBoth(1011, "client socket error");
  });

  upstream.on("open", () => {
    upstreamOpen = true;
    flushQueue();
  });

  upstream.on("message", (data, isBinary) => {
    if (isBinary) {
      server.send(data);
    } else {
      server.send(data.toString());
    }
  });

  upstream.on("close", (code, reason) => {
    const reasonText =
      typeof reason === "string"
        ? reason
        : Buffer.isBuffer(reason)
          ? reason.toString("utf8")
          : undefined;
    closeBoth(code ?? 1000, reasonText);
  });

  upstream.on("error", () => {
    closeBoth(1011, "upstream error");
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  } as any);
}
