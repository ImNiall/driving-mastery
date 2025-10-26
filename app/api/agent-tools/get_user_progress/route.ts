import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/src/types/supabase";

type DBClient = SupabaseClient<any>;

let cachedSupabase: DBClient | null = null;

function getSupabase(): DBClient {
  if (cachedSupabase) {
    return cachedSupabase;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase credentials are not configured");
  }

  cachedSupabase = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }) as unknown as DBClient;

  return cachedSupabase;
}

const pct = (num: number, den: number) =>
  den === 0 ? 0 : Math.round((100 * num) / den);

function sinceIso(window: string | undefined): string | null {
  if (!window || window === "30d") {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString();
  }
  if (window === "7d") {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString();
  }
  return null;
}

function lastNDatesIso(days: number): string[] {
  const out: string[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

function pickColumn(
  existing: Set<string>,
  candidates: string[],
  fallback: string,
) {
  for (const c of candidates) {
    if (existing.has(c)) {
      return c;
    }
  }
  return fallback;
}

type SupabaseRow = Record<string, any>;

type ProgressSummary = {
  accuracy_by_topic: Array<{ topic: string; accuracy: number }>;
  weakest_categories: string[];
  trend_7d: Array<{ date: string; acc: number | null }>;
  totals: { answered: number; correct: number };
  last_mock_score: number | null;
  streak_days: number | null;
};

type ModuleMasterySummary = {
  total_points: number;
  mastered_categories: number;
  categories: Array<{ category: string; points: number; mastered_at: string }>;
};

type StudyPlanSummary = {
  current_level: "Beginner" | "Intermediate" | "Advanced";
  recommended_actions: string[];
  plan: { plan_key: string; steps: SupabaseRow[]; updated_at: string } | null;
};

type ProfileSummary = {
  display_name: string | null;
  name: string | null;
  email: string | null;
  country: string | null;
  region: string | null;
  test_date: string | null;
  member_since: string | null;
};

type ResponsePayload = {
  profile: ProfileSummary | null;
  progress: ProgressSummary;
  module_mastery: ModuleMasterySummary;
  study_plan: StudyPlanSummary;
};

function computeStudyLevel(points: number): StudyPlanSummary["current_level"] {
  if (points >= 80) return "Advanced";
  if (points >= 60) return "Intermediate";
  return "Beginner";
}

function recommendedActions(
  level: StudyPlanSummary["current_level"],
): string[] {
  if (level === "Advanced") return ["Take mock tests", "Fine-tune weak topics"];
  if (level === "Intermediate")
    return ["Drill weak categories", "Increase practice volume"];
  return ["Focus on core theory", "Build daily study habits"];
}

async function fetchProfile(
  supabase: DBClient,
  userId: string,
): Promise<ProfileSummary | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  if (!data) return null;

  const row = data as SupabaseRow;

  const value = (key: string) =>
    key in row ? ((row as any)[key] ?? null) : null;

  return {
    display_name: value("display_name") ?? value("name"),
    name: value("name") ?? value("display_name"),
    email: value("email"),
    country: value("country"),
    region: value("region"),
    test_date: value("test_date"),
    member_since: value("created_at"),
  };
}

async function fetchProgress(
  supabase: DBClient,
  userId: string,
  sinceIsoDate: string | null,
): Promise<ProgressSummary> {
  const supabaseAny = supabase as any;

  const { data: qaCols } = await supabaseAny
    .from("information_schema.columns")
    .select("table_name,column_name")
    .in("table_name", ["question_attempts", "quiz_attempts"]);

  const colsByTable = new Map<string, Set<string>>();
  (qaCols ?? []).forEach((r: SupabaseRow) => {
    if (!colsByTable.has(r.table_name)) {
      colsByTable.set(r.table_name, new Set());
    }
    colsByTable.get(r.table_name)!.add(r.column_name);
  });

  const qaColsSet = colsByTable.get("question_attempts") ?? new Set<string>();
  const qzColsSet = colsByTable.get("quiz_attempts") ?? new Set<string>();

  const QA_TOPIC = pickColumn(qaColsSet, ["topic", "category"], "topic");
  const QA_CORRECT = pickColumn(
    qaColsSet,
    ["was_correct", "is_correct", "correct"],
    "correct",
  );
  const QA_CREATED = pickColumn(
    qaColsSet,
    ["answered_at", "created_at"],
    "created_at",
  );

  const QZ_CORRECT = pickColumn(
    qzColsSet,
    ["score", "correct_count", "correct"],
    "correct",
  );
  const QZ_TOTAL = pickColumn(qzColsSet, ["total_count", "total"], "total");
  const QZ_CREATED = pickColumn(
    qzColsSet,
    ["attempted_at", "created_at", "started_at"],
    "created_at",
  );

  let qaQuery = supabaseAny
    .from("question_attempts")
    .select(`${QA_TOPIC}, ${QA_CORRECT}, ${QA_CREATED}`)
    .eq("user_id", userId);
  if (sinceIsoDate) {
    qaQuery = qaQuery.gte(QA_CREATED, sinceIsoDate);
  }

  const { data: qa, error: qaErr } = await qaQuery;
  if (qaErr) throw qaErr;

  const totals = {
    answered: qa?.length ?? 0,
    correct: (qa ?? []).filter((r: SupabaseRow) => !!r[QA_CORRECT]).length,
  };

  const byTopic: Record<string, { c: number; t: number }> = {};
  (qa ?? []).forEach((r: SupabaseRow) => {
    const topic = r[QA_TOPIC] ?? "Unknown";
    if (!byTopic[topic]) byTopic[topic] = { c: 0, t: 0 };
    byTopic[topic].t += 1;
    if (r[QA_CORRECT]) byTopic[topic].c += 1;
  });

  const accuracy_by_topic = Object.entries(byTopic)
    .map(([topic, v]) => ({ topic, accuracy: pct(v.c, v.t), attempts: v.t }))
    .sort((a, b) => a.topic.localeCompare(b.topic))
    .map(({ attempts, ...rest }) => rest);

  const weakest_categories = Object.entries(byTopic)
    .map(([topic, v]) => ({ topic, accuracy: pct(v.c, v.t), attempts: v.t }))
    .filter((x) => x.attempts >= 10)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3)
    .map((x) => x.topic);

  const days = lastNDatesIso(7);
  const byDate: Record<string, { c: number; t: number }> = {};
  (qa ?? []).forEach((r: SupabaseRow) => {
    const d = new Date(r[QA_CREATED]).toISOString().slice(0, 10);
    if (!byDate[d]) byDate[d] = { c: 0, t: 0 };
    byDate[d].t += 1;
    if (r[QA_CORRECT]) byDate[d].c += 1;
  });

  const trend_7d = days.map((d) => ({
    date: d,
    acc: byDate[d] ? pct(byDate[d].c, byDate[d].t) : null,
  }));

  const { data: lastMock } = await supabaseAny
    .from("quiz_attempts")
    .select(`${QZ_CORRECT}, ${QZ_TOTAL}, ${QZ_CREATED}`)
    .eq("user_id", userId)
    .order(QZ_CREATED, { ascending: false })
    .limit(1);

  let last_mock_score: number | null = null;
  const lastMockRow = lastMock?.[0] as SupabaseRow | undefined;
  if (lastMockRow) {
    const correctNum = Number(lastMockRow[QZ_CORRECT] ?? 0);
    const totalNum = Number(lastMockRow[QZ_TOTAL] ?? 0);
    last_mock_score = pct(correctNum, totalNum);
  }

  const { data: streakRow } = await supabaseAny
    .from("progress")
    .select("updated_at, user_id, clerk_user_id")
    .or(`user_id.eq.${userId},clerk_user_id.eq.${userId}`)
    .order("updated_at", { ascending: false })
    .limit(1);

  let streak_days: number | null = null;
  const streakRecord = streakRow?.[0] as SupabaseRow | undefined;
  if (streakRecord?.updated_at) {
    const latest = new Date(streakRecord.updated_at as string);
    const diff = Math.max(0, Date.now() - latest.getTime());
    streak_days = Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  return {
    accuracy_by_topic,
    weakest_categories,
    trend_7d,
    totals,
    last_mock_score,
    streak_days,
  };
}

async function fetchModuleMastery(
  supabase: DBClient,
  userId: string,
): Promise<ModuleMasterySummary> {
  const supabaseAny = supabase as any;

  const { data, error } = await supabaseAny
    .from("module_mastery")
    .select("category, points, mastered_at")
    .eq("user_id", userId)
    .order("mastered_at", { ascending: false });

  if (error) throw error;

  const categories: { points: number }[] = (data ?? []).map(
    (row: SupabaseRow) => ({
      category: row.category ?? "Unknown",
      points: Number(row.points ?? 0),
      mastered_at: row.mastered_at ?? new Date().toISOString(),
    }),
  );

  const total_points = categories.reduce((sum, row) => sum + row.points, 0);

  return {
    total_points,
    mastered_categories: categories.filter(
      (row: { points: number }) => row.points >= 100,
    ).length,
    categories,
  };
}

async function fetchStudyPlan(
  supabase: DBClient,
  userId: string,
  mastery: ModuleMasterySummary,
): Promise<StudyPlanSummary> {
  const supabaseAny = supabase as any;

  const { data, error } = await supabaseAny
    .from("study_plan_state")
    .select("plan_key, steps, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error && error.code !== "PGRST116") throw error;

  const level = computeStudyLevel(mastery.total_points);

  return {
    current_level: level,
    recommended_actions: recommendedActions(level),
    plan: data
      ? {
          plan_key: (data as SupabaseRow).plan_key ?? "unknown",
          steps:
            ((data as SupabaseRow).steps as SupabaseRow[] | undefined) ?? [],
          updated_at:
            (data as SupabaseRow).updated_at ?? new Date().toISOString(),
        }
      : null,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { user_id, window = "30d" } = await req.json();
    if (!user_id) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 },
      );
    }

    const supabase = getSupabase();
    const since = sinceIso(window);

    const [profile, moduleMastery, progress] = await Promise.all([
      fetchProfile(supabase, user_id),
      fetchModuleMastery(supabase, user_id),
      fetchProgress(supabase, user_id, since),
    ]);

    const studyPlan = await fetchStudyPlan(supabase, user_id, moduleMastery);

    const payload: ResponsePayload = {
      profile,
      progress,
      module_mastery: moduleMastery,
      study_plan: studyPlan,
    };

    return NextResponse.json(payload);
  } catch (e: any) {
    console.error("[get_user_progress] error:", e);
    return NextResponse.json(
      { error: e?.message ?? "unknown_error" },
      { status: 500 },
    );
  }
}
