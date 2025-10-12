"use client";
import React from "react";
import ProgressChart from "@/components/ProgressChart";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { Category, QuizResult } from "@/types";
import { ProgressService } from "@/lib/services/progress";
import { QuizIcon, BookOpenIcon } from "@/components/icons";

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

export default function DashboardPage() {
  const router = useRouter();
  const [progress, setProgress] = React.useState<QuizResult[]>([]);
  const [overall, setOverall] = React.useState(0);
  const [totals, setTotals] = React.useState<{
    total: number;
    correct: number;
  }>({ total: 0, correct: 0 });
  const [masteryPoints, setMasteryPoints] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [attempts, setAttempts] = React.useState<
    Array<{
      id: string;
      source: string;
      total: number | null;
      correct: number | null;
      score_percent: number | null;
      started_at: string | null;
      finished_at: string | null;
    }>
  >([]);

  const hasAttempts = React.useMemo(
    () => attempts.some((a) => (a?.total ?? 0) > 0),
    [attempts],
  );

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Ensure we have an auth session before hitting the API
        const { data: sess } = await supabase.auth.getSession();
        if (!sess.session?.access_token) {
          router.replace("/auth?mode=signin");
          return;
        }
        const timeout = new Promise((_, rej) =>
          setTimeout(() => rej(new Error("Timeout loading overview")), 10000),
        );
        const o = (await Promise.race([
          ProgressService.getOverview(),
          timeout,
        ])) as Awaited<ReturnType<typeof ProgressService.getOverview>>;
        if (cancelled) return;
        const attemptList = Array.isArray(o.attempts) ? o.attempts : [];
        setAttempts(attemptList);
        const pr: QuizResult[] = (o.categories || []).map((c: any) => ({
          category: c.category as Category,
          correct: c.correct || 0,
          total: c.total || 0,
        }));
        let total = pr.reduce((a, b) => a + b.total, 0);
        let correct = pr.reduce((a, b) => a + b.correct, 0);
        if (total === 0 && attemptList.length > 0) {
          const aggregate = attemptList.reduce(
            (acc, attempt) => {
              const t = attempt?.total ?? 0;
              const c = attempt?.correct ?? 0;
              return {
                total: acc.total + (t > 0 ? t : 0),
                correct: acc.correct + (c > 0 ? c : 0),
              };
            },
            { total: 0, correct: 0 },
          );
          if (aggregate.total > 0) {
            total = aggregate.total;
            correct = aggregate.correct;
          }
        }
        setProgress(pr);
        setTotals({ total, correct });
        setOverall(total > 0 ? Math.round((correct / total) * 100) : 0);
        setMasteryPoints(o.masteryPoints || 0);
      } catch (e: any) {
        const msg = (e?.message || "Failed to load overview").toString();
        console.error("Dashboard overview error:", msg);
        setError("We ran into a problem loading your overview. Please retry.");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm p-6">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          <p className="font-semibold">We couldn&apos;t load your dashboard.</p>
          <p className="text-sm mt-1 break-all">{error}</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-3 py-1.5 rounded text-sm"
            >
              Retry
            </button>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/";
              }}
              className="bg-white border border-gray-300 px-3 py-1.5 rounded text-sm"
            >
              Sign In
            </button>
            <button
              onClick={() => (window.location.href = "/mock-test")}
              className="bg-white border border-gray-300 px-3 py-1.5 rounded text-sm"
            >
              Go to Mock Test
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-8">
      <div className="bg-white p-6 rounded-xl border border-gray-200/70 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Review your progress and get help from your AI Mentor.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200/70 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Your Progress Breakdown
          </h3>
          <div className="min-h-[220px] flex items-center justify-center">
            <ProgressChart data={progress} hasAttempts={hasAttempts} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200/70 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Overall Score
            </h3>
            <p
              className={`text-5xl font-extrabold ${overall >= 86 ? "text-brand-green" : "text-brand-blue"}`}
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
            {progress.some((p) => p.total > 0) &&
              (() => {
                const weakest = [...progress]
                  .filter((p) => p.total > 0)
                  .sort((a, b) => a.correct / a.total - b.correct / b.total)[0];
                if (!weakest) return null;
                return (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2 text-gray-700">
                      Recommended Focus Area
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Your results suggest focusing on{" "}
                      <span className="font-bold">{weakest.category}</span>.
                    </p>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          // quick path: start a mock test selection prefilled is not wired; take user to mock test
                          window.location.href = "/mock-test";
                        }}
                        className="w-full bg-brand-blue-light text-brand-blue font-semibold py-2 px-4 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        Practice Topic
                      </button>
                      <button
                        onClick={() => {
                          window.location.href = "/modules";
                        }}
                        className="w-full bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-md hover:bg-slate-200 transition-colors"
                      >
                        Study Module
                      </button>
                    </div>
                  </div>
                );
              })()}
          </div>
          <div className="mt-6 grid grid-cols-1 gap-2">
            <button
              onClick={() => router.push("/mock-test")}
              className="w-full rounded-md bg-brand-blue text-white font-semibold py-2 px-4 hover:opacity-90 transition"
            >
              Start Quiz
            </button>
            <button
              onClick={() => router.push("/modules")}
              className="w-full rounded-md bg-brand-blue/10 text-brand-blue font-semibold py-2 px-4 hover:bg-brand-blue/20 transition"
            >
              Browse Modules
            </button>
          </div>
        </div>
      </div>

      {/* Action cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200/70 shadow-sm flex flex-col text-center transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
          <div className="mx-auto">
            <QuizIcon className="w-12 h-12 text-brand-blue" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mt-4">
            Mock Theory Test
          </h3>
          <p className="text-sm text-gray-600 mt-2 mb-6 flex-grow">
            Simulate the official DVSA test with a randomly selected set of
            questions from all topics.
          </p>
          <button
            onClick={() => router.push("/mock-test")}
            className="w-full bg-brand-blue text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-600 transition-colors"
          >
            Start Quiz
          </button>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200/70 shadow-sm flex flex-col text-center transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
          <div className="mx-auto">
            <BookOpenIcon className="w-12 h-12 text-brand-blue" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mt-4">
            DVSA Topic Revision
          </h3>
          <p className="text-sm text-gray-600 mt-2 mb-6 flex-grow">
            Study detailed guides covering all 14 official DVSA categories to
            build your knowledge.
          </p>
          <button
            onClick={() => router.push("/modules")}
            className="w-full bg-brand-blue text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-600 transition-colors"
          >
            Browse Modules
          </button>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200/70 shadow-sm flex flex-col text-center transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
          <div className="mx-auto">
            <QuizIcon className="w-12 h-12 text-brand-blue" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mt-4">
            Quiz by Category
          </h3>
          <p className="text-sm text-gray-600 mt-2 mb-6 flex-grow">
            Target a single topic with a focused 10-question quiz designed to
            sharpen your weakest area.
          </p>
          <button
            onClick={() => router.push("/quiz-by-category")}
            className="w-full bg-brand-blue text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-600 transition-colors"
          >
            Choose Category
          </button>
        </div>
      </div>
    </main>
  );
}
