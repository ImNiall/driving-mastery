import React, { useMemo, useState, useEffect } from "react";
import { LeaderboardEntry } from "../types";
import { MedalIcon, TrophyIcon } from "./icons";
import { ProgressService } from "@/lib/services/progress";

interface LeaderboardViewProps {
  currentUserMasteryPoints: number;
}

type TimeFrame = "weekly" | "monthly" | "allTime";

const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  currentUserMasteryPoints,
}) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("allTime");
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ProgressService.getLeaderboard();

        // For now, we'll use the all-time data for all timeframes
        // In the future, you could implement time-based filtering in the backend
        setLeaderboardData(data.leaderboard || []);
      } catch (err: any) {
        setError(err?.message || "Failed to load leaderboard");
        console.error("Leaderboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeFrame]);

  const getMedalColor = (rank: number) => {
    if (rank === 1) return "#FFD700"; // Gold
    if (rank === 2) return "#C0C0C0"; // Silver
    if (rank === 3) return "#CD7F32"; // Bronze
    return undefined;
  };

  const TimeFrameButton: React.FC<{ frame: TimeFrame; label: string }> = ({
    frame,
    label,
  }) => (
    <button
      onClick={() => setTimeFrame(frame)}
      className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
        timeFrame === frame
          ? "bg-brand-blue text-white shadow-md"
          : "text-gray-600 hover:bg-white"
      }`}
    >
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            <TrophyIcon className="w-8 h-8 mr-3 text-brand-blue" />
            Leaderboard
          </h2>
          <p className="text-gray-600 mt-2">Loading leaderboard...</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            <TrophyIcon className="w-8 h-8 mr-3 text-brand-blue" />
            Leaderboard
          </h2>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
          <TrophyIcon className="w-8 h-8 mr-3 text-brand-blue" />
          Leaderboard
        </h2>
        <p className="text-gray-600 mt-2">
          See how you rank against other learners. Earn Mastery Points (MP) by
          acing quizzes and mastering modules!
        </p>
      </div>

      <div className="flex justify-center mb-6 bg-gray-100 p-1 rounded-full max-w-xs mx-auto">
        <TimeFrameButton frame="weekly" label="Weekly" />
        <TimeFrameButton frame="monthly" label="Monthly" />
        <TimeFrameButton frame="allTime" label="All-Time" />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {leaderboardData.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No leaderboard data available yet.</p>
            <p className="text-sm mt-2">
              Complete some quizzes to see rankings!
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {leaderboardData.map((entry: any) => (
              <li
                key={entry.rank}
                className={`flex items-center p-4 transition-colors ${entry.isCurrentUser ? "bg-brand-blue-light" : "hover:bg-gray-50"}`}
              >
                <div className="w-12 text-center text-lg font-bold flex-shrink-0">
                  {entry.rank <= 3 ? (
                    <MedalIcon
                      className="w-8 h-8 mx-auto"
                      color={getMedalColor(entry.rank)}
                    />
                  ) : (
                    <span className="text-gray-500">{entry.rank}</span>
                  )}
                </div>
                <div
                  className={`flex-grow px-4 ${entry.isCurrentUser ? "font-extrabold text-brand-blue" : "font-semibold text-gray-800"}`}
                >
                  {entry.name}
                </div>
                <div className="text-right font-bold text-lg text-gray-700">
                  {entry.masteryPoints.toLocaleString()}{" "}
                  <span className="text-sm font-semibold text-gray-500">
                    MP
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LeaderboardView;
