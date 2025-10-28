import { NextRequest, NextResponse } from "next/server";
import OpenAI, { APIError } from "openai";

const OPENAI_ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID ?? "";
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const openai =
  OPENAI_API_KEY.length > 0
    ? new OpenAI({
        apiKey: OPENAI_API_KEY,
        defaultHeaders: {
          "OpenAI-Beta": "assistants=v2",
        },
      })
    : null;

type CachedAssistant = Awaited<
  ReturnType<Exclude<typeof openai, null>["beta"]["assistants"]["retrieve"]>
> | null;

let assistantCache: CachedAssistant = null;
let assistantCacheTimestamp = 0;
const ASSISTANT_CACHE_TTL_MS = 5 * 60 * 1000;

async function loadAssistant(assistantId: string) {
  if (!openai) return null;
  const now = Date.now();
  if (
    assistantCache &&
    now - assistantCacheTimestamp < ASSISTANT_CACHE_TTL_MS &&
    assistantCache.id === assistantId
  ) {
    return assistantCache;
  }

  const assistant = await openai.beta.assistants.retrieve(assistantId, {
    headers: { "OpenAI-Beta": "assistants=v2" },
  });
  assistantCache = assistant;
  assistantCacheTimestamp = now;
  return assistant;
}

type ResponseOutput =
  | string
  | { type: string; text?: string; annotations?: unknown }
  | { content?: Array<{ text?: string }> };

function extractText(output: ResponseOutput[]): string {
  const chunks: string[] = [];

  for (const item of output) {
    if (typeof item === "string") {
      chunks.push(item);
      continue;
    }
    if ("text" in item && typeof item.text === "string") {
      chunks.push(item.text);
      continue;
    }
    if ("content" in item && Array.isArray(item.content)) {
      for (const segment of item.content) {
        if (segment && typeof segment.text === "string") {
          chunks.push(segment.text);
        }
      }
    }
  }

  return chunks.join("\n").trim();
}

export async function POST(req: NextRequest) {
  if (!openai || !OPENAI_ASSISTANT_ID) {
    return NextResponse.json(
      {
        error:
          "Assistant is not configured. Missing OpenAI API key or assistant id.",
      },
      { status: 500 },
    );
  }

  let userInput = "";
  try {
    const body = await req.json();
    userInput = String(body?.message ?? "");
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  if (!userInput) {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }

  try {
    const assistant = await loadAssistant(OPENAI_ASSISTANT_ID);
    if (!assistant) {
      return NextResponse.json(
        { error: "Assistant configuration unavailable." },
        { status: 500 },
      );
    }

    const model = assistant.model || OPENAI_MODEL;
    if (!model) {
      return NextResponse.json(
        { error: "Assistant has no model configured." },
        { status: 500 },
      );
    }

    const response = await openai.responses.create({
      assistant_id: assistant.id,
      model,
      metadata: { assistant_id: assistant.id },
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: userInput,
            },
          ],
        },
      ],
    } as any);

    const textOutput =
      extractText((response.output ?? []) as ResponseOutput[]) ||
      (typeof response.output_text === "string"
        ? response.output_text.trim()
        : "");

    return NextResponse.json(
      {
        text: textOutput,
        response,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[/api/chat] OpenAI error", error);

    if (error instanceof APIError) {
      return NextResponse.json(
        {
          error: error.message,
          detail: error.error?.message ?? null,
        },
        { status: error.status ?? 500 },
      );
    }

    const message =
      error instanceof Error ? error.message : "Assistant request failed";

    return NextResponse.json(
      { error: message },
      {
        status: 500,
      },
    );
  }
}
