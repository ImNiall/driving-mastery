import { NextResponse } from "next/server";

const ALLOWED_ORIGINS = new Set([
  "https://www.drivingmastery.co.uk",
  "https://drivingmastery.co.uk",
  "https://drivingmastery.netlify.app",
  "http://localhost:3000",
  "http://localhost:3001",
]);

const MODEL = process.env.OPENAI_MODEL || "gpt-realtime";

function buildCorsHeaders(origin: string | null) {
  const headers = new Headers({
    "Access-Control-Allow-Methods": "OPTIONS, POST",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  });

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  }

  return headers;
}

function jsonResponse(
  body: unknown,
  status: number,
  origin: string | null,
): NextResponse {
  const headers = buildCorsHeaders(origin);
  return new NextResponse(JSON.stringify(body), {
    status,
    headers,
  });
}

export async function OPTIONS(request: Request) {
  const headers = buildCorsHeaders(request.headers.get("origin"));
  if (!headers.has("Access-Control-Allow-Origin")) {
    return new NextResponse("Origin not allowed", { status: 403 });
  }
  return new NextResponse(null, { status: 204, headers });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const headers = buildCorsHeaders(origin);

  if (!headers.has("Access-Control-Allow-Origin")) {
    return jsonResponse({ error: "Origin not allowed" }, 403, origin);
  }

  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId") ?? undefined;

    const apiKey = process.env.OPENAI_API_KEY;
    const workflowId = (process.env.WORKFLOW_ID || "").trim();

    if (!apiKey) {
      console.error("[ChatKit] OPENAI_API_KEY not configured");
      return jsonResponse({ error: "Missing OPENAI_API_KEY" }, 500, origin);
    }

    if (!workflowId || !/^wf_[A-Za-z0-9]+$/.test(workflowId)) {
      console.error("[ChatKit] Invalid or missing WORKFLOW_ID");
      return jsonResponse(
        { error: "Invalid server configuration (WORKFLOW_ID)" },
        500,
        origin,
      );
    }

    const body: Record<string, unknown> = {
      workflow: { id: workflowId },
      model: MODEL,
      ...(userId ? { user: userId } : {}),
    };

    const resp = await fetch("https://api.openai.com/v1/chatkit/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "OpenAI-Beta": "realtime=v1",
      },
      body: JSON.stringify(body),
    });

    const payload = await resp.json();

    if (!resp.ok || typeof payload?.client_secret !== "string") {
      console.error("[ChatKit] Session creation failed", payload);
      return jsonResponse(
        { error: "chatkit_session_invalid", details: payload },
        502,
        origin,
      );
    }

    return jsonResponse({ client_secret: payload.client_secret }, 200, origin);
  } catch (error: any) {
    console.error("[ChatKit] Session route error", error);
    return jsonResponse(
      { error: "chatkit_session_error", details: { message: error?.message } },
      500,
      origin,
    );
  }
}
