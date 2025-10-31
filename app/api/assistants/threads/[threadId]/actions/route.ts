import { NextRequest } from "next/server";
import { openai } from "@/app/openai";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: { threadId: string } },
) {
  const body = await request.json();
  const toolCallOutputs = Array.isArray(body?.toolCallOutputs)
    ? body.toolCallOutputs
    : [];
  const runId = typeof body?.runId === "string" ? body.runId : "";

  if (!runId || toolCallOutputs.length === 0) {
    return new Response(null, { status: 400 });
  }

  const stream = openai.beta.threads.runs.submitToolOutputsStream(
    params.threadId,
    runId,
    { tool_outputs: toolCallOutputs },
  );

  return new Response(stream.toReadableStream());
}
