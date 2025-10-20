import { NextRequest, NextResponse } from "next/server";
import { getSupabaseRouteContext } from "@/lib/supabase/server";
import type { Database } from "@/src/types/supabase";

export const dynamic = "force-dynamic";

type QuizAnswerRow = Database["public"]["Tables"]["quiz_answers"]["Row"];

type QuestionStat = {
  questionId: number;
  category: string | null;
  correct: number;
  incorrect: number;
  total: number;
  lastSeen: string | null;
};

export async function GET(request: NextRequest) {
  const {
    supabase,
    user,
    error: authError,
  } = await getSupabaseRouteContext(request);

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("quiz_answers")
    .select("question_id, category, is_correct, updated_at")
    .eq("user_id", user.id)
    .not("question_id", "is", null)
    .order("updated_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("questions-missed: failed to load answers", error);
    return NextResponse.json(
      { error: "Failed to fetch missed questions" },
      { status: 500 },
    );
  }

  const stats = new Map<number, QuestionStat>();

  for (const row of (data ?? []) as QuizAnswerRow[]) {
    const questionId = row.question_id;
    if (typeof questionId !== "number") continue;

    if (!stats.has(questionId)) {
      stats.set(questionId, {
        questionId,
        category: row.category ?? null,
        correct: 0,
        incorrect: 0,
        total: 0,
        lastSeen: row.updated_at ?? null,
      });
    }

    const entry = stats.get(questionId)!;
    entry.total += 1;
    if (row.is_correct === true) {
      entry.correct += 1;
    } else if (row.is_correct === false) {
      entry.incorrect += 1;
    }

    if (
      !entry.lastSeen ||
      (row.updated_at && row.updated_at < entry.lastSeen)
    ) {
      entry.lastSeen = row.updated_at ?? entry.lastSeen;
    }
  }

  const questions = Array.from(stats.values())
    .filter((entry) => entry.incorrect > 0)
    .sort((a, b) => {
      const incorrectDiff = b.incorrect - a.incorrect;
      if (incorrectDiff !== 0) return incorrectDiff;
      const lastA = a.lastSeen ? new Date(a.lastSeen).getTime() : 0;
      const lastB = b.lastSeen ? new Date(b.lastSeen).getTime() : 0;
      return lastA - lastB;
    });

  return NextResponse.json({ questions });
}
