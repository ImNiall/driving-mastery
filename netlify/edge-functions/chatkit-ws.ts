// netlify/edge-functions/chatkit-ws.ts
// Deno/Edge-friendly WebSocket proxy for OpenAI Realtime

const CHATKIT_UPSTREAM = "wss://api.openai.com/v1/realtime";
// If GA in your stack no longer needs the beta header, set to "" (empty) to omit.
const BETA_HEADER = "realtime=v1";

declare global {
  interface WebSocket {
    accept?: () => void;
  }
  interface Response {
    readonly webSocket?: WebSocket;
  }
  // deno-lint-ignore no-explicit-any
  var WebSocketPair: any;
}

function closeQuietly(
  socket: WebSocket | undefined,
  code = 1000,
  reason?: string,
) {
  if (!socket) return;
  try {
    socket.close(code, reason);
  } catch {}
}

async function createSession(request: Request): Promise<{
  clientSecret: string;
  model?: string;
  sessionId?: string;
}> {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId") ?? undefined;

  const sessionUrl = new URL("/api/chatkit/session", request.url);
  if (userId) sessionUrl.searchParams.set("userId", userId);

  const sessionHeaders = new Headers();
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) sessionHeaders.set("cookie", cookieHeader);

  const resp = await fetch(sessionUrl.toString(), {
    method: "POST",
    headers: sessionHeaders,
  });

  let payload: any = null;
  try {
    payload = await resp.json();
  } catch {}

  if (!resp.ok || typeof payload?.client_secret !== "string") {
    throw new Error("Unable to create ChatKit session");
  }

  const clientSecret = payload.client_secret as string;
  const model =
    (payload?.session && payload.session.model) || payload?.model || undefined;

  const sessionId = (payload?.session && payload.session.id) || undefined;

  return { clientSecret, model, sessionId };
}

export default async function handler(request: Request): Promise<Response> {
  const upgrade = request.headers.get("upgrade")?.toLowerCase();
  if (upgrade !== "websocket") {
    return new Response("Expected websocket upgrade", { status: 400 });
  }

  // 1) Mint/lookup ephemeral realtime session
  let session: { clientSecret: string; model?: string; sessionId?: string };
  try {
    session = await createSession(request);
  } catch (error: unknown) {
    const message =
      (error as { message?: string })?.message ??
      "Failed to create ChatKit session";
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }

  // 2) Upgrade incoming browser socket
  const pair = new (globalThis as any).WebSocketPair();
  const clientSocket: WebSocket = pair[0];
  const serverSocket: WebSocket = pair[1];
  serverSocket.accept?.();

  // Optional: let the client know which model the session claims
  try {
    serverSocket.send(
      JSON.stringify({
        type: "proxy.session",
        model: session.model ?? null,
      }),
    );
  } catch {}

  // 3) Build upstream URL (NO model or beta query params)
  const upstreamUrl = new URL(CHATKIT_UPSTREAM);
  if (session.sessionId) {
    upstreamUrl.searchParams.set("session_id", session.sessionId);
  }

  // 4) Dial upstream with fetch+upgrade (Edge/Deno pattern)
  let upstreamResponse: Response;
  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${session.clientSecret}`,
      "Sec-WebSocket-Protocol": "realtime",
    };
    if (BETA_HEADER) headers["OpenAI-Beta"] = BETA_HEADER;

    upstreamResponse = await fetch(upstreamUrl.toString(), {
      method: "GET",
      headers,
      // @ts-ignore Edge runtime extension
      upgrade: "websocket",
    });
  } catch (err) {
    console.error("[realtime] upstream fetch threw", err);
    closeQuietly(serverSocket, 1011, "upstream fetch error");
    return new Response("Failed to connect upstream", { status: 502 });
  }

  // 5) If OpenAI didn't return 101, log and fail fast
  if (upstreamResponse.status !== 101) {
    const rid = upstreamResponse.headers.get("openai-request-id") || "n/a";
    console.error("[realtime] upstream upgrade failed", {
      status: upstreamResponse.status,
      requestId: rid,
      model: session.model ?? null,
    });
    closeQuietly(serverSocket, 1011, `upstream ${upstreamResponse.status}`);
    return new Response("Failed to connect upstream", { status: 502 });
  }

  // @ts-ignore Edge runtime extension
  const upstreamSocket: WebSocket | undefined = upstreamResponse.webSocket;
  if (!upstreamSocket) {
    closeQuietly(serverSocket, 1011, "no upstream socket");
    return new Response("Failed to connect upstream", { status: 502 });
  }
  upstreamSocket.accept?.();

  // 6) Bi-directional piping
  let upstreamOpen = false;
  const queue: Array<string | ArrayBufferLike | Blob> = [];

  const flush = () => {
    if (!upstreamOpen) return;
    while (queue.length > 0) {
      const data = queue.shift();
      if (data === undefined) continue;
      try {
        upstreamSocket.send(data as any);
      } catch {}
    }
  };

  serverSocket.addEventListener("message", (evt) => {
    const data = (evt as MessageEvent).data;
    if (upstreamOpen) {
      try {
        upstreamSocket.send(data);
      } catch {}
    } else {
      queue.push(data as any);
    }
  });

  serverSocket.addEventListener("close", (evt) => {
    const e = evt as CloseEvent;
    closeQuietly(upstreamSocket, e.code ?? 1000, e.reason);
  });

  serverSocket.addEventListener("error", () => {
    closeQuietly(upstreamSocket, 1011, "browser socket error");
  });

  upstreamSocket.addEventListener("open", () => {
    upstreamOpen = true;
    flush();
  });

  upstreamSocket.addEventListener("message", (evt) => {
    try {
      const data = (evt as MessageEvent).data;
      serverSocket.send(data);
    } catch {
      closeQuietly(upstreamSocket, 1011, "browser send failed");
    }
  });

  upstreamSocket.addEventListener("close", (evt) => {
    const e = evt as CloseEvent;
    closeQuietly(serverSocket, e.code ?? 1000, e.reason);
  });

  upstreamSocket.addEventListener("error", () => {
    closeQuietly(serverSocket, 1011, "upstream error");
  });

  // 7) Return the upgraded connection to the browser
  return new Response(null, { status: 101, webSocket: clientSocket } as any);
}
