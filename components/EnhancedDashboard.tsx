import React, { useState, useEffect } from "react";
import TestCountdown from "./TestCountdown";
import RegionalLeaderboard from "./RegionalLeaderboard";
import LearningProgress from "./LearningProgress";
import Badge from "./Badge";
import { ProgressService } from "@/lib/services/progress";

interface UserProfile {
  display_name: string | null;
  test_date: string | null;
  country: string | null;
  region: string | null;
  last_active: string | null;
}

interface UserStats {
  currentStreak: number;
  totalQuizzes: number;
  averageScore: number;
  perfectScores: number;
  studyTime: string;
  weeklyPoints: number;
  masteryPoints: number;
  rank: number;
}

const EnhancedDashboard: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch leaderboard data to get current user stats
        const leaderboardData = await ProgressService.getLeaderboard();
        const currentUser = leaderboardData.leaderboard.find(
          (entry) => entry.isCurrentUser,
        );

        if (currentUser) {
          setUserStats({
            currentStreak: currentUser.currentStreak,
            totalQuizzes: currentUser.totalQuizzes,
            averageScore: currentUser.averageScore,
            perfectScores: currentUser.perfectScores,
            studyTime: currentUser.studyTime,
            weeklyPoints: currentUser.weeklyPoints,
            masteryPoints: currentUser.masteryPoints,
            rank: currentUser.rank,
          });

          setUserProfile({
            display_name: currentUser.name === "You" ? null : currentUser.name,
            test_date: currentUser.testDate,
            country: currentUser.country,
            region: currentUser.region,
            last_active: currentUser.lastActive,
          });
        }
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStreakBadgeLevel = (streak: number) => {
    if (streak >= 100) return "platinum";
    if (streak >= 30) return "gold";
    if (streak >= 7) return "silver";
    return "bronze";
  };

  const getQuizBadgeLevel = (quizzes: number) => {
    if (quizzes >= 100) return "platinum";
    if (quizzes >= 50) return "gold";
    if (quizzes >= 10) return "silver";
    return "bronze";
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6">
        <div className="animate-pulse">
          <div className="mb-6 h-7 w-1/3 rounded bg-gray-200"></div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-lg bg-gray-200 sm:h-48"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6">
      <div className="mb-8 space-y-2 sm:space-y-3">
        <h1 className="break-words text-2xl font-bold text-gray-900 sm:text-3xl">
          Welcome back
          {userProfile?.display_name ? `, ${userProfile.display_name}` : ""}! 👋
        </h1>
        <p className="max-w-2xl text-sm text-gray-600 sm:text-base">
          Here&apos;s your learning progress and achievements
        </p>
      </div>

      {/* Stats Overview Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {/* Rank Card */}
        <div className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-5 text-white sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100 sm:text-base">Current Rank</p>
              <p className="text-2xl font-bold sm:text-3xl">
                #{userStats?.rank || "N/A"}
              </p>
            </div>
            <div className="text-3xl sm:text-4xl">🏆</div>
          </div>
          <p className="mt-2 text-xs text-blue-100 sm:text-sm">
            {userStats?.masteryPoints || 0} Mastery Points
          </p>
        </div>

        {/* Streak Card */}
        <div className="rounded-lg bg-gradient-to-r from-orange-500 to-red-500 p-5 text-white sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-100 sm:text-base">
                Current Streak
              </p>
              <p className="text-2xl font-bold sm:text-3xl">
                {userStats?.currentStreak || 0}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <Badge
                type="streak"
                level={getStreakBadgeLevel(userStats?.currentStreak || 0)}
                size="lg"
              />
              <span className="text-xl sm:text-2xl">🔥</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-orange-100 sm:text-sm">
            {userStats?.currentStreak === 1 ? "day" : "days"} in a row
          </p>
        </div>

        {/* Quiz Progress Card */}
        <div className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 p-5 text-white sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100 sm:text-base">
                Quizzes Completed
              </p>
              <p className="text-2xl font-bold sm:text-3xl">
                {userStats?.totalQuizzes || 0}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <Badge
                type="quiz"
                level={getQuizBadgeLevel(userStats?.totalQuizzes || 0)}
                size="lg"
              />
              <span className="text-xl sm:text-2xl">📚</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-green-100 sm:text-sm">
            Avg: {userStats?.averageScore || 0}% score
          </p>
        </div>

        {/* Weekly Progress Card */}
        <div className="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 p-5 text-white sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-100 sm:text-base">This Week</p>
              <p className="text-2xl font-bold sm:text-3xl">
                {userStats?.weeklyPoints || 0}
              </p>
            </div>
            <div className="text-3xl sm:text-4xl">⚡</div>
          </div>
          <p className="mt-2 text-xs text-purple-100 sm:text-sm">
            Points earned
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2 lg:space-y-8">
          {/* Test Countdown */}
          {userProfile?.test_date && (
            <TestCountdown testDate={userProfile.test_date} />
          )}

          {/* Learning Progress */}
          <LearningProgress />

          {/* Achievements Section */}
          <div className="rounded-lg bg-white px-4 py-5 shadow-md sm:p-6">
            <h3 className="mb-4 flex items-center text-base font-semibold text-gray-900 sm:text-lg">
              🏅 Recent Achievements
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
              {userStats?.currentStreak && userStats.currentStreak >= 7 && (
                <div className="rounded-lg bg-orange-50 p-4 text-center">
                  <Badge
                    type="streak"
                    level="silver"
                    size="lg"
                    className="mx-auto mb-2"
                  />
                  <p className="text-sm font-medium text-gray-800">
                    Week Warrior
                  </p>
                  <p className="text-xs text-gray-600">7-day streak</p>
                </div>
              )}

              {userStats?.totalQuizzes && userStats.totalQuizzes >= 10 && (
                <div className="rounded-lg bg-green-50 p-4 text-center">
                  <Badge
                    type="quiz"
                    level="silver"
                    size="lg"
                    className="mx-auto mb-2"
                  />
                  <p className="text-sm font-medium text-gray-800">
                    Quiz Explorer
                  </p>
                  <p className="text-xs text-gray-600">10 quizzes</p>
                </div>
              )}

              {userStats?.perfectScores && userStats.perfectScores >= 1 && (
                <div className="rounded-lg bg-yellow-50 p-4 text-center">
                  <Badge
                    type="perfect"
                    level="gold"
                    size="lg"
                    className="mx-auto mb-2"
                  />
                  <p className="text-sm font-medium text-gray-800">
                    Perfectionist
                  </p>
                  <p className="text-xs text-gray-600">Perfect score</p>
                </div>
              )}

              {userStats?.averageScore && userStats.averageScore >= 90 && (
                <div className="rounded-lg bg-blue-50 p-4 text-center">
                  <Badge
                    type="score"
                    level="gold"
                    size="lg"
                    className="mx-auto mb-2"
                  />
                  <p className="text-sm font-medium text-gray-800">
                    High Achiever
                  </p>
                  <p className="text-xs text-gray-600">90%+ average</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 sm:space-y-8">
          {/* Regional Leaderboard */}
          <RegionalLeaderboard
            userCountry={userProfile?.country || undefined}
            userRegion={userProfile?.region || undefined}
          />

          {/* Quick Stats */}
          <div className="rounded-lg bg-white px-4 py-5 shadow-md sm:p-6">
            <h3 className="mb-4 text-base font-semibold text-gray-900 sm:text-lg">
              📈 Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-600">Perfect Scores</span>
                <span className="font-semibold text-yellow-600">
                  ⭐ {userStats?.perfectScores || 0}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-600">Study Time</span>
                <span className="font-semibold text-blue-600">
                  📚 {userStats?.studyTime || "0h"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-600">Average Score</span>
                <span
                  className={`font-semibold ${
                    (userStats?.averageScore || 0) >= 90
                      ? "text-green-600"
                      : (userStats?.averageScore || 0) >= 80
                        ? "text-blue-600"
                        : (userStats?.averageScore || 0) >= 70
                          ? "text-yellow-600"
                          : "text-red-600"
                  }`}
                >
                  {userStats?.averageScore || 0}%
                </span>
              </div>

              {userProfile?.last_active && (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-600">Last Active</span>
                  <span className="font-semibold text-gray-700">
                    {userProfile.last_active}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
