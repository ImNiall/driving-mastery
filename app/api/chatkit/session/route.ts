import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { serverEnv } from "@/lib/env.server";

const SESSION_COOKIE_NAME = "chatkit_session_id";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days
const CHATKIT_API_BASE =
  process.env.CHATKIT_API_BASE ?? "https://api.openai.com";

const client = new OpenAI({
  apiKey: serverEnv.OPENAI_API_KEY,
});

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

    const workflowId = serverEnv.WORKFLOW_ID;
    if (!workflowId) {
      console.error("[ChatKit] WORKFLOW_ID not configured");
      return NextResponse.json(
        { error: "WORKFLOW_ID not configured" },
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const userId =
      searchParams.get("userId") ??
      request.headers.get("x-user-id") ??
      undefined;

    const cookieStore = request.cookies;
    const existingSessionId =
      cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;

    console.log("[ChatKit] Creating session with workflow:", workflowId);

    const response = await fetch(`${CHATKIT_API_BASE}/v1/chatkit/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiKey}`,
        "OpenAI-Beta": "chatkit_beta=v1",
      },
      body: JSON.stringify({
        workflow: { id: workflowId },
        user: userId,
      }),
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

    console.log("[ChatKit] Session created successfully");

    const sessionCookie = buildCookieHeader(
      existingSessionId ?? crypto.randomUUID(),
    );

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (sessionCookie) headers["Set-Cookie"] = sessionCookie;

    return new NextResponse(JSON.stringify(payload), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("[ChatKit] Session route error", error);
    return NextResponse.json(
      { error: "chatkit_session_unexpected", details: String(error) },
      { status: 500 },
    );
  }
}
