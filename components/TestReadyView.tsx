import React, { useEffect, useMemo, useState, useId } from "react";

import {
  TestReadyService,
  type TestReadinessData,
} from "@/lib/services/testReady";
import {
  TargetIcon,
  TrophyIcon,
  AlertTriangleIcon,
  CheckIcon,
  BookOpenIcon,
  AcademicCapIcon,
  TrendingUpIcon,
  StarIcon,
  ClipboardListIcon,
} from "./icons";

const READINESS_TARGET = 85;

type StatusKey = TestReadinessData["status"];

const clampPercentage = (value: number) =>
  Math.min(100, Math.max(0, Math.round(value)));

const STATUS_THEMES: Record<
  StatusKey,
  {
    gradient: string;
    border: string;
    accent: string;
    lightAccent: string;
    badge: string;
  }
> = {
  ready: {
    gradient:
      "bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-emerald-600/10",
    border: "border-emerald-200",
    accent: "text-emerald-700",
    lightAccent: "bg-emerald-500/10 text-emerald-700",
    badge: "bg-gradient-to-r from-emerald-500 to-emerald-400",
  },
  almost: {
    gradient:
      "bg-gradient-to-br from-amber-400/20 via-amber-300/15 to-amber-200/10",
    border: "border-amber-200",
    accent: "text-amber-700",
    lightAccent: "bg-amber-400/10 text-amber-700",
    badge: "bg-gradient-to-r from-amber-500 to-amber-400",
  },
  preparing: {
    gradient:
      "bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-blue-200/10",
    border: "border-blue-200",
    accent: "text-blue-700",
    lightAccent: "bg-blue-500/10 text-blue-700",
    badge: "bg-gradient-to-r from-blue-500 to-sky-400",
  },
};

type AreaStatus = "excellent" | "strong" | "growing" | "focus";

const getAreaStatus = (percent: number): AreaStatus => {
  if (percent >= 85) return "excellent";
  if (percent >= 70) return "strong";
  if (percent >= 50) return "growing";
  return "focus";
};

const AREA_STATUS_THEME: Record<
  AreaStatus,
  {
    label: string;
    chip: string;
    tone: string;
  }
> = {
  excellent: {
    label: "Excellent",
    chip: "border-emerald-200 bg-emerald-50 text-emerald-700",
    tone: "text-emerald-600",
  },
  strong: {
    label: "Strong",
    chip: "border-blue-200 bg-blue-50 text-blue-700",
    tone: "text-blue-600",
  },
  growing: {
    label: "In Progress",
    chip: "border-amber-200 bg-amber-50 text-amber-700",
    tone: "text-amber-600",
  },
  focus: {
    label: "Needs Focus",
    chip: "border-rose-200 bg-rose-50 text-rose-700",
    tone: "text-rose-600",
  },
};

const AREA_META = {
  knowledgeMastery: {
    label: "Knowledge Mastery",
    description: "Category coverage & accuracy",
    icon: BookOpenIcon,
    gradient: ["#6366f1", "#8b5cf6"] as [string, string],
  },
  learningDepth: {
    label: "Learning Depth",
    description: "Module completion & study time",
    icon: AcademicCapIcon,
    gradient: ["#ec4899", "#f472b6"] as [string, string],
  },
  practiceQuality: {
    label: "Practice Quality",
    description: "Question volume & perfect scores",
    icon: ClipboardListIcon,
    gradient: ["#f97316", "#fb923c"] as [string, string],
  },
  consistency: {
    label: "Consistency",
    description: "Study frequency & retention",
    icon: TrendingUpIcon,
    gradient: ["#0ea5e9", "#38bdf8"] as [string, string],
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

const CircularProgress: React.FC<{
  value: number;
  gradient: [string, string];
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  showTarget?: boolean;
  target?: number;
}> = ({
  value,
  gradient,
  size = 180,
  strokeWidth = 14,
  label,
  sublabel,
  showTarget = false,
  target = READINESS_TARGET,
}) => {
  const id = useId();
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
          <linearGradient id={`ring-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradient[0]} />
            <stop offset="100%" stopColor={gradient[1]} />
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
          stroke={`url(#ring-${id})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.9s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-black text-gray-900">{progress}%</span>
        {label && (
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {label}
          </span>
        )}
        {sublabel && <span className="text-xs text-gray-400">{sublabel}</span>}
      </div>
      {showTarget && (
        <div className="absolute -bottom-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm ring-1 ring-gray-100">
          Target {target}%
        </div>
      )}
    </div>
  );
};

const LoadingState = () => (
  <div className="mx-auto flex max-w-5xl flex-col gap-6">
    <div className="animate-pulse rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-4 h-6 w-1/3 rounded-full bg-gray-200" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-48 rounded-2xl bg-gray-100" />
        <div className="space-y-3">
          <div className="h-4 rounded-full bg-gray-200" />
          <div className="h-4 rounded-full bg-gray-200" />
          <div className="h-4 rounded-full bg-gray-200" />
          <div className="h-20 rounded-2xl bg-gray-100" />
        </div>
      </div>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      {[...Array(4)].map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-3 h-5 w-1/2 rounded-full bg-gray-200" />
          <div className="h-24 rounded-xl bg-gray-100" />
        </div>
      ))}
    </div>
  </div>
);

const TestReadyView: React.FC = () => {
  const [readinessData, setReadinessData] = useState<TestReadinessData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const readiness = await TestReadyService.getUserReadiness();
        if (!isMounted) return;
        setReadinessData(readiness);
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

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !readinessData) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-10 text-center shadow-sm">
        <AlertTriangleIcon
          className="mx-auto mb-4 h-10 w-10 text-red-500"
          aria-hidden="true"
        />
        <h2 className="mb-2 text-2xl font-bold text-red-700">
          We couldn&apos;t load your readiness
        </h2>
        <p className="mb-6 text-sm text-red-600">
          {error ||
            "Try refreshing the page or completing a study session to unlock insights."}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          Refresh
        </button>
      </div>
    );
  }

  const theme = STATUS_THEMES[readinessData.status];
  const readinessPercent = clampPercentage(readinessData.readinessScore);
  const passLikelihood = clampPercentage(readinessData.passLikelihood);

  const breakdownCards = (
    Object.keys(AREA_META) as Array<keyof typeof AREA_META>
  ).map((key) => {
    const metrics = readinessData.breakdown[key];
    const percent = metrics?.max
      ? clampPercentage((metrics.score / metrics.max) * 100)
      : 0;
    const status = getAreaStatus(percent);
    const meta = AREA_META[key];
    const StatusIcon = meta.icon;

    return {
      key,
      percent,
      status,
      meta,
      StatusIcon,
      detail: `${metrics?.score ?? 0}/${metrics?.max ?? 0} points`,
    };
  });

  const studyMilestones = [
    {
      label: "Active days",
      value: `${readinessData.studyDaysLast2Weeks}/14`,
      percent: clampPercentage((readinessData.studyDaysLast2Weeks / 14) * 100),
      helper: "Last 14 days",
    },
    {
      label: "Session length",
      value: `${Math.round(readinessData.averageSessionMinutes)}m`,
      percent: clampPercentage(
        (readinessData.averageSessionMinutes / 30) * 100,
      ),
      helper: "Average focus session",
    },
    {
      label: "Knowledge retention",
      value: `${clampPercentage(readinessData.knowledgeRetentionRate)}%`,
      percent: clampPercentage(readinessData.knowledgeRetentionRate),
      helper: "From spaced repetition",
    },
    {
      label: "Last activity",
      value: `${readinessData.daysSinceLastActivity}d ago`,
      percent: clampPercentage(
        Math.max(0, 100 - readinessData.daysSinceLastActivity * 15),
      ),
      helper: "Lower is better",
    },
  ];

  const practiceInsights = [
    {
      label: "Unique questions",
      value: readinessData.uniqueQuestionsAttempted.toLocaleString(),
      helper: "Across all categories",
    },
    {
      label: "Perfect score rate",
      value: `${clampPercentage(readinessData.perfectScoreRate)}%`,
      helper: "Mock & mini quizzes",
    },
    {
      label: "Questions per category",
      value: readinessData.questionsPerCategoryMin.toLocaleString(),
      helper: "Minimum coverage",
    },
  ];

  const recommendations = readinessData.recommendations;
  const weakestCategories = readinessData.weakestCategories.slice(0, 4);

  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 animate-fade-in">
      <section
        className={`relative overflow-hidden rounded-3xl border ${theme.border} ${theme.gradient} p-8 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.7)]`}
      >
        <div className="pointer-events-none absolute -top-20 right-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        {readinessData.status === "ready" && (
          <div className="pointer-events-none absolute left-8 top-8 flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur">
            <span role="img" aria-label="celebration">
              🎉
            </span>
            Test Ready unlocked
          </div>
        )}
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center">
          <CircularProgress
            value={readinessPercent}
            gradient={
              theme.badge.includes("emerald")
                ? ["#059669", "#34d399"]
                : theme.badge.includes("amber")
                  ? ["#f59e0b", "#f97316"]
                  : ["#2563eb", "#60a5fa"]
            }
            label="Readiness score"
            sublabel="Based on 4 mastery pillars"
            showTarget
          />
          <div className="flex-1 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <TargetIcon
                className="h-6 w-6 text-brand-blue"
                aria-hidden="true"
              />
              <h1 className="text-3xl font-bold text-gray-900">
                Your personalised Test Ready dashboard
              </h1>
            </div>
            <p className={`max-w-2xl text-sm leading-relaxed ${theme.accent}`}>
              Track how each learning pillar contributes to your success,
              celebrate milestones, and action the next best steps to reach Test
              Ready with confidence.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="rounded-2xl bg-white/80 p-4 text-sm shadow-sm backdrop-blur">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Pass likelihood
                </div>
                <div className="mt-1 text-3xl font-black text-gray-900">
                  {passLikelihood}%
                </div>
                <div className="text-xs text-gray-500">
                  Projected from your recent performance
                </div>
              </div>
              <div className="rounded-2xl bg-white/80 p-4 text-sm shadow-sm backdrop-blur">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Study momentum
                </div>
                <div className="mt-1 text-3xl font-black text-gray-900">
                  {formatStudyHours(readinessData.studyTimeHours)}
                </div>
                <div className="text-xs text-gray-500">
                  Guided learning time invested
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        {breakdownCards.map(
          ({ key, percent, status, meta, StatusIcon, detail }) => (
            <article
              key={key}
              className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-gray-100 p-2">
                    <StatusIcon
                      className="h-5 w-5 text-brand-blue"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {meta.label}
                    </h3>
                    <p className="text-xs text-gray-500">{meta.description}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full border px-2 py-1 text-xs font-semibold ${AREA_STATUS_THEME[status].chip}`}
                >
                  {AREA_STATUS_THEME[status].label}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <CircularProgress
                  value={percent}
                  gradient={meta.gradient}
                  size={120}
                  strokeWidth={12}
                />
                <div className="flex flex-1 flex-col gap-3 text-sm text-gray-600">
                  <div className="font-medium text-gray-700">{detail}</div>
                  <div className="relative h-2 w-full rounded-full bg-gray-200">
                    <div
                      className={`absolute left-0 top-0 h-2 rounded-full bg-gradient-to-r from-[${meta.gradient[0]}] to-[${meta.gradient[1]}]`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    Push this above{" "}
                    {status === "excellent"
                      ? "90"
                      : status === "strong"
                        ? "85"
                        : "75"}
                    % to unlock the next badge.
                  </div>
                </div>
              </div>
            </article>
          ),
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-4 rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <TrendingUpIcon
              className="h-5 w-5 text-brand-blue"
              aria-hidden="true"
            />
            Consistency tracker
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {studyMilestones.map((milestone) => (
              <div
                key={milestone.label}
                className="flex flex-col gap-2 rounded-xl border border-gray-200/80 bg-gray-50/60 p-3"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {milestone.label}
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {milestone.value}
                </div>
                <div className="text-xs text-gray-500">{milestone.helper}</div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-white">
                  <div
                    className="absolute left-0 top-0 h-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-blue/60"
                    style={{ width: `${milestone.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 space-y-4 rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <ClipboardListIcon
              className="h-5 w-5 text-brand-blue"
              aria-hidden="true"
            />
            Practice insights
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            {practiceInsights.map((insight) => (
              <div
                key={insight.label}
                className="flex items-center justify-between rounded-xl border border-gray-200/70 bg-gray-50/80 p-3"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {insight.label}
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {insight.value}
                </div>
              </div>
            ))}
          </div>
          {weakestCategories.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Focus categories
              </div>
              <div className="flex flex-wrap gap-2">
                {weakestCategories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white/95 p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <BookOpenIcon
            className="h-5 w-5 text-brand-blue"
            aria-hidden="true"
          />
          Personalised recommendations
        </h3>
        {recommendations.length > 0 ? (
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => {
              const priority =
                index === 0
                  ? "High impact"
                  : index === 1
                    ? "Quick win"
                    : "Keep warm";
              const priorityClass =
                index === 0
                  ? "bg-emerald-500/10 text-emerald-700"
                  : index === 1
                    ? "bg-blue-500/10 text-blue-700"
                    : "bg-amber-500/10 text-amber-700";

              return (
                <div
                  key={recommendation}
                  className="flex items-start gap-4 rounded-2xl border border-gray-200/80 bg-gray-50/70 p-4 transition-colors hover:bg-white"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                    <StarIcon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <span
                        className={`rounded-full px-2 py-0.5 ${priorityClass}`}
                      >
                        {priority}
                      </span>
                      Step {index + 1}
                    </div>
                    <p className="text-sm text-gray-700">{recommendation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center text-emerald-700">
            <TrophyIcon
              className="mx-auto mb-2 h-10 w-10 text-emerald-500"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold">
              Outstanding work! You&apos;ve completed every recommended
              activity.
            </p>
          </div>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white/95 p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <StarIcon className="h-5 w-5 text-brand-blue" aria-hidden="true" />
            Achievement log
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-between rounded-xl border border-gray-200/70 bg-gray-50/80 p-3">
              <span>Categories mastered</span>
              <span className="text-lg font-bold text-gray-900">
                {readinessData.categoriesFullyMastered}/
                {readinessData.totalCategories}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-gray-200/70 bg-gray-50/80 p-3">
              <span>Modules completed</span>
              <span className="text-lg font-bold text-gray-900">
                {readinessData.modulesCompleted}/{readinessData.totalModules}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-gray-200/70 bg-gray-50/80 p-3">
              <span>Recent accuracy</span>
              <span className="text-lg font-bold text-gray-900">
                {clampPercentage(readinessData.recentAccuracy)}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white/95 p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <CheckIcon className="h-5 w-5 text-brand-blue" aria-hidden="true" />
            Ready to take action
          </h3>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => handleNavigate("/mock-test")}
              className="flex-1 rounded-xl bg-brand-blue px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Start a mock test
            </button>
            <button
              type="button"
              onClick={() => handleNavigate("/quiz-by-category")}
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white"
            >
              Strengthen weak areas
            </button>
          </div>
          {readinessData.status === "ready" && (
            <button
              type="button"
              onClick={() => handleNavigate("/mock-test")}
              className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-500/20"
            >
              <span>🎯 Book your official test</span>
              <TrophyIcon
                className="h-5 w-5 text-emerald-600"
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default TestReadyView;
