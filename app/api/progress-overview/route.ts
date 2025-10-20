import { NextRequest, NextResponse } from "next/server";
import { getSupabaseRouteContext } from "@/lib/supabase/server";
import type { Database } from "@/src/types/supabase";

export const dynamic = "force-dynamic";

type CategoryRow = Database["public"]["Views"]["v_category_performance"]["Row"];
type AttemptRow = Database["public"]["Tables"]["quiz_attempts"]["Row"] & {
  dvsa_category?: string | null;
};
type MasteryRow = Database["public"]["Tables"]["module_mastery"]["Row"];
type StudyPlanRow = Database["public"]["Tables"]["study_plan_state"]["Row"];

const EMPTY_OVERVIEW = {
  categories: [] as Array<{ category: string; correct: number; total: number }>,
  attempts: [] as Array<Record<string, unknown>>,
  masteryPoints: 0,
  studyPlan: {
    currentLevel: "Beginner",
    recommendedActions: [] as string[],
    plan: null as {
      planKey: string;
      steps: StudyPlanRow["steps"];
      updatedAt: StudyPlanRow["updated_at"];
    } | null,
  },
};

function buildStudyPlanSummary(points: number, plan: StudyPlanRow | null) {
  const currentLevel =
    points >= 80 ? "Advanced" : points >= 60 ? "Intermediate" : "Beginner";
  const recommendedActions = [
    points < 60 ? "Focus on theory modules" : null,
    points < 80 ? "Practice weak categories" : null,
    points >= 80 ? "Take mock tests" : null,
  ].filter(Boolean) as string[];

  return {
    currentLevel,
    recommendedActions,
    plan: plan
      ? {
          planKey: plan.plan_key,
          steps: plan.steps,
          updatedAt: plan.updated_at,
        }
      : null,
  };
}

export async function GET(request: NextRequest) {
  const {
    supabase,
    user,
    error: authError,
  } = await getSupabaseRouteContext(request);

  if (authError || !user) {
    return NextResponse.json(EMPTY_OVERVIEW);
  }

  const [categoriesResponse, attemptsResponse, masteryResponse, planResponse] =
    await Promise.all([
      supabase
        .from("v_category_performance")
        .select("category, correct, total")
        .eq("user_id", user.id),
      supabase
        .from("quiz_attempts")
        .select(
          "id, started_at, finished_at, total, correct, score_percent, duration_sec, source, dvsa_category",
        )
        .eq("user_id", user.id)
        .order("started_at", { ascending: false })
        .limit(20),
      supabase.from("module_mastery").select("points").eq("user_id", user.id),
      supabase
        .from("study_plan_state")
        .select("plan_key, steps, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  if (categoriesResponse.error) {
    console.error(
      "progress-overview: failed to load categories",
      categoriesResponse.error,
    );
    return NextResponse.json(
      { error: "Failed to load progress overview" },
      { status: 500 },
    );
  }

  if (attemptsResponse.error) {
    console.error(
      "progress-overview: failed to load attempts",
      attemptsResponse.error,
    );
    return NextResponse.json(
      { error: "Failed to load progress overview" },
      { status: 500 },
    );
  }

  if (masteryResponse.error) {
    console.error(
      "progress-overview: failed to load mastery",
      masteryResponse.error,
    );
    return NextResponse.json(
      { error: "Failed to load progress overview" },
      { status: 500 },
    );
  }

  if (planResponse.error && planResponse.error.code !== "PGRST116") {
    console.error(
      "progress-overview: failed to load study plan",
      planResponse.error,
    );
    return NextResponse.json(
      { error: "Failed to load progress overview" },
      { status: 500 },
    );
  }

  const categories = (categoriesResponse.data ?? []).map(
    (row: CategoryRow) => ({
      category: row.category ?? "Mixed",
      correct: row.correct ?? 0,
      total: row.total ?? 0,
    }),
  );

  const attempts = (attemptsResponse.data ?? []).map((attempt) => {
    const record = attempt as AttemptRow;
    return {
      id: record.id,
      source: record.source ?? "module",
      total: record.total ?? 0,
      correct: record.correct ?? 0,
      score_percent: record.score_percent ?? 0,
      started_at: record.started_at,
      finished_at: record.finished_at,
      duration_sec: record.duration_sec ?? null,
      dvsa_category: record.dvsa_category ?? null,
    };
  });

  const masteryPoints = (masteryResponse.data ?? []).reduce(
    (sum, row: MasteryRow) => {
      return sum + (row.points ?? 0);
    },
    0,
  );

  const planData = planResponse.data ?? null;
  const studyPlan = buildStudyPlanSummary(
    masteryPoints,
    planData as StudyPlanRow | null,
  );

  return NextResponse.json({
    categories,
    attempts,
    masteryPoints,
    studyPlan,
  });
}
