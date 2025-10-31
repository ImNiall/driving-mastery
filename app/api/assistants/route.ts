import { NextResponse } from "next/server";
import { openai } from "@/app/openai";

export const runtime = "nodejs";

export async function POST() {
  const assistant = await openai.beta.assistants.create({
    name: "Driving Mastery Mentor",
    instructions:
      "You are Theo, the Driving Mastery assistant. Help UK learner drivers prepare for the theory test with clear, encouraging guidance.",
    model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
    tools: [{ type: "code_interpreter" }, { type: "file_search" }],
  });

  return NextResponse.json({ assistantId: assistant.id });
}
