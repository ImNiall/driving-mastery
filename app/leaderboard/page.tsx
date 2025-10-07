"use client";
import React from "react";
import LeaderboardView from "@/components/LeaderboardView";
import { ProgressService } from "@/lib/services/progress";

export default function LeaderboardPage() {
  const [points, setPoints] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const o = await ProgressService.getOverview();
        if (!cancelled) setPoints(o.masteryPoints || 0);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load leaderboard");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <LeaderboardView currentUserMasteryPoints={points} />
    </main>
  );
}
