import { NextRequest, NextResponse } from "next/server";
import { Agent, run } from "@openai/agents";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";

  if (!prompt) {
    return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
  }

  const agent = new Agent({
    name: "Driving Mastery Agent",
    instructions:
      "You are Theo, the Driving Mastery agent. Help UK learner drivers prepare for the theory test with concise, accurate guidance.",
  });

  const result = await run(agent, prompt);
  return NextResponse.json({ output: result.finalOutput ?? "" });
}
