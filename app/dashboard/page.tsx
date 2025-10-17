"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { Category, QuizResult } from "@/types";
import { ProgressService } from "@/lib/services/progress";
import {
  PRIMARY_SIGNED_IN_ITEMS,
  SECONDARY_SIGNED_IN_ITEMS,
  SIGN_OUT_ITEM,
  type DashboardViewKey,
} from "@/lib/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import ModulesDashboardView from "@/components/dashboard/ModulesDashboardView";
import MockTestDashboardView from "@/components/dashboard/MockTestDashboardView";
import LeaderboardDashboardView from "@/components/dashboard/LeaderboardDashboardView";
import MembershipsDashboardView from "@/components/dashboard/MembershipsDashboardView";
import AboutDashboardView from "@/components/dashboard/AboutDashboardView";
import ChatDashboardView from "@/components/dashboard/ChatDashboardView";
import { Menu } from "lucide-react";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeViewParam = searchParams?.get("view") as DashboardViewKey | null;
  const activeView = activeViewParam ?? "dashboard";
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
  const [signingOut, setSigningOut] = React.useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  const hasAttempts = React.useMemo(
    () => attempts.some((a) => (a?.total ?? 0) > 0),
    [attempts],
  );

  const primaryNavItems = React.useMemo(() => PRIMARY_SIGNED_IN_ITEMS, []);
  const secondaryNavItems = React.useMemo(() => SECONDARY_SIGNED_IN_ITEMS, []);
  const signOutItem = SIGN_OUT_ITEM;
  const sidebarNavItems = React.useMemo(
    () => [...primaryNavItems, ...secondaryNavItems],
    [primaryNavItems, secondaryNavItems],
  );
  const dashboardNavItems = React.useMemo(
    () => sidebarNavItems.filter((item) => !!item.dashboardView),
    [sidebarNavItems],
  );

  const handleViewChange = React.useCallback(
    (view: DashboardViewKey) => {
      const params = new URLSearchParams(
        Array.from(searchParams.entries() ?? []),
      );
      if (view === "dashboard") {
        params.delete("view");
      } else {
        params.set("view", view);
      }
      const qs = params.toString();
      router.replace(`/dashboard${qs ? `?${qs}` : ""}`, { scroll: true });
    },
    [router, searchParams],
  );

  const renderNonDashboard = React.useCallback(() => {
    switch (activeView) {
      case "modules":
        return <ModulesDashboardView />;
      case "mock-test":
        return <MockTestDashboardView />;
      case "leaderboard":
        return <LeaderboardDashboardView masteryPoints={masteryPoints} />;
      case "memberships":
        return <MembershipsDashboardView />;
      case "about":
        return <AboutDashboardView />;
      default:
        return null;
    }
  }, [activeView, masteryPoints]);

  const handleSignOut = React.useCallback(async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (e) {
      console.error("Sign out failed", e);
    } finally {
      setSigningOut(false);
    }
  }, [router, signingOut]);

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
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:sticky lg:top-6 lg:h-min">
          <DashboardSidebar
            activeView={activeView}
            onNavigate={(view) => {
              handleViewChange(view);
              setMobileSidebarOpen(false);
            }}
            onSignOut={async () => {
              await handleSignOut();
              setMobileSidebarOpen(false);
            }}
            signingOut={signingOut}
            mobileOpen={mobileSidebarOpen}
            onMobileClose={() => setMobileSidebarOpen(false)}
          />
        </div>
        <section
          className={`${
            activeView === "dashboard"
              ? "flex flex-col gap-8"
              : "flex flex-col gap-6"
          } lg:flex-1`}
        >
          <div className="flex items-center justify-between lg:hidden">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              <Menu className="h-5 w-5" />
              Menu
            </button>
          </div>
          <div className="-mx-4 md:hidden">
            <div className="mb-4 flex gap-2 overflow-x-auto px-4 pb-2">
              {dashboardNavItems.map((item) => {
                const view = item.dashboardView!;
                const active = view === activeView;
                return (
                  <button
                    key={`mobile-${item.key}`}
                    type="button"
                    onClick={() => handleViewChange(view)}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold ${
                      active
                        ? "border-brand-blue bg-brand-blue text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-brand-blue/40 hover:text-brand-blue"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </button>
                );
              })}
              {signOutItem && (
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex items-center gap-2 whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-red-200 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {signOutItem.label}
                </button>
              )}
            </div>
          </div>

          {activeView === "dashboard" ? (
            <ChatDashboardView />
          ) : (
            <div key={activeView} className="flex-1">
              {renderNonDashboard()}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <React.Suspense
      fallback={
        <main className="mx-auto max-w-6xl p-6">
          <div className="rounded-2xl border border-gray-200/70 bg-white p-6 text-gray-600">
            Loading dashboard...
          </div>
        </main>
      }
    >
      <DashboardContent />
    </React.Suspense>
  );
}
