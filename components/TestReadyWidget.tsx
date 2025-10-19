import React, { useEffect, useState } from "react";
import {
  TestReadyService,
  type TestReadinessData,
} from "@/lib/services/testReady";
import {
  TrophyIcon,
  CheckIcon,
  AlertTriangleIcon,
  BookOpenIcon,
} from "./icons";

interface TestReadyWidgetProps {
  onViewDetails?: () => void;
}

const TestReadyWidget: React.FC<TestReadyWidgetProps> = ({ onViewDetails }) => {
  const [readinessData, setReadinessData] = useState<TestReadinessData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReadiness = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await TestReadyService.getUserReadiness();
        setReadinessData(data);
      } catch (err: any) {
        setError(err?.message || "Failed to load test readiness");
        console.error("Test readiness fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReadiness();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200/70 bg-white p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !readinessData) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangleIcon className="h-5 w-5 text-red-500" />
          <h3 className="font-semibold text-red-800">
            Unable to Load Test Readiness
          </h3>
        </div>
        <p className="text-sm text-red-600 mb-4">
          {error ||
            "Complete some practice questions to see your readiness status."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ready":
        return {
          icon: TrophyIcon,
          title: "Test Ready! 🎯",
          subtitle: "You're prepared for your theory test",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          iconColor: "text-green-600",
          textColor: "text-green-800",
          buttonColor: "bg-green-600 hover:bg-green-700",
        };
      case "almost":
        return {
          icon: BookOpenIcon,
          title: "Almost Ready 📚",
          subtitle: "A few more practice sessions should do it",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          iconColor: "text-orange-600",
          textColor: "text-orange-800",
          buttonColor: "bg-orange-600 hover:bg-orange-700",
        };
      default:
        return {
          icon: BookOpenIcon,
          title: "Keep Practicing 📖",
          subtitle: "Build your knowledge with more practice",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          iconColor: "text-blue-600",
          textColor: "text-blue-800",
          buttonColor: "bg-blue-600 hover:bg-blue-700",
        };
    }
  };

  const statusConfig = getStatusConfig(readinessData.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div
      className={`rounded-xl border ${statusConfig.borderColor} ${statusConfig.bgColor} p-6 shadow-sm transition-all duration-300 hover:shadow-md`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${statusConfig.bgColor} border ${statusConfig.borderColor}`}
          >
            <StatusIcon className={`h-6 w-6 ${statusConfig.iconColor}`} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${statusConfig.textColor}`}>
              {statusConfig.title}
            </h3>
            <p className={`text-sm ${statusConfig.textColor} opacity-80`}>
              {statusConfig.subtitle}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${statusConfig.textColor}`}>
            {readinessData.readinessScore}%
          </div>
          <div className="text-xs text-gray-500">Readiness Score</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progress to Test Ready
          </span>
          <span className="text-sm text-gray-500">
            {readinessData.readinessScore}/85
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              readinessData.status === "ready"
                ? "bg-green-500"
                : readinessData.status === "almost"
                  ? "bg-orange-500"
                  : "bg-blue-500"
            }`}
            style={{
              width: `${Math.min(100, (readinessData.readinessScore / 85) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-800">
            {readinessData.passLikelihood}%
          </div>
          <div className="text-xs text-gray-500">Pass Likelihood</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-800">
            {readinessData.categoriesMastered}/{readinessData.totalCategories}
          </div>
          <div className="text-xs text-gray-500">Categories Ready</div>
        </div>
      </div>

      {/* Top Recommendation */}
      {readinessData.recommendations.length > 0 && (
        <div className="mb-4 p-3 bg-white/50 rounded-lg border border-white/50">
          <div className="flex items-start gap-2">
            <CheckIcon className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">
                Next Step:
              </div>
              <div className="text-sm text-gray-600">
                {readinessData.recommendations[0]}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className={`flex-1 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${statusConfig.buttonColor}`}
          >
            View Details
          </button>
        )}
        <button
          onClick={() => {
            // Navigate to appropriate practice based on status
            if (readinessData.status === "ready") {
              window.location.href = "/mock-test";
            } else if (readinessData.weakestCategory) {
              window.location.href = "/quiz-by-category";
            } else {
              window.location.href = "/modules";
            }
          }}
          className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          {readinessData.status === "ready" ? "Take Mock Test" : "Practice Now"}
        </button>
      </div>

      {/* Test Ready Badge */}
      {readinessData.status === "ready" && (
        <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-green-800">
                🎉 Congratulations! You&apos;re Test Ready!
              </div>
              <div className="text-xs text-green-600 mt-1">
                Consider booking your official theory test
              </div>
            </div>
            <button className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition-colors">
              Book Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestReadyWidget;
