import React, { useState, useEffect } from "react";

interface TestCountdownProps {
  testDate: string | null;
  className?: string;
}

const TestCountdown: React.FC<TestCountdownProps> = ({
  testDate,
  className = "",
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    isOverdue: boolean;
  } | null>(null);

  useEffect(() => {
    if (!testDate) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const testDateTime = new Date(testDate).getTime();
      const difference = testDateTime - now;

      if (difference < 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          isOverdue: true,
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        isOverdue: false,
      };
    };

    // Calculate immediately
    setTimeLeft(calculateTimeLeft());

    // Update every minute
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);

    return () => clearInterval(timer);
  }, [testDate]);

  if (!testDate || !timeLeft) {
    return null;
  }

  const getReadinessLevel = () => {
    if (timeLeft.isOverdue) return "overdue";
    if (timeLeft.days <= 7) return "urgent";
    if (timeLeft.days <= 30) return "soon";
    return "plenty";
  };

  const readinessLevel = getReadinessLevel();

  const getReadinessColor = () => {
    switch (readinessLevel) {
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      case "urgent":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "soon":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const getReadinessMessage = () => {
    if (timeLeft.isOverdue) return "Test date has passed";
    if (timeLeft.days === 0) return "Test is today!";
    if (timeLeft.days === 1) return "Test is tomorrow!";
    if (timeLeft.days <= 7) return "Final week - time to review!";
    if (timeLeft.days <= 30) return "Test approaching - keep practicing!";
    return "Plenty of time to prepare";
  };

  const getCountdownIcon = () => {
    switch (readinessLevel) {
      case "overdue":
        return "⏰";
      case "urgent":
        return "🚨";
      case "soon":
        return "⚡";
      default:
        return "🎯";
    }
  };

  return (
    <div
      className={`rounded-lg border p-4 ${getReadinessColor()} ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getCountdownIcon()}</span>
          <div>
            <h3 className="font-semibold text-sm">Driving Test</h3>
            <p className="text-xs opacity-75">
              {new Date(testDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="text-right">
          {timeLeft.isOverdue ? (
            <div className="text-lg font-bold">Overdue</div>
          ) : (
            <div className="text-lg font-bold">
              {timeLeft.days > 0 && `${timeLeft.days}d `}
              {(timeLeft.days < 7 || timeLeft.days === 0) &&
                `${timeLeft.hours}h `}
              {timeLeft.days === 0 && `${timeLeft.minutes}m`}
            </div>
          )}
          <div className="text-xs opacity-75">{getReadinessMessage()}</div>
        </div>
      </div>

      {/* Progress bar for days remaining */}
      {!timeLeft.isOverdue && timeLeft.days <= 90 && (
        <div className="mt-3">
          <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.max(5, Math.min(100, ((90 - timeLeft.days) / 90) * 100))}%`,
                backgroundColor:
                  readinessLevel === "urgent"
                    ? "#f97316"
                    : readinessLevel === "soon"
                      ? "#eab308"
                      : "#22c55e",
              }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1 opacity-75">
            <span>Started</span>
            <span>Test Day</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCountdown;
