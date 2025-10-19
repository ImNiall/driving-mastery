import React, { useState, useEffect } from "react";
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

        let filteredData = data.leaderboard || [];

        // Apply timeframe filtering
        if (timeFrame === "weekly") {
          // Sort by weekly points instead of total points
          filteredData = filteredData
            .filter((entry) => entry.weeklyPoints > 0)
            .sort((a, b) => (b.weeklyPoints || 0) - (a.weeklyPoints || 0))
            .map((entry, index) => ({ ...entry, rank: index + 1 }));
        } else if (timeFrame === "monthly") {
          // For monthly, we'll use a combination of recent activity and points
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

          filteredData = filteredData
            .filter((entry) => {
              if (!entry.lastActive) return false;
              const lastActiveDate = new Date(entry.lastActive);
              return lastActiveDate >= oneMonthAgo;
            })
            .sort((a, b) => (b.masteryPoints || 0) - (a.masteryPoints || 0))
            .map((entry, index) => ({ ...entry, rank: index + 1 }));
        }
        // 'allTime' uses the default sorting from backend

        setLeaderboardData(filteredData);
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
                className={`p-4 transition-colors ${entry.isCurrentUser ? "bg-brand-blue-light border-l-4 border-brand-blue" : "hover:bg-gray-50"}`}
              >
                <div className="flex items-center justify-between">
                  {/* Rank and Name Section */}
                  <div className="flex items-center space-x-4">
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
                    <div className="flex-grow">
                      <div
                        className={`text-lg ${entry.isCurrentUser ? "font-extrabold text-brand-blue" : "font-semibold text-gray-800"}`}
                      >
                        {entry.name}
                        {entry.currentStreak > 0 && (
                          <span className="ml-2 text-sm bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                            🔥 {entry.currentStreak} day
                            {entry.currentStreak !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        {entry.totalQuizzes > 0 && (
                          <span>
                            {entry.totalQuizzes} quiz
                            {entry.totalQuizzes !== 1 ? "es" : ""}
                          </span>
                        )}
                        {entry.averageScore > 0 && (
                          <span
                            className={`px-2 py-1 rounded ${
                              entry.averageScore >= 90
                                ? "bg-green-100 text-green-600"
                                : entry.averageScore >= 80
                                  ? "bg-blue-100 text-blue-600"
                                  : entry.averageScore >= 70
                                    ? "bg-orange-100 text-orange-600"
                                    : "bg-red-100 text-red-600"
                            }`}
                          >
                            Avg: {entry.averageScore}%
                          </span>
                        )}
                        {entry.perfectScores > 0 && (
                          <span className="text-yellow-600">
                            ⭐ {entry.perfectScores} perfect
                          </span>
                        )}
                        {entry.memberSince && (
                          <span>Member since {entry.memberSince}</span>
                        )}
                        {entry.lastActive && (
                          <span
                            className={`${
                              entry.lastActive.includes("now") ||
                              entry.lastActive.includes("h ago")
                                ? "text-green-600"
                                : entry.lastActive.includes("d ago")
                                  ? "text-yellow-600"
                                  : "text-gray-400"
                            }`}
                          >
                            {entry.lastActive.includes("now")
                              ? "🟢"
                              : entry.lastActive.includes("h ago") ||
                                  entry.lastActive.includes("d ago")
                                ? "🟡"
                                : "⚪"}{" "}
                            {entry.lastActive}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Points and Stats Section */}
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-700">
                      {entry.masteryPoints.toLocaleString()}{" "}
                      <span className="text-sm font-semibold text-gray-500">
                        MP
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      {entry.weeklyPoints > 0 && (
                        <div className="text-green-600">
                          +{entry.weeklyPoints} this week
                        </div>
                      )}
                      {entry.studyTime && entry.studyTime !== "0h" && (
                        <div>📚 {entry.studyTime}</div>
                      )}
                      {entry.categoriesMastered > 0 && (
                        <div>{entry.categoriesMastered} categories</div>
                      )}
                    </div>
                  </div>
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
