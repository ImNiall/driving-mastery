import React, { useEffect, useMemo, useState } from "react";
import { MedalIcon, TrophyIcon } from "./icons";
import { ProgressService } from "@/lib/services/progress";
import {
  countryCodeToFlag,
  formatStreakLabel,
  formatTestCountdown,
  getActivityStatus,
  getAverageScoreStyles,
  pluralise,
} from "@/lib/utils/leaderboard";

interface LeaderboardViewProps {
  currentUserMasteryPoints: number;
}

type TimeFrame = "weekly" | "monthly" | "allTime";

type EnhancedLeaderboardEntry = {
  rank: number;
  name: string;
  masteryPoints: number;
  categoriesMastered: number;
  isCurrentUser: boolean;
  lastActivity: string | null;
  currentStreak: number;
  longestStreak: number;
  totalQuizzes: number;
  perfectScores: number;
  averageScore: number;
  weeklyPoints: number;
  studyTime: string;
  memberSince: string | null;
  lastActive: string | null;
  lastActiveRaw: string | null;
  country: string | null;
  region: string | null;
  testDate: string | null;
  rankChange: number;
};

type CurrentUserRank = {
  rank: number;
  name: string;
  masteryPoints: number;
  categoriesMastered: number;
  isCurrentUser: boolean;
  lastActivity: string | null;
} | null;

const TIMEFRAME_LABELS: Record<TimeFrame, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  allTime: "All-Time",
};

const MEDAL_COLORS: Record<number, string> = {
  1: "#FFD700",
  2: "#C0C0C0",
  3: "#CD7F32",
};

const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  currentUserMasteryPoints,
}) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("allTime");
  const [leaderboardData, setLeaderboardData] = useState<
    EnhancedLeaderboardEntry[]
  >([]);
  const [currentUserRank, setCurrentUserRank] = useState<CurrentUserRank>(null);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await ProgressService.getLeaderboard(timeFrame);

        if (!isMounted) return;

        setLeaderboardData(response.leaderboard ?? []);
        setCurrentUserRank(response.currentUserRank ?? null);
        setTotalEntries(response.totalEntries ?? 0);
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.message || "Failed to load leaderboard");
        console.error("Leaderboard fetch error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLeaderboard();

    return () => {
      isMounted = false;
    };
  }, [timeFrame]);

  const renderRank = (rank: number) => {
    if (rank <= 3) {
      return (
        <MedalIcon className="w-9 h-9 mx-auto" color={MEDAL_COLORS[rank]} />
      );
    }
    return <span className="text-lg font-semibold text-gray-600">{rank}</span>;
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

  const fallbackLeaderboardMessage = useMemo(() => {
    if (timeFrame === "weekly") {
      return "Leaderboard resets every Monday — keep the streak going!";
    }
    if (timeFrame === "monthly") {
      return "No monthly activity yet. Complete quizzes this month to appear here.";
    }
    return "Once learners start earning Mastery Points, the leaderboard will appear here.";
  }, [timeFrame]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            <TrophyIcon className="w-8 h-8 mr-3 text-brand-blue" />
            Leaderboard
          </h2>
          <p className="text-gray-600 mt-2">Loading leaderboard...</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-blue border-t-transparent mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
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
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
          <TrophyIcon className="w-8 h-8 mr-3 text-brand-blue" />
          Leaderboard
        </h2>
        <p className="text-gray-600 mt-2">
          Track real learner progress with streaks, achievements, and study time
          insights. Keep climbing by mastering quizzes every day.
        </p>
      </div>

      <div className="flex justify-center mb-6 bg-gray-100 p-1 rounded-full max-w-xs mx-auto">
        {(Object.entries(TIMEFRAME_LABELS) as Array<[TimeFrame, string]>).map(
          ([frame, label]) => (
            <TimeFrameButton key={frame} frame={frame} label={label} />
          ),
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {leaderboardData.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <p className="font-semibold mb-2">
              No results for this timeframe yet.
            </p>
            <p className="text-sm text-gray-400">
              {fallbackLeaderboardMessage}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {leaderboardData.map((entry) => {
              const flagEmoji = countryCodeToFlag(entry.country);
              const activityStatus = getActivityStatus(entry.lastActiveRaw);
              const testCountdown = formatTestCountdown(entry.testDate);

              return (
                <li
                  key={`${entry.rank}-${entry.name}`}
                  className={`px-4 md:px-6 py-5 transition-colors duration-150 ${
                    entry.isCurrentUser
                      ? "bg-brand-blue-light/60 border-l-4 border-brand-blue"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-4 md:gap-6">
                      <div className="flex flex-col items-center w-12">
                        {renderRank(entry.rank)}
                        {entry.rankChange !== 0 && (
                          <span
                            className={`mt-2 text-xs font-semibold ${
                              entry.rankChange < 0
                                ? "text-red-500"
                                : "text-green-600"
                            }`}
                          >
                            {entry.rankChange > 0 ? "▲" : "▼"}
                            {Math.abs(entry.rankChange)}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-lg font-semibold text-gray-800">
                          {flagEmoji && (
                            <span className="text-2xl leading-none">
                              {flagEmoji}
                            </span>
                          )}
                          <span
                            className={
                              entry.isCurrentUser
                                ? "text-brand-blue font-extrabold"
                                : ""
                            }
                          >
                            {entry.name}
                          </span>
                          {entry.currentStreak > 0 && (
                            <span className="ml-1 text-sm font-medium bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                              🔥 {formatStreakLabel(entry.currentStreak)}
                            </span>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
                          {entry.totalQuizzes > 0 && (
                            <span>
                              {pluralise(
                                entry.totalQuizzes,
                                "quiz completed",
                                "quizzes completed",
                              )}
                            </span>
                          )}

                          {entry.averageScore > 0 && (
                            <span
                              className={`px-2 py-1 rounded-full text-xs md:text-sm font-semibold ${getAverageScoreStyles(entry.averageScore)}`}
                            >
                              Avg score {entry.averageScore}%
                            </span>
                          )}

                          {entry.perfectScores > 0 && (
                            <span className="text-yellow-600">
                              ⭐{" "}
                              {pluralise(
                                entry.perfectScores,
                                "perfect score",
                                "perfect scores",
                              )}
                            </span>
                          )}

                          {entry.memberSince && (
                            <span>Member since {entry.memberSince}</span>
                          )}

                          {entry.longestStreak > 0 && (
                            <span>Best streak {entry.longestStreak} days</span>
                          )}

                          {entry.lastActive && (
                            <span
                              className={`flex items-center gap-1 ${activityStatus.className}`}
                            >
                              <span>{activityStatus.indicator}</span>
                              <span>{entry.lastActive}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <div className="text-xl font-bold text-gray-800">
                        {entry.masteryPoints.toLocaleString()}{" "}
                        <span className="text-sm font-semibold text-gray-500">
                          MP
                        </span>
                      </div>

                      {entry.weeklyPoints > 0 && (
                        <div className="text-sm font-semibold text-green-600">
                          +{entry.weeklyPoints.toLocaleString()} pts this week
                        </div>
                      )}

                      {entry.studyTime && entry.studyTime !== "0h" && (
                        <div className="text-sm text-gray-600">
                          📚 {entry.studyTime} studied
                        </div>
                      )}

                      {entry.categoriesMastered > 0 && (
                        <div className="text-xs text-gray-500">
                          {pluralise(
                            entry.categoriesMastered,
                            "category mastered",
                            "categories mastered",
                          )}
                        </div>
                      )}

                      {testCountdown && (
                        <div className="text-sm font-medium text-blue-600">
                          {testCountdown}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {currentUserRank &&
        !leaderboardData.some((entry) => entry.isCurrentUser) && (
          <div className="mt-6 bg-white border border-dashed border-brand-blue rounded-lg p-5 text-sm text-gray-700">
            <p className="font-semibold text-brand-blue mb-1">
              Your current position
            </p>
            <p>
              Rank {currentUserRank.rank.toLocaleString()} with{" "}
              {currentUserMasteryPoints.toLocaleString()} MP. Keep taking
              quizzes to break into the top 100!
            </p>
          </div>
        )}

      <div className="mt-4 text-sm text-gray-400 text-center">
        Tracking {totalEntries} active learners across Driving Mastery.
      </div>
    </div>
  );
};

export default LeaderboardView;
