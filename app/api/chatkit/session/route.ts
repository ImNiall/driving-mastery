import { NextRequest, NextResponse } from "next/server";
import { serverEnv } from "@/lib/env.server";

const SESSION_COOKIE_NAME = "chatkit_session_id";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

const isDebugEnabled = process.env.NODE_ENV !== "production";
const debug = (...args: unknown[]) => {
  if (isDebugEnabled) {
    // eslint-disable-next-line no-console
    console.info(...args);
  }
};

function buildCookieHeader(value: string | null) {
  if (!value) return undefined;
  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(value)}`,
    "Path=/",
    `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (process.env.NODE_ENV === "production") {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export async function POST(request: NextRequest) {
  try {
    const openAiKey = serverEnv.OPENAI_API_KEY;
    if (!openAiKey) {
      console.error("[ChatKit] OPENAI_API_KEY not configured");
      return NextResponse.json(
        { error: "OPENAI_API_KEY not configured" },
        { status: 500 },
      );
    }

    const url = new URL(request.url);
    const urlWorkflowId = url.searchParams.get("workflow") ?? undefined;
    const workflowId = (urlWorkflowId ?? serverEnv.WORKFLOW_ID ?? "").trim();

    const userId =
      url.searchParams.get("userId") ??
      request.headers.get("x-user-id") ??
      undefined;

    const cookieStore = request.cookies;
    const existingSessionId =
      cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;

    debug("[ChatKit] Creating session with workflow:", workflowId);

    const body: Record<string, unknown> = { user: userId };
    if (workflowId) {
      body.workflow = { id: workflowId };
    }

    const response = await fetch("https://api.openai.com/v1/chatkit/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiKey}`,
        "OpenAI-Beta": "chatkit_beta=v1",
      },
      body: JSON.stringify(body),
    });

    const payload = await response.json();

    if (!response.ok) {
      console.error("[ChatKit] Session creation failed", {
        status: response.status,
        error: payload?.error ?? payload,
      });
      return NextResponse.json(
        {
          error: "chatkit_session_error",
          details: payload?.error ?? payload,
        },
        { status: response.status },
      );
    }

    debug("[ChatKit] Session created successfully");

    const sessionCookie = buildCookieHeader(
      existingSessionId ?? crypto.randomUUID(),
    );

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (sessionCookie) headers["Set-Cookie"] = sessionCookie;

    if (typeof payload?.client_secret !== "string") {
      console.error("[ChatKit] Session payload missing client_secret", payload);
      return NextResponse.json(
        {
          error: "chatkit_session_invalid",
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { client_secret: payload.client_secret },
      { status: 200, headers },
    );
  } catch (error) {
    console.error("[ChatKit] Session route error", error);
    return NextResponse.json(
      { error: "chatkit_session_unexpected", details: String(error) },
      { status: 500 },
    );
  }
}
