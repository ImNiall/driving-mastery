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
    const payload = {
      assistant_id: OPENAI_ASSISTANT_ID,
      ...(OPENAI_MODEL ? { model: OPENAI_MODEL } : {}),
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
    } as Record<string, unknown>;

    const response = await openai.responses.create(payload as any);

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
