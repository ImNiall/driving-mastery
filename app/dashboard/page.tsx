"use client";
import React from "react";
import ProgressChart from "@/components/ProgressChart";
import StudyPlan from "@/components/StudyPlan";
import { STUDY_PLANS } from "@/constants";
import type { StudyPlan as StudyPlanType } from "@/types";
import { useRouter } from "next/navigation";
import type { Category, QuizResult } from "@/types";
import { ProgressService } from "@/lib/services/progress";

// Minimal local progress shape. Replace with real persisted data when available.
function useLocalProgress(): QuizResult[] {
  // Placeholder: start with empty progress chart (all zeros)
  const categories: Category[] = [
    "safety and your vehicle",
    "hazard awareness",
    "alertness",
    "safety margins",
    "attitude",
    "vulnerable road users",
    "vehicle handling",
    "documents",
    "motorway rules",
    "rules of the road",
    "road and traffic signs",
    "incidents, accidents and emergencies",
    "vehicle loading",
    "other types of vehicle",
  ] as unknown as Category[];
  return categories.map((c) => ({ category: c, correct: 0, total: 0 }));
}

// Fallback plan used when there is no persisted plan
const fallbackPlan: StudyPlanType = {
  name: "Starter Plan",
  description: "A quick start plan to begin your theory prep.",
  steps: [
    {
      title: "Get Started",
      description: "Open your first module and read for 15 minutes.",
      duration: "15 min",
      isCompleted: false,
    },
    {
      title: "Do a Mini Quiz",
      description: "Answer 10 mixed questions to gauge your baseline.",
      duration: "10 min",
      isCompleted: false,
    },
  ],
};

export default function DashboardPage() {
  const router = useRouter();
  const [progress, setProgress] = React.useState<QuizResult[]>([]);
  const [overall, setOverall] = React.useState(0);
  const [totals, setTotals] = React.useState<{
    total: number;
    correct: number;
  }>({ total: 0, correct: 0 });
  const [masteryPoints, setMasteryPoints] = React.useState(0);
  const [plan, setPlan] = React.useState<StudyPlanType>(
    STUDY_PLANS[0] ?? fallbackPlan,
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const o = await ProgressService.getOverview();
        if (cancelled) return;
        const pr: QuizResult[] = (o.categories || []).map((c: any) => ({
          category: c.category as Category,
          correct: c.correct || 0,
          total: c.total || 0,
        }));
        const total = pr.reduce((a, b) => a + b.total, 0);
        const correct = pr.reduce((a, b) => a + b.correct, 0);
        setProgress(pr);
        setTotals({ total, correct });
        setOverall(total > 0 ? Math.round((correct / total) * 100) : 0);
        setMasteryPoints(o.masteryPoints || 0);
        if (o.studyPlan?.steps) {
          setPlan({
            ...(STUDY_PLANS[0] ?? fallbackPlan),
            steps: o.studyPlan.steps,
          });
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load overview");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <p className="text-gray-600">Loading dashboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">Your Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Review your progress and get help from your AI Mentor.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Your Progress Breakdown
          </h3>
          <ProgressChart data={progress} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Overall Score
            </h3>
            <p
              className={`text-5xl font-bold ${overall >= 86 ? "text-brand-green" : "text-brand-blue"}`}
            >
              {overall}%
            </p>
            <p className="text-gray-500">
              {totals.correct} / {totals.total} correct
            </p>
            <p className="text-gray-500 mt-2">
              Mastery Points:{" "}
              <span className="font-semibold">{masteryPoints}</span>
            </p>
          </div>
          <div className="mt-6 space-y-2">
            <button
              onClick={() => router.push("/modules")}
              className="w-full bg-brand-blue text-white font-semibold py-2 px-4 rounded-md hover:opacity-90 transition"
            >
              Browse Modules
            </button>
            <button
              onClick={() => router.push("/mock-test")}
              className="w-full bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-md hover:bg-slate-200 transition"
            >
              Start Mock Test
            </button>
          </div>
        </div>
      </div>

      <StudyPlan plan={plan} />
    </main>
  );
}
