import { NextResponse } from "next/server";
import {
  createThread,
  sendMessageToAssistant,
} from "@/lib/services/assistants";

export async function POST(request: Request) {
  try {
    const { threadId, message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const activeThreadId = threadId || (await createThread());
    const response = await sendMessageToAssistant({
      threadId: activeThreadId,
      message,
    });

    return NextResponse.json({
      text: response.text,
      threadId: response.threadId,
    });
  } catch (error) {
    console.error("Assistant chat error:", error);
    return NextResponse.json(
      { error: "Failed to get assistant response" },
      { status: 500 },
    );
  }
}
