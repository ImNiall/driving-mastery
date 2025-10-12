"use client";

import { supabase } from "@/lib/supabase/client";
import type { ChatMessage, QuizAction } from "@/types";

type ChatResponse = {
  text: string;
  action?: QuizAction;
};

export async function getChatResponse(
  history: ChatMessage[],
): Promise<ChatResponse> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (typeof window !== "undefined") {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    const resp = await fetch("/api/chat", {
      method: "POST",
      headers,
      body: JSON.stringify({ history }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`Chat API error ${resp.status}: ${errText}`);
    }

    const data = (await resp.json()) as ChatResponse;
    return {
      text: data.text,
      action: data.action,
    };
  } catch (error) {
    console.error("Failed to fetch chat response:", error);
    return {
      text: "Sorry, I couldn't reach the AI Mentor right now. Please try again shortly.",
    };
  }
}
