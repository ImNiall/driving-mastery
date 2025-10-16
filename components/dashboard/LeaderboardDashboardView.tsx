"use client";

import React from "react";
import LeaderboardView from "@/components/LeaderboardView";
import { ProgressService } from "@/lib/services/progress";

type LeaderboardDashboardViewProps = {
  masteryPoints?: number;
};

export default function LeaderboardDashboardView({
  masteryPoints,
}: LeaderboardDashboardViewProps) {
  const [points, setPoints] = React.useState(masteryPoints ?? 0);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof masteryPoints === "number") {
      setPoints(masteryPoints);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const overview = await ProgressService.getOverview();
        if (!cancelled) setPoints(overview?.masteryPoints || 0);
      } catch (e: any) {
        if (!cancelled)
          setError(e?.message || "Failed to load leaderboard data");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [masteryPoints]);

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-6">
      <LeaderboardView currentUserMasteryPoints={points} />
    </div>
  );
}
