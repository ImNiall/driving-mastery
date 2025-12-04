"use client";
import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import ProgressChart from "@/components/ProgressChart";
import AssistantChat from "@/components/assistant/AssistantChat";
import type { Category, QuizResult } from "@/types";
import { ProgressService } from "@/lib/services/progress";
import {
  PRIMARY_SIGNED_IN_ITEMS,
  SECONDARY_SIGNED_IN_ITEMS,
  BOTTOM_SIGNED_IN_ITEMS,
  SIGN_OUT_ITEM,
  type DashboardViewKey,
} from "@/lib/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import ModulesDashboardView from "@/components/dashboard/ModulesDashboardView";
import MockTestDashboardView from "@/components/dashboard/MockTestDashboardView";
import LeaderboardDashboardView from "@/components/dashboard/LeaderboardDashboardView";
import MembershipsDashboardView from "@/components/dashboard/MembershipsDashboardView";
import AboutDashboardView from "@/components/dashboard/AboutDashboardView";
import ProfilePageClient from "@/app/profile/page.client";
import TestReadyView from "@/components/TestReadyView";
import TestReadyWidget from "@/components/TestReadyWidget";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Menu,
  Phone,
  User,
  Wind,
} from "lucide-react";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeViewParam = searchParams?.get("view") as DashboardViewKey | null;
  const activeView = activeViewParam ?? "dashboard";
  const previewMode = searchParams?.get("preview") === "true";
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

  const learnerName = "Sarah";
  const todaysLessons = [
    {
      student: "James Mitchell",
      program: "Visual Master Tracker",
      time: "10:00 AM",
      location: "St. Peter's Square, Manchester",
      notes: "Night Driving",
      progress: 70,
    },
    {
      student: "Emma Thompson",
      program: "Visual Master Tracker",
      time: "2:00 PM",
      location: "Station Road, Stretford",
      notes: "Lane Discipline",
      progress: 68,
    },
  ];
  const upcomingLessons = [
    {
      student: "Oliver Davis",
      type: "Mock Test",
      date: "Wed, Mar 3",
      location: "Manchester Test Centre",
    },
    {
      student: "James Mitchell",
      type: "Hazard Perception",
      date: "Wed, Mar 3",
      location: "Manchester Test Centre",
    },
  ];
  const roadConditions = {
    location: "Manchester",
    temperature: "14°C",
    wind: "12 mph",
    weather: "Partly Cloudy",
    visibility: "Good driving conditions",
  };

  const previewOverview = React.useMemo(
    () => ({
      categories: [
        { category: "hazard_perception", correct: 32, total: 40 },
        { category: "rules_of_the_road", correct: 28, total: 34 },
        { category: "vehicle_handling", correct: 22, total: 30 },
      ],
      attempts: [
        {
          id: "preview-lesson",
          source: "module",
          total: 40,
          correct: 30,
          score_percent: 75,
          started_at: new Date().toISOString(),
          finished_at: new Date().toISOString(),
        },
      ],
      masteryPoints: 1240,
      overall: 78,
    }),
    [],
  );

  const hasAttempts = React.useMemo(
    () => attempts.some((a) => (a?.total ?? 0) > 0),
    [attempts],
  );

  const primaryNavItems = React.useMemo(() => PRIMARY_SIGNED_IN_ITEMS, []);
  const secondaryNavItems = React.useMemo(() => SECONDARY_SIGNED_IN_ITEMS, []);
  const bottomNavItems = React.useMemo(
    () => BOTTOM_SIGNED_IN_ITEMS.filter((item) => item.action !== "signOut"),
    [],
  );
  const signOutItem = SIGN_OUT_ITEM;
  const sidebarNavItems = React.useMemo(
    () => [...primaryNavItems, ...secondaryNavItems, ...bottomNavItems],
    [primaryNavItems, secondaryNavItems, bottomNavItems],
  );
  const dashboardNavItems = React.useMemo(
    () => sidebarNavItems.filter((item) => !!item.dashboardView),
    [sidebarNavItems],
  );

  const handleViewChange = React.useCallback(
    (view: DashboardViewKey) => {
      const entries = searchParams ? Array.from(searchParams.entries()) : [];
      const params = new URLSearchParams(entries);
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
      case "test-ready":
        return <TestReadyView />;
      case "memberships":
        return <MembershipsDashboardView />;
      case "about":
        return <AboutDashboardView />;
      case "profile":
        return <ProfilePageClient />;
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
      if (previewMode) {
        const previewProgress: QuizResult[] = previewOverview.categories.map(
          (c) => ({
            category: c.category as Category,
            correct: c.correct || 0,
            total: c.total || 0,
          }),
        );
        const total = previewProgress.reduce(
          (acc, item) => acc + item.total,
          0,
        );
        const correct = previewProgress.reduce(
          (acc, item) => acc + item.correct,
          0,
        );
        setProgress(previewProgress);
        setAttempts(previewOverview.attempts);
        setTotals({ total, correct });
        setOverall(previewOverview.overall);
        setMasteryPoints(previewOverview.masteryPoints);
        setLoading(false);
        return;
      }

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
  }, [previewMode, previewOverview, router]);

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
            <>
              <div className="grid gap-6 xl:grid-cols-4">
                <div className="xl:col-span-2 space-y-4">
                  <div className="rounded-3xl border border-gray-200/70 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-500">
                          Instructor Dashboard
                        </p>
                        <h1 className="text-2xl font-bold text-gray-900">
                          Welcome back, {learnerName}
                        </h1>
                        {previewMode && (
                          <p className="mt-1 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                            Demo preview using mock data
                          </p>
                        )}
                        <p className="mt-1 text-gray-600">
                          Track lessons, prep learners, and keep an eye on their
                          readiness in one view.
                        </p>
                      </div>
                      <div className="flex w-full flex-col gap-2 lg:w-auto lg:min-w-[360px]">
                        <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 shadow-inner">
                          <input
                            type="search"
                            placeholder="Search pupils, lessons..."
                            className="flex-1 bg-transparent text-sm outline-none"
                          />
                          <button
                            type="button"
                            className="rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                          >
                            Search
                          </button>
                        </div>
                        <div className="flex gap-2 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 font-semibold text-green-700">
                            <CheckCircle2 className="h-4 w-4" />
                            23 lessons completed
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 font-semibold text-brand-blue">
                            {masteryPoints} mastery pts
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-6 text-white shadow-md">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-blue-100">
                            Earnings this week
                          </p>
                          <p className="mt-2 text-5xl font-extrabold">£520</p>
                          <div className="mt-2 flex items-center gap-2 text-sm text-blue-50">
                            <span className="inline-flex rounded-full bg-white/20 px-2 py-1 text-xs font-semibold text-white">
                              +2.3% from last week
                            </span>
                            <span>30 lessons completed</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 text-sm text-blue-50">
                          <button
                            type="button"
                            className="rounded-full bg-white/10 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-white/20"
                          >
                            Update Tracker
                          </button>
                          <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((n) => (
                              <div
                                key={`avatar-${n}`}
                                className="h-9 w-9 rounded-full border-2 border-white/30 bg-white/30"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 rounded-2xl bg-white/10 p-4 text-sm leading-relaxed text-blue-50">
                        Earn more by adding Mock Tests to your lessons so your
                        pupils can pre-pay in-app.
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-3xl border border-gray-200/70 bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase text-blue-600">
                              Next Pupil
                            </p>
                            <h3 className="mt-1 text-lg font-bold text-gray-900">
                              James Mitchell
                            </h3>
                            <p className="text-sm text-gray-600">
                              22, Intermediate
                            </p>
                          </div>
                          <button
                            type="button"
                            className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-brand-blue"
                          >
                            Test Ready 70%
                          </button>
                        </div>
                        <div className="mt-3 flex flex-col gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            <span>
                              Starting: St Peter&apos;s Square, Manchester
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span>10:00 AM</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            <span>Night Driving</span>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between rounded-2xl bg-blue-50 px-4 py-3 text-sm text-blue-800">
                          <span>Is your pupil nervous?</span>
                          <Link
                            href="/mentor"
                            className="font-semibold text-brand-blue underline underline-offset-4"
                          >
                            Ask Theo
                          </Link>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span>07591 465 299</span>
                          </div>
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            Arranged test
                          </div>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-gray-200/70 bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase text-green-600">
                              Road Conditions
                            </p>
                            <h3 className="text-lg font-bold text-gray-900">
                              {roadConditions.location}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {roadConditions.weather}
                            </p>
                          </div>
                          <div className="text-right text-gray-600">
                            <p className="text-3xl font-bold text-gray-900">
                              {roadConditions.temperature}
                            </p>
                            <p className="text-sm">
                              Wind: {roadConditions.wind}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-800">
                          <CheckCircle2 className="h-5 w-5" />
                          {roadConditions.visibility}
                        </div>
                        <div className="mt-3 flex items-center gap-3 text-sm text-gray-600">
                          <Wind className="h-4 w-4 text-gray-500" />
                          Keep windows down if pupils struggle with motion
                          sickness.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="xl:col-span-2 space-y-4">
                  <div className="grid gap-4 lg:grid-cols-2">
                    {todaysLessons.map((lesson) => (
                      <div
                        key={`${lesson.student}-${lesson.time}`}
                        className="rounded-3xl border border-gray-200/70 bg-white p-5 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-semibold uppercase text-blue-600">
                              Today&apos;s Lesson
                            </p>
                            <h3 className="text-lg font-bold text-gray-900">
                              {lesson.student}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {lesson.program}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="text-sm font-semibold text-brand-blue underline underline-offset-4"
                          >
                            Update Tracker
                          </button>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
                          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-brand-blue">
                            <Clock className="h-4 w-4" />
                            {lesson.time}
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
                            <MapPin className="h-4 w-4" />
                            {lesson.location}
                          </span>
                        </div>
                        <div className="mt-3 rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
                          <p className="font-semibold text-gray-800">
                            Lesson notes
                          </p>
                          <p className="mt-1 text-gray-600">{lesson.notes}</p>
                          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 font-semibold text-orange-700">
                              <AlertTriangle className="h-4 w-4" />
                              Given warning: Speed control
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 font-semibold text-brand-blue">
                              Pass Rate 68%
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                          <span>Test ready</span>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-40 overflow-hidden rounded-full bg-gray-200">
                              <div
                                className="h-2 rounded-full bg-brand-blue"
                                style={{ width: `${lesson.progress}%` }}
                              />
                            </div>
                            <span className="font-semibold text-gray-900">
                              {lesson.progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4 lg:grid-cols-3">
                    <div className="lg:col-span-2 rounded-3xl border border-gray-200/70 bg-white p-6 shadow-sm">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900">
                          Your Progress Breakdown
                        </h3>
                        <span className="text-sm font-semibold text-gray-500">
                          Recent quiz attempts
                        </span>
                      </div>
                      <div className="min-h-[240px]">
                        <ProgressChart
                          data={progress}
                          hasAttempts={hasAttempts}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-3xl border border-gray-200/70 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase text-blue-600">
                              Overall score
                            </p>
                            <p
                              className={`text-5xl font-extrabold ${overall >= 86 ? "text-brand-green" : "text-brand-blue"}`}
                            >
                              {overall}%
                            </p>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            <p className="font-semibold text-gray-900">
                              Based on 20 lessons
                            </p>
                            <p className="text-gray-500">
                              {totals.correct} / {totals.total} correct
                            </p>
                          </div>
                        </div>
                        <p className="mt-3 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-semibold text-brand-blue">
                          Theo&apos;s recommendation: Focus on Hazard Perception
                          and Rules of the Road this week.
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm font-semibold text-gray-600">
                          <button
                            onClick={() => handleViewChange("mock-test")}
                            className="rounded-full bg-brand-blue px-4 py-2 text-white shadow-sm transition hover:opacity-90"
                          >
                            Start Quiz
                          </button>
                          <button
                            onClick={() => handleViewChange("modules")}
                            className="rounded-full bg-blue-50 px-4 py-2 text-brand-blue transition hover:bg-blue-100"
                          >
                            Revision plan
                          </button>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-gray-200/70 bg-white p-5 shadow-sm">
                        <TestReadyWidget />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-3">
                    <div className="space-y-3 rounded-3xl border border-gray-200/70 bg-white p-5 shadow-sm lg:col-span-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">
                          Upcoming tests
                        </h3>
                        <div className="text-sm text-gray-500">
                          Last updated 45 mins ago
                        </div>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {upcomingLessons.map((lesson) => (
                          <div
                            key={lesson.student}
                            className="rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3"
                          >
                            <div className="flex items-center gap-3 text-gray-700">
                              <User className="h-5 w-5 text-brand-blue" />
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">
                                  {lesson.student}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {lesson.type}
                                </p>
                              </div>
                              <Link
                                href="/mentor"
                                className="text-sm font-semibold text-brand-blue underline underline-offset-4"
                              >
                                Ask Theo
                              </Link>
                            </div>
                            <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
                              <CalendarDays className="h-4 w-4" />
                              <span>{lesson.date}</span>
                            </div>
                            <div className="mt-1 flex items-center gap-3 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>{lesson.location}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 rounded-3xl border border-gray-200/70 bg-white p-5 shadow-sm">
                      <div className="rounded-2xl border border-dashed border-green-200 bg-green-50 p-4 text-sm text-green-800">
                        <div className="flex items-center gap-2 font-semibold">
                          <CheckCircle2 className="h-4 w-4" />
                          Good to go!
                        </div>
                        <p className="mt-1 text-green-700">
                          Add Mock Tests to lessons so pupils can pre-pay.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
                        <div className="flex items-center gap-2 font-semibold">
                          <AlertTriangle className="h-4 w-4" />
                          Theo can help
                        </div>
                        <p className="mt-1 text-orange-700">
                          Ask Theo to create the revision plan for your pupil.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-gray-200/70 bg-white p-6 shadow-lg">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Chat with Theo
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Ask follow-up questions, get bite-sized explanations,
                          and build revision plans without leaving your
                          dashboard.
                        </p>
                      </div>
                      <Link
                        href="/mentor"
                        className="inline-flex items-center justify-center rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-blue/40 hover:text-brand-blue"
                      >
                        Open full view
                      </Link>
                    </div>
                    <div className="mt-6 flex h-[520px] flex-col">
                      <AssistantChat />
                    </div>
                  </div>
                </div>
              </div>
            </>
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
