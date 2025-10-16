import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

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

export async function POST(req: NextRequest) {
  try {
    const { user_id, window = "30d" } = await req.json();
    if (!user_id) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 },
      );
    }

    const { data: qaCols, error: qaColsErr } = await supabase
      .from("information_schema.columns" as never)
      .select("table_name,column_name")
      .in("table_name", ["question_attempts", "quiz_attempts"]);

    if (qaColsErr) {
      console.warn(
        "[get_user_progress] information_schema fallback",
        qaColsErr.message,
      );
    }

    const colsByTable = new Map<string, Set<string>>();
    (qaCols ?? []).forEach((r: any) => {
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
      ["score", "correct_count"],
      "correct_count",
    );
    const QZ_TOTAL = pickColumn(
      qzColsSet,
      ["total_count", "total"],
      "total_count",
    );
    const QZ_CREATED = pickColumn(
      qzColsSet,
      ["attempted_at", "created_at"],
      "created_at",
    );

    const since = sinceIso(window);

    let qaQuery = supabase
      .from("question_attempts")
      .select(`${QA_TOPIC}, ${QA_CORRECT}, ${QA_CREATED}`)
      .eq("user_id", user_id);
    if (since) {
      qaQuery = qaQuery.gte(QA_CREATED, since);
    }

    const { data: qa, error: qaErr } = await qaQuery;
    if (qaErr) {
      throw qaErr;
    }

    const totals = {
      answered: qa?.length ?? 0,
      correct: (qa ?? []).filter((r: any) => !!r[QA_CORRECT]).length,
    };

    const byTopic: Record<string, { c: number; t: number }> = {};
    (qa ?? []).forEach((r: any) => {
      const topic = r[QA_TOPIC] ?? "Unknown";
      if (!byTopic[topic]) {
        byTopic[topic] = { c: 0, t: 0 };
      }
      byTopic[topic].t += 1;
      if (r[QA_CORRECT]) {
        byTopic[topic].c += 1;
      }
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
    (qa ?? []).forEach((r: any) => {
      const d = new Date(r[QA_CREATED]).toISOString().slice(0, 10);
      if (!byDate[d]) {
        byDate[d] = { c: 0, t: 0 };
      }
      byDate[d].t += 1;
      if (r[QA_CORRECT]) {
        byDate[d].c += 1;
      }
    });

    const trend_7d = days.map((d) => ({
      date: d,
      acc: byDate[d] ? pct(byDate[d].c, byDate[d].t) : null,
    }));

    let qzQuery = supabase
      .from("quiz_attempts")
      .select(`${QZ_CORRECT}, ${QZ_TOTAL}, ${QZ_CREATED}`)
      .eq("user_id", user_id)
      .order(QZ_CREATED, { ascending: false })
      .limit(1);

    const { data: lastMock, error: qzErr } = await qzQuery;
    if (qzErr) {
      throw qzErr;
    }

    let last_mock_score: number | null = null;
    if (lastMock && lastMock.length) {
      const row: any = lastMock[0];
      const correctNum = Number(row[QZ_CORRECT] ?? 0);
      const totalNum = Number(row[QZ_TOTAL] ?? 0);
      last_mock_score = pct(correctNum, totalNum);
    }

    return NextResponse.json({
      accuracy_by_topic,
      weakest_categories,
      last_mock_score,
      trend_7d,
      totals,
    });
  } catch (e: any) {
    console.error("[get_user_progress] error:", e);
    return NextResponse.json(
      { error: e?.message ?? "unknown_error" },
      { status: 500 },
    );
  }
}
