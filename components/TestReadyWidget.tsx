import React, { useEffect, useId, useMemo, useState } from "react";

import {
  TestReadyService,
  type TestReadinessData,
} from "@/lib/services/testReady";
import {
  TrophyIcon,
  CheckIcon,
  AlertTriangleIcon,
  BookOpenIcon,
  StarIcon,
} from "./icons";

interface TestReadyWidgetProps {}

const READINESS_TARGET = 85;

type StatusThemeKey = TestReadinessData["status"];

const STATUS_THEMES: Record<
  StatusThemeKey,
  {
    accentText: string;
    accentSoft: string;
    accentBorder: string;
    cta: string;
    ctaHover: string;
    ringGradient: [string, string];
    badgeGradient: string;
  }
> = {
  ready: {
    accentText: "text-emerald-700",
    accentSoft: "bg-emerald-500/10 text-emerald-800",
    accentBorder: "border-emerald-200",
    cta: "bg-emerald-500",
    ctaHover: "hover:bg-emerald-600",
    ringGradient: ["#059669", "#34d399"],
    badgeGradient: "bg-gradient-to-r from-emerald-500 to-emerald-400",
  },
  almost: {
    accentText: "text-amber-700",
    accentSoft: "bg-amber-400/15 text-amber-700",
    accentBorder: "border-amber-200",
    cta: "bg-amber-500",
    ctaHover: "hover:bg-amber-600",
    ringGradient: ["#f59e0b", "#f97316"],
    badgeGradient: "bg-gradient-to-r from-amber-500 to-amber-400",
  },
  preparing: {
    accentText: "text-blue-700",
    accentSoft: "bg-blue-500/10 text-blue-700",
    accentBorder: "border-blue-200",
    cta: "bg-brand-blue",
    ctaHover: "hover:bg-blue-700",
    ringGradient: ["#2563eb", "#60a5fa"],
    badgeGradient: "bg-gradient-to-r from-blue-500 to-sky-400",
  },
};

const clampPercentage = (value: number) =>
  Math.min(100, Math.max(0, Math.round(value)));

const readinessStatusCopy: Record<
  StatusThemeKey,
  { title: string; subtitle: string; trophyCopy: string }
> = {
  ready: {
    title: "Test Ready!",
    subtitle: "You have met every readiness milestone – amazing work.",
    trophyCopy: "Celebrate by booking your official test date.",
  },
  almost: {
    title: "Almost Ready",
    subtitle:
      "You are inches away from the finish line. Focus on the highlighted actions to level up.",
    trophyCopy: "Close the gap with one more focused practice sprint.",
  },
  preparing: {
    title: "Keep Building",
    subtitle:
      "Solid foundations. Keep practicing daily and watch your readiness soar.",
    trophyCopy: "Stay consistent to unlock the Test Ready badge.",
  },
};

const formatStudyHours = (hours: number) => {
  if (Number.isNaN(hours) || hours <= 0) return "0h";
  const safeHours = Math.max(0, hours);
  let whole = Math.floor(safeHours);
  let minutes = Math.round((safeHours - whole) * 60);
  if (minutes === 60) {
    whole += 1;
    minutes = 0;
  }
  return minutes > 0 ? `${whole}h ${minutes}m` : `${whole}h`;
};

const SkeletonCard = () => (
  <div className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white p-6 shadow-sm">
    <div className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-gray-200/30 to-transparent" />
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-7 w-32 rounded-full bg-gray-200" />
        <div className="h-10 w-10 rounded-full bg-gray-200" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-20 rounded-xl bg-gray-100" />
        <div className="h-20 rounded-xl bg-gray-100" />
      </div>
      <div className="h-12 rounded-xl bg-gray-100" />
    </div>
  </div>
);

const CircularProgress: React.FC<{
  value: number;
  target?: number;
  theme: (typeof STATUS_THEMES)[StatusThemeKey];
}> = ({ value, target = READINESS_TARGET, theme }) => {
  const id = useId();
  const size = 150;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = clampPercentage(value);
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} role="presentation">
        <defs>
          <linearGradient
            id={`progress-${id}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={theme.ringGradient[0]} />
            <stop offset="100%" stopColor={theme.ringGradient[1]} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#progress-${id})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.9s ease, stroke 0.3s ease",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-gray-900">{progress}%</span>
        <span className="text-xs uppercase tracking-wide text-gray-500">
          Readiness
        </span>
      </div>
      {typeof target === "number" && (
        <div className="absolute -bottom-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm ring-1 ring-gray-100">
          Target {target}%
        </div>
      )}
    </div>
  );
};

const AchievementBadge: React.FC<{
  unlocked: boolean;
  label: string;
  detail: string;
}> = ({ unlocked, label, detail }) => (
  <div
    className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-sm transition-all ${
      unlocked
        ? "border-emerald-200/70 bg-emerald-50/70 text-emerald-700"
        : "border-gray-200 bg-gray-50/80 text-gray-600"
    }`}
  >
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-full ${
        unlocked
          ? "bg-emerald-500/20 text-emerald-600"
          : "bg-gray-200 text-gray-500"
      }`}
    >
      <StarIcon className="h-4 w-4" />
    </div>
    <div className="flex flex-col">
      <span className="font-semibold">{label}</span>
      <span className="text-xs text-gray-500">{detail}</span>
    </div>
  </div>
);

const MetricCard: React.FC<{
  label: string;
  value: string;
  helper: string;
  highlighted?: boolean;
}> = ({ label, value, helper, highlighted = false }) => (
  <div
    className={`flex h-full flex-col justify-between rounded-xl border bg-white/70 p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
      highlighted ? "border-brand-blue/40" : "border-gray-200"
    }`}
  >
    <div className="text-sm font-medium text-gray-500">{label}</div>
    <div className="mt-3 text-2xl font-bold text-gray-900">{value}</div>
    <div className="mt-1 text-xs text-gray-500">{helper}</div>
  </div>
);

const TestReadyWidget: React.FC<TestReadyWidgetProps> = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readinessData, setReadinessData] = useState<TestReadinessData | null>(
    null,
  );

  useEffect(() => {
    let isMounted = true;

    const fetchReadiness = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await TestReadyService.getUserReadiness();
        if (!isMounted) return;
        setReadinessData(data);
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.message || "Failed to load test readiness");
        console.error("Test readiness fetch error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReadiness();

    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate memoized values before any early returns (Rules of Hooks)
  const achievementData = useMemo(
    () =>
      readinessData
        ? [
            {
              unlocked: readinessData.categoriesFullyMastered >= 12,
              label: "Category Champion",
              detail: `${readinessData.categoriesFullyMastered}/14 categories mastered`,
            },
            {
              unlocked: readinessData.studyDaysLast2Weeks >= 10,
              label: "Consistency Hero",
              detail: `${readinessData.studyDaysLast2Weeks}/14 active days recently`,
            },
            {
              unlocked: readinessData.recentAccuracy >= 80,
              label: "Accuracy Ace",
              detail: `${clampPercentage(readinessData.recentAccuracy)}% recent accuracy`,
            },
          ]
        : [],
    [readinessData],
  );

  const metricHighlights = useMemo(
    () =>
      readinessData
        ? [
            {
              label: "Pass likelihood",
              value: `${clampPercentage(readinessData.passLikelihood)}%`,
              helper: "Projected based on the last 30 days",
              highlighted: readinessData.status === "ready",
            },
            {
              label: "Module depth",
              value: `${readinessData.modulesCompleted}/${readinessData.totalModules}`,
              helper: "Modules completed",
              highlighted:
                readinessData.modulesCompleted / readinessData.totalModules >=
                0.7,
            },
            {
              label: "Study momentum",
              value: formatStudyHours(readinessData.studyTimeHours),
              helper: "Total guided study time",
              highlighted: readinessData.studyTimeHours >= 20,
            },
            {
              label: "Questions explored",
              value: readinessData.uniqueQuestionsAttempted.toLocaleString(),
              helper: "Unique questions answered",
              highlighted: readinessData.uniqueQuestionsAttempted >= 600,
            },
          ]
        : [],
    [readinessData],
  );

  if (loading) {
    return <SkeletonCard />;
  }

  if (error || !readinessData) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <div className="mb-3 flex items-center gap-3">
          <AlertTriangleIcon
            className="h-5 w-5 text-red-500"
            aria-hidden="true"
          />
          <h3 className="font-semibold text-red-800">
            Unable to load readiness stats
          </h3>
        </div>
        <p className="mb-4 text-sm text-red-600">
          {error ||
            "Complete a few practice sessions to unlock your readiness dashboard."}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    );
  }

  const theme = STATUS_THEMES[readinessData.status];
  const statusCopy = readinessStatusCopy[readinessData.status];

  const recommendedAction = readinessData.recommendations[0];
  const weakestCategory = readinessData.weakestCategories?.[0];

  const handlePracticeCta = () => {
    window.location.href = "/mock-test";
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Compact View with Details */}
      <div className="space-y-4">
        {/* Header with Score */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <CircularProgress
                value={readinessData.readinessScore}
                theme={theme}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-current"
                  aria-hidden="true"
                />
                Personalised readiness overview
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-6 leading-snug">
                {statusCopy.trophyCopy}
              </p>
              <div className="flex gap-6 text-base">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-2">
                    Pass likelihood
                  </span>
                  <span className={`text-3xl font-bold ${theme.accentText}`}>
                    {clampPercentage(readinessData.passLikelihood)}%
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-2">
                    Module depth
                  </span>
                  <span className="text-3xl font-bold text-gray-900">
                    {readinessData.modulesCompleted}/
                    {readinessData.totalModules}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-2">Study time</span>
                  <span className="text-3xl font-bold text-gray-900">
                    {formatStudyHours(readinessData.studyTimeHours)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex gap-3 pt-6">
          <button
            type="button"
            onClick={handlePracticeCta}
            className={`w-full rounded-lg px-6 py-3 text-base font-semibold text-white shadow-md transition-all ${theme.cta} ${theme.ctaHover}`}
          >
            Practice now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestReadyWidget;
