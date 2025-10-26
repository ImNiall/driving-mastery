const DEFAULT_MODEL = "gpt-realtime";
const CHATKIT_UPSTREAM = "wss://api.openai.com/v1/realtime";
const BETA_HEADER = "realtime=v1";

declare global {
  interface WebSocket {
    accept(): void;
  }

  interface Response {
    readonly webSocket?: WebSocket;
  }
}

async function createSession(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId") ?? undefined;

  const sessionUrl = new URL("/api/chatkit/session", request.url);
  if (userId) {
    sessionUrl.searchParams.set("userId", userId);
  }

  const sessionHeaders = new Headers();
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    sessionHeaders.set("cookie", cookieHeader);
  }

  const response = await fetch(sessionUrl.toString(), {
    method: "POST",
    headers: sessionHeaders,
  });
  const payload = await response.json();

  if (!response.ok || typeof payload?.client_secret !== "string") {
    throw new Error("Unable to create ChatKit session");
  }

  const model =
    payload?.session?.model ?? payload?.model ?? DEFAULT_MODEL ?? DEFAULT_MODEL;

  return {
    clientSecret: payload.client_secret as string,
    model,
    sessionId: payload?.session?.id as string | undefined,
  };
}

function closeQuietly(
  socket: WebSocket | undefined,
  code = 1000,
  reason?: string,
) {
  if (!socket) return;
  try {
    socket.close(code, reason);
  } catch {
    // ignore
  }
}

export default async function handler(request: Request): Promise<Response> {
  const upgradeHeader = request.headers.get("upgrade")?.toLowerCase();
  if (upgradeHeader !== "websocket") {
    return new Response("Expected websocket upgrade", { status: 400 });
  }

  let session;
  try {
    session = await createSession(request);
  } catch (error: any) {
    const message = error?.message ?? "Failed to create ChatKit session";
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }

  const pair = new (globalThis as any).WebSocketPair();
  const clientSocket: WebSocket = pair[0];
  const serverSocket: WebSocket = pair[1];
  serverSocket.accept();

  try {
    serverSocket.send(
      JSON.stringify({ type: "proxy.session", model: session.model }),
    );
  } catch {
    // ignore initial failure
  }

  const upstreamUrl = new URL(CHATKIT_UPSTREAM);
  if (session.sessionId) {
    upstreamUrl.searchParams.set("session_id", session.sessionId);
  }

  let upstreamResponse: Response;
  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${session.clientSecret}`,
      "Sec-WebSocket-Protocol": "realtime",
    };
    if (BETA_HEADER) {
      headers["OpenAI-Beta"] = BETA_HEADER;
    }

    upstreamResponse = await fetch(upstreamUrl.toString(), {
      method: "GET",
      headers,
      // @ts-ignore Deno specific upgrade option
      upgrade: "websocket",
    });
  } catch (error) {
    console.error("[realtime] upstream fetch threw", error);
    closeQuietly(serverSocket, 1011, "upstream fetch error");
    return new Response("Failed to connect upstream", { status: 502 });
  }

  if (upstreamResponse.status !== 101) {
    const requestId =
      upstreamResponse.headers.get("openai-request-id") ?? "unknown";
    console.error("[realtime] upstream upgrade failed", {
      status: upstreamResponse.status,
      requestId,
      model: session.model,
    });
    closeQuietly(serverSocket, 1011, `upstream ${upstreamResponse.status}`);
    return new Response("Failed to connect upstream", { status: 502 });
  }

  const upstreamSocket: WebSocket | undefined =
    // @ts-ignore Edge extension
    upstreamResponse.webSocket;
  if (!upstreamSocket) {
    closeQuietly(serverSocket, 1011, "no upstream socket");
    return new Response("Failed to connect upstream", { status: 502 });
  }

  try {
    (upstreamSocket as any).accept?.();
  } catch {
    // ignore
  }

  let upstreamOpen = false;
  const queuedMessages: Array<string | ArrayBufferLike | Blob> = [];

  const flushQueue = () => {
    if (!upstreamOpen) return;
    while (queuedMessages.length > 0) {
      const data = queuedMessages.shift();
      if (data !== undefined) {
        try {
          upstreamSocket.send(data as any);
        } catch {
          // ignore
        }
      }
    }
  };

  serverSocket.addEventListener("message", (event) => {
    const data = (event as MessageEvent).data;
    if (upstreamOpen) {
      try {
        upstreamSocket.send(data);
      } catch {
        // ignore send failure
      }
    } else {
      queuedMessages.push(data as any);
    }
  });

  serverSocket.addEventListener("close", (event) => {
    const closeEvent = event as CloseEvent;
    closeQuietly(upstreamSocket, closeEvent.code ?? 1000, closeEvent.reason);
  });

  serverSocket.addEventListener("error", () => {
    closeQuietly(upstreamSocket, 1011, "browser socket error");
  });

  upstreamSocket.addEventListener("open", () => {
    upstreamOpen = true;
    flushQueue();
  });

  upstreamSocket.addEventListener("message", (event) => {
    try {
      const messageEvent = event as MessageEvent;
      serverSocket.send(messageEvent.data);
    } catch {
      closeQuietly(upstreamSocket, 1011, "browser send failed");
    }
  });

  upstreamSocket.addEventListener("close", (event) => {
    const closeEvent = event as CloseEvent;
    closeQuietly(serverSocket, closeEvent.code ?? 1000, closeEvent.reason);
  });

  upstreamSocket.addEventListener("error", () => {
    closeQuietly(serverSocket, 1011, "upstream error");
  });

  return new Response(null, {
    status: 101,
    webSocket: clientSocket,
  } as any);
}
