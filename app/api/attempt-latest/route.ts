import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseRouteContext } from "@/lib/supabase/server";
import type { Database } from "@/src/types/supabase";

export const dynamic = "force-dynamic";

type AttemptRow = Database["public"]["Tables"]["quiz_attempts"]["Row"] & {
  dvsa_category?: string | null;
};

const requestSchema = z.object({
  source: z.string().min(1).optional(),
});

export async function POST(request: NextRequest) {
  const {
    supabase,
    user,
    error: authError,
  } = await getSupabaseRouteContext(request);

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json().catch(() => ({}));
  const parsed = requestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const source = parsed.data.source ?? "module";

  const { data, error } = await supabase
    .from("quiz_attempts")
    .select(
      "id, source, current_index, started_at, finished_at, questions, dvsa_category",
    )
    .eq("user_id", user.id)
    .eq("source", source)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    console.error("attempt-latest: failed to load attempt", error);
    return NextResponse.json(
      { error: "Failed to fetch attempt" },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({
      attemptId: null,
      source: null,
      started_at: null,
      current_index: 0,
      questions: null,
      finished: true,
      dvsa_category: null,
    });
  }

  const attempt = data as AttemptRow;

  return NextResponse.json({
    attemptId: attempt.id,
    source: attempt.source ?? source,
    started_at: attempt.started_at,
    current_index: attempt.current_index ?? 0,
    questions: attempt.questions ?? null,
    finished: Boolean(attempt.finished_at),
    dvsa_category: attempt.dvsa_category ?? null,
  });
}
