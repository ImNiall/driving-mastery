import { NextResponse } from "next/server";
import {
  createThread,
  sendMessageToAssistant,
} from "@/lib/services/assistants";
import { supabaseRoute } from "@/lib/supabase/route";

export async function POST(request: Request) {
  try {
    const { threadId, message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const supabase = supabaseRoute();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const activeThreadId = threadId || (await createThread());
    const response = await sendMessageToAssistant({
      threadId: activeThreadId,
      message,
      context: {
        userId: session?.user?.id ?? undefined,
      },
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
