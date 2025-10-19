import React, { useState, useEffect } from "react";
import { ProgressService } from "@/lib/services/progress";

interface LearningProgressProps {
  userId?: string;
  className?: string;
}

interface ProgressData {
  overallCompletion: number;
  categoryProgress: Array<{
    category: string;
    completion: number;
    points: number;
    weakAreas: string[];
  }>;
  recommendations: string[];
  nextSteps: string[];
}

const LearningProgress: React.FC<LearningProgressProps> = ({
  userId,
  className = "",
}) => {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);

        // Mock data for now - in real implementation, this would come from an API
        const mockData: ProgressData = {
          overallCompletion: 67,
          categoryProgress: [
            {
              category: "Highway Code",
              completion: 85,
              points: 340,
              weakAreas: ["Road markings", "Traffic signs"],
            },
            {
              category: "Vehicle Safety",
              completion: 72,
              points: 288,
              weakAreas: ["Tyre safety", "Vehicle checks"],
            },
            {
              category: "Hazard Perception",
              completion: 45,
              points: 180,
              weakAreas: ["Pedestrian hazards", "Weather conditions"],
            },
            {
              category: "Driving Theory",
              completion: 58,
              points: 232,
              weakAreas: ["Stopping distances", "Speed limits"],
            },
          ],
          recommendations: [
            "Focus on Hazard Perception - your weakest area",
            "Practice more speed limit questions",
            "Review stopping distance calculations",
            "Take more practice tests on weather conditions",
          ],
          nextSteps: [
            "Complete Hazard Perception module",
            "Take 5 more practice tests",
            "Review weak areas identified",
            "Schedule mock test when ready",
          ],
        };

        setProgressData(mockData);
      } catch (error) {
        console.error("Learning progress error:", error);
        setProgressData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [userId]);

  const getCompletionColor = (completion: number) => {
    if (completion >= 80) return "bg-green-500";
    if (completion >= 60) return "bg-blue-500";
    if (completion >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getCompletionTextColor = (completion: number) => {
    if (completion >= 80) return "text-green-600";
    if (completion >= 60) return "text-blue-600";
    if (completion >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <p>Unable to load learning progress</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          📊 Learning Progress
        </h3>

        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Overall Completion
            </span>
            <span
              className={`text-sm font-bold ${getCompletionTextColor(progressData.overallCompletion)}`}
            >
              {progressData.overallCompletion}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${getCompletionColor(progressData.overallCompletion)}`}
              style={{ width: `${progressData.overallCompletion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Progress */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-3">
          Category Breakdown
        </h4>
        <div className="space-y-4">
          {progressData.categoryProgress.map((category, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">
                  {category.category}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {category.points} pts
                  </span>
                  <span
                    className={`text-sm font-bold ${getCompletionTextColor(category.completion)}`}
                  >
                    {category.completion}%
                  </span>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getCompletionColor(category.completion)}`}
                  style={{ width: `${category.completion}%` }}
                />
              </div>

              {category.weakAreas.length > 0 && (
                <div className="mt-2">
                  <span className="text-xs text-red-600 font-medium">
                    Weak areas:{" "}
                  </span>
                  <span className="text-xs text-gray-600">
                    {category.weakAreas.join(", ")}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-4">
        <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
          💡 Recommendations
        </h4>
        <ul className="space-y-2">
          {progressData.recommendations.map((rec, index) => (
            <li
              key={index}
              className="flex items-start space-x-2 text-sm text-gray-700"
            >
              <span className="text-blue-500 mt-1">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Next Steps */}
      <div>
        <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
          🎯 Next Steps
        </h4>
        <ul className="space-y-2">
          {progressData.nextSteps.map((step, index) => (
            <li
              key={index}
              className="flex items-start space-x-2 text-sm text-gray-700"
            >
              <span className="text-green-500 mt-1">✓</span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LearningProgress;
