import { NextResponse } from "next/server";
import { openai } from "@/app/openai";

export const runtime = "nodejs";

export async function POST() {
  const thread = await openai.beta.threads.create();
  return NextResponse.json({ threadId: thread.id });
}
