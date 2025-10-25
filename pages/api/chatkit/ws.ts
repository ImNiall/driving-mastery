import type { NextApiRequest, NextApiResponse } from "next";
import { Buffer } from "node:buffer";
import WebSocket, { WebSocketServer, type RawData } from "ws";

type SessionResponse = {
  client_secret?: string;
  model?: string;
  session?: {
    id?: string;
    model?: string;
  };
  error?: unknown;
};

type GlobalWithWSS = typeof globalThis & {
  __chatkit_wss__?: WebSocketServer;
};

const DEFAULT_MODEL = "gpt-4o-realtime-preview";
const CHATKIT_URL = "wss://api.openai.com/v1/realtime";
const globalAny = globalThis as GlobalWithWSS;

function getWebSocketServer(): WebSocketServer {
  if (!globalAny.__chatkit_wss__) {
    globalAny.__chatkit_wss__ = new WebSocketServer({ noServer: true });
  }
  return globalAny.__chatkit_wss__;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

function resolveProtocol(req: NextApiRequest): string {
  const forwarded = req.headers["x-forwarded-proto"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]!;
  }
  const socket = req.socket as any;
  return socket?.encrypted ? "https" : "http";
}

async function fetchChatkitSession(req: NextApiRequest, userId?: string) {
  const host = req.headers.host;
  if (!host) {
    throw new Error("Missing host header for session request");
  }
  const protocol = resolveProtocol(req);
  const sessionUrl = new URL(`${protocol}://${host}/api/chatkit/session`);
  if (userId) {
    sessionUrl.searchParams.set("userId", userId);
  }

  const response = await fetch(sessionUrl.toString(), { method: "POST" });
  const payload = (await response.json()) as SessionResponse;

  if (!response.ok || typeof payload?.client_secret !== "string") {
    throw new Error("Unable to create ChatKit session");
  }

  const model =
    payload.session?.model ?? payload.model ?? DEFAULT_MODEL ?? DEFAULT_MODEL;

  return {
    clientSecret: payload.client_secret,
    model,
    sessionId: payload.session?.id,
  };
}

function normalizeReason(reason?: string | Buffer) {
  if (!reason) return undefined;
  if (typeof reason === "string") return reason;
  if (Buffer.isBuffer(reason)) return reason.toString("utf8");
  return undefined;
}

function flushQueue(target: WebSocket, queue: RawData[]) {
  while (queue.length > 0) {
    const data = queue.shift();
    if (data !== undefined) {
      target.send(data);
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.headers.upgrade?.toLowerCase() !== "websocket") {
    res.status(400).json({ error: "Expected websocket upgrade" });
    return;
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const userParam = req.query.userId;
  const userId =
    typeof userParam === "string"
      ? userParam
      : Array.isArray(userParam)
        ? userParam[0]
        : undefined;

  let session;
  try {
    session = await fetchChatkitSession(req, userId);
  } catch (error: any) {
    res
      .status(502)
      .json({ error: error?.message ?? "Failed to create ChatKit session" });
    return;
  }

  const wss = getWebSocketServer();
  const { clientSecret, model, sessionId } = session;

  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (browserSocket) => {
    const upstreamUrl = new URL(CHATKIT_URL);
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

    const queuedMessages: RawData[] = [];
    let upstreamOpen = false;

    const closeBoth = (code = 1000, reason?: string | Buffer) => {
      const normalized = normalizeReason(reason);
      if (
        upstream.readyState === WebSocket.OPEN ||
        upstream.readyState === WebSocket.CONNECTING
      ) {
        upstream.close(code, normalized);
      }
      if (
        browserSocket.readyState === WebSocket.OPEN ||
        browserSocket.readyState === WebSocket.CONNECTING
      ) {
        browserSocket.close(code, normalized);
      }
    };

    browserSocket.on("message", (data: RawData) => {
      if (upstreamOpen) {
        upstream.send(data);
      } else {
        queuedMessages.push(data);
      }
    });

    browserSocket.once("close", (code, reason) => {
      closeBoth(code ?? 1000, reason);
    });

    browserSocket.once("error", () => {
      closeBoth(1011, "browser websocket error");
    });

    upstream.once("open", () => {
      upstreamOpen = true;
      flushQueue(upstream, queuedMessages);
    });

    upstream.on("message", (data: RawData, isBinary: boolean) => {
      if (isBinary) {
        browserSocket.send(data, { binary: true });
      } else if (typeof data === "string") {
        browserSocket.send(data);
      } else {
        browserSocket.send(data);
      }
    });

    upstream.once("close", (code, reason) => {
      closeBoth(code ?? 1000, reason);
    });

    upstream.once("error", () => {
      closeBoth(1011, "upstream error");
    });

    try {
      browserSocket.send(JSON.stringify({ type: "proxy.session", model }));
    } catch {
      // ignore initial message failures
    }
  });
}
