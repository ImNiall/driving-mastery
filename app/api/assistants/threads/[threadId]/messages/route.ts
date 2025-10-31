import { NextRequest, NextResponse } from "next/server";
import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: { threadId: string } },
) {
  if (!assistantId) {
    return NextResponse.json(
      { error: "Assistant is not configured." },
      { status: 500 },
    );
  }

  const body = await request.json();
  const content =
    typeof body?.content === "string" ? body.content : String(body?.content);

  await openai.beta.threads.messages.create(params.threadId, {
    role: "user",
    content,
  });

  const stream = openai.beta.threads.runs.stream(params.threadId, {
    assistant_id: assistantId,
  });

  return new Response(stream.toReadableStream());
}
