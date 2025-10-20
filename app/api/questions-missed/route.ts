import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const supabase = supabaseServer();

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get questions the user has missed (incorrect answers)
    const { data: missedQuestions, error: missedError } = await supabase
      .from("quiz_attempts")
      .select(
        `
        id,
        questions_missed,
        dvsa_category,
        score_percent,
        created_at
      `,
      )
      .eq("user_id", user.id)
      .not("questions_missed", "is", null)
      .order("created_at", { ascending: false })
      .limit(50);

    if (missedError) {
      console.error("Error fetching missed questions:", missedError);
      return NextResponse.json(
        { error: "Failed to fetch missed questions" },
        { status: 500 },
      );
    }

    // Aggregate missed questions by category
    const missedByCategory: Record<string, number> = {};
    let totalMissed = 0;

    missedQuestions?.forEach((attempt) => {
      if (attempt.questions_missed) {
        const count = Array.isArray(attempt.questions_missed)
          ? attempt.questions_missed.length
          : 1;
        totalMissed += count;

        if (attempt.dvsa_category) {
          missedByCategory[attempt.dvsa_category] =
            (missedByCategory[attempt.dvsa_category] || 0) + count;
        }
      }
    });

    return NextResponse.json({
      totalMissed,
      byCategory: missedByCategory,
      recentAttempts: missedQuestions?.slice(0, 10) || [],
    });
  } catch (error) {
    console.error("Questions missed error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
