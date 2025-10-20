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

    // Return empty data for unauthenticated users
    if (authError || !user) {
      return NextResponse.json({
        categories: [],
        attempts: [],
        masteryPoints: 0,
        studyPlan: {
          currentLevel: "Beginner",
          recommendedActions: [],
        },
      });
    }

    // Get user's quiz attempts
    const { data: attempts, error: attemptsError } = await supabase
      .from("quiz_attempts")
      .select(
        `
        id,
        score_percent,
        total_questions,
        correct_answers,
        source,
        dvsa_category,
        started_at,
        finished_at,
        created_at
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (attemptsError) {
      console.error("Error fetching attempts:", attemptsError);
      return NextResponse.json(
        { error: "Failed to fetch attempts" },
        { status: 500 },
      );
    }

    // Calculate category statistics
    const categoryStats: Record<string, { correct: number; total: number }> =
      {};

    (attempts || []).forEach((attempt) => {
      const category = attempt.dvsa_category || "Mixed";
      if (!categoryStats[category]) {
        categoryStats[category] = { correct: 0, total: 0 };
      }
      categoryStats[category].correct += attempt.correct_answers || 0;
      categoryStats[category].total += attempt.total_questions || 0;
    });

    // Convert to array format
    const categories = Object.entries(categoryStats).map(
      ([category, stats]) => ({
        category,
        correct: stats.correct,
        total: stats.total,
      }),
    );

    // Calculate mastery points (simple calculation based on performance)
    const totalCorrect = categories.reduce((sum, cat) => sum + cat.correct, 0);
    const totalQuestions = categories.reduce((sum, cat) => sum + cat.total, 0);
    const masteryPoints =
      totalQuestions > 0
        ? Math.round((totalCorrect / totalQuestions) * 100)
        : 0;

    // If no data, return 0%
    if (categories.length === 0) {
      return NextResponse.json({
        categories: [],
        attempts: [],
        masteryPoints: 0,
        studyPlan: {
          currentLevel: "Beginner",
          recommendedActions: [
            "Start with modules",
            "Complete practice questions",
          ],
        },
      });
    }

    // Basic study plan (placeholder)
    const studyPlan = {
      currentLevel:
        masteryPoints >= 80
          ? "Advanced"
          : masteryPoints >= 60
            ? "Intermediate"
            : "Beginner",
      recommendedActions: [
        masteryPoints < 60 ? "Focus on theory modules" : null,
        masteryPoints < 80 ? "Practice weak categories" : null,
        masteryPoints >= 80 ? "Take mock tests" : null,
      ].filter(Boolean),
    };

    return NextResponse.json({
      categories,
      attempts: attempts || [],
      masteryPoints,
      studyPlan,
    });
  } catch (error) {
    console.error("Progress overview error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
