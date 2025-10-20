import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { source } = body;

    // Get the latest attempt for the user
    const { data: attempt, error: attemptError } = await supabase
      .from("quiz_attempts")
      .select(
        `
        id,
        source,
        current_index,
        started_at,
        finished_at,
        dvsa_category
      `,
      )
      .eq("user_id", user.id)
      .eq("source", source)
      .is("finished_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (attemptError && attemptError.code !== "PGRST116") {
      console.error("Error fetching latest attempt:", attemptError);
      return NextResponse.json(
        { error: "Failed to fetch attempt" },
        { status: 500 },
      );
    }

    // If no active attempt, return null
    if (!attempt) {
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

    return NextResponse.json({
      attemptId: attempt.id,
      source: attempt.source,
      started_at: attempt.started_at,
      current_index: attempt.current_index || 0,
      questions: null,
      finished: false,
      dvsa_category: attempt.dvsa_category,
    });
  } catch (error) {
    console.error("Attempt latest error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
