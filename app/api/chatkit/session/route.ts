import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId") ?? undefined;

    const apiKey = process.env.OPENAI_API_KEY;
    const workflowId =
      process.env.WORKFLOW_ID ?? url.searchParams.get("workflow") ?? undefined;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 },
      );
    }
    if (!workflowId) {
      return NextResponse.json(
        { error: "Missing WORKFLOW_ID" },
        { status: 500 },
      );
    }

    const body: Record<string, unknown> = {
      workflow: { id: workflowId },
      ...(userId ? { user: userId } : {}),
    };

    const resp = await fetch("https://api.openai.com/v1/chatkit/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "OpenAI-Beta": "chatkit_beta=v1",
      },
      body: JSON.stringify(body),
    });

    const payload = await resp.json();

    if (!resp.ok || typeof payload?.client_secret !== "string") {
      return NextResponse.json(
        { error: "chatkit_session_invalid", details: payload },
        { status: 502 },
      );
    }

    return NextResponse.json({ client_secret: payload.client_secret });
  } catch (e: any) {
    return NextResponse.json(
      { error: "chatkit_session_error", details: { message: e?.message } },
      { status: 500 },
    );
  }
}
