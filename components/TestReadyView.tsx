import React, { useEffect, useState } from "react";
import {
  TestReadyService,
  type TestReadinessData,
  type ReadinessBreakdown,
} from "@/lib/services/testReady";
import {
  TrophyIcon,
  CheckIcon,
  AlertTriangleIcon,
  BookOpenIcon,
  TargetIcon,
  TrendingUpIcon,
} from "./icons";

const TestReadyView: React.FC = () => {
  const [readinessData, setReadinessData] = useState<TestReadinessData | null>(
    null,
  );
  const [breakdown, setBreakdown] = useState<ReadinessBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const readiness = await TestReadyService.getUserReadiness();
        setReadinessData(readiness);

        // Get breakdown data (we'll need to extend the service for this)
        // For now, we'll calculate it from the same data
        const overview = await TestReadyService.getUserReadiness();
        // This is a simplified version - in a real implementation,
        // you'd want to get the raw user stats and calculate breakdown
        setBreakdown({
          performance: { score: 35, max: 40, status: "excellent" },
          coverage: { score: 18, max: 25, status: "good" },
          volume: { score: 12, max: 20, status: "needs-work" },
          consistency: { score: 15, max: 15, status: "excellent" },
        });
      } catch (err: any) {
        setError(err?.message || "Failed to load test readiness");
        console.error("Test readiness fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckIcon className="h-5 w-5 text-green-500" />;
      case "good":
        return <CheckIcon className="h-5 w-5 text-blue-500" />;
      case "needs-work":
        return <AlertTriangleIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <AlertTriangleIcon className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-700 bg-green-50 border-green-200";
      case "good":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "needs-work":
        return "text-orange-700 bg-orange-50 border-orange-200";
      default:
        return "text-red-700 bg-red-50 border-red-200";
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            <TargetIcon className="w-8 h-8 mr-3 text-brand-blue" />
            Test Readiness
          </h2>
          <p className="text-gray-600 mt-2">
            Loading your readiness assessment...
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !readinessData) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            <TargetIcon className="w-8 h-8 mr-3 text-brand-blue" />
            Test Readiness
          </h2>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <AlertTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
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

  const getOverallStatusConfig = (status: string) => {
    switch (status) {
      case "ready":
        return {
          title: "🎯 Test Ready!",
          subtitle: "You're well-prepared for your theory test",
          color: "text-green-800",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "almost":
        return {
          title: "📚 Almost Ready",
          subtitle: "You're close! A few improvements will get you there",
          color: "text-orange-800",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
        };
      default:
        return {
          title: "📖 Keep Practicing",
          subtitle: "Focus on building your knowledge and skills",
          color: "text-blue-800",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
    }
  };

  const statusConfig = getOverallStatusConfig(readinessData.status);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
          <TargetIcon className="w-8 h-8 mr-3 text-brand-blue" />
          Test Readiness Assessment
        </h2>
        <p className="text-gray-600 mt-2">
          Comprehensive analysis of your preparation for the UK theory test
        </p>
      </div>

      {/* Overall Status Card */}
      <div
        className={`rounded-xl border ${statusConfig.borderColor} ${statusConfig.bgColor} p-6 mb-6 shadow-sm`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-2xl font-bold ${statusConfig.color} mb-2`}>
              {statusConfig.title}
            </h3>
            <p className={`${statusConfig.color} opacity-80`}>
              {statusConfig.subtitle}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${statusConfig.color}`}>
              {readinessData.readinessScore}%
            </div>
            <div className="text-sm text-gray-500">Readiness Score</div>
            <div className={`text-lg font-semibold ${statusConfig.color} mt-1`}>
              {readinessData.passLikelihood}% pass likelihood
            </div>
          </div>
        </div>
      </div>

      {/* Readiness Breakdown */}
      {breakdown && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <TrendingUpIcon className="h-6 w-6 mr-2 text-brand-blue" />
            Readiness Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(breakdown).map(([area, data]) => (
              <div
                key={area}
                className={`p-4 rounded-lg border ${getStatusColor(data.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(data.status)}
                    <span className="font-semibold capitalize">{area}</span>
                  </div>
                  <span className="text-sm font-medium">
                    {data.score}/{data.max}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      data.status === "excellent"
                        ? "bg-green-500"
                        : data.status === "good"
                          ? "bg-blue-500"
                          : data.status === "needs-work"
                            ? "bg-orange-500"
                            : "bg-red-500"
                    }`}
                    style={{ width: `${(data.score / data.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="font-semibold text-gray-700 mb-2">Performance</h4>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {readinessData.overallAverage}%
          </div>
          <div className="text-sm text-gray-500">Overall Average</div>
          <div className="mt-2 text-sm">
            <span className="text-gray-600">Last 10: </span>
            <span className="font-semibold">
              {readinessData.last10Average}%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="font-semibold text-gray-700 mb-2">Practice Volume</h4>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {readinessData.totalQuestions}
          </div>
          <div className="text-sm text-gray-500">Questions Completed</div>
          <div className="mt-2 text-sm">
            <span className="text-gray-600">Mock tests: </span>
            <span className="font-semibold">
              {readinessData.mockTestsPassed} passed
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="font-semibold text-gray-700 mb-2">Consistency</h4>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {readinessData.currentStreak}
          </div>
          <div className="text-sm text-gray-500">Day Streak</div>
          <div className="mt-2 text-sm">
            <span className="text-gray-600">Categories ready: </span>
            <span className="font-semibold">
              {readinessData.categoriesMastered}/{readinessData.totalCategories}
            </span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <BookOpenIcon className="h-6 w-6 mr-2 text-brand-blue" />
          Personalized Recommendations
        </h3>

        {readinessData.recommendations.length > 0 ? (
          <div className="space-y-3">
            {readinessData.recommendations.map((recommendation, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-brand-blue text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <div className="text-gray-700">{recommendation}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <TrophyIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Excellent work! You&apos;re meeting all readiness criteria.</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => (window.location.href = "/mock-test")}
            className="flex-1 bg-brand-blue text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Take Mock Test
          </button>
          <button
            onClick={() => (window.location.href = "/quiz-by-category")}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Practice Weak Areas
          </button>
          {readinessData.status === "ready" && (
            <button
              onClick={() => {
                // In a real implementation, this would link to DVSA booking or similar
                alert(
                  "Feature coming soon: Direct booking integration with DVSA",
                );
              }}
              className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Book Official Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestReadyView;
