"use client";
import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type AuthView = "signin" | "signup" | "forgot" | "reset";

function AuthInner() {
  const sp = useSearchParams();
  const router = useRouter();

  const initialMode = React.useMemo<AuthView>(() => {
    const type = sp.get("type");
    if (type === "recovery") return "reset";
    const mode = sp.get("mode");
    if (mode === "signup") return "signup";
    if (mode === "reset") return "reset";
    return "signin";
  }, [sp]);

  const [view, setView] = React.useState<AuthView>(initialMode);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const handledRecovery = React.useRef(false);
  const resetNoticeHandled = React.useRef(false);

  React.useEffect(() => {
    setView(initialMode);
  }, [initialMode]);

  React.useEffect(() => {
    if (handledRecovery.current) return;
    const hashParams =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.hash.replace(/^#/, ""))
        : new URLSearchParams();
    const getParam = (key: string) => sp.get(key) ?? hashParams.get(key);
    const type = getParam("type");
    if (type !== "recovery") return;

    handledRecovery.current = true;
    const accessToken = getParam("access_token");
    const refreshToken = getParam("refresh_token");
    if (!accessToken || !refreshToken) {
      setError("Reset link is invalid or expired. Request a new email.");
      setView("signin");
      router.replace("/auth?mode=signin");
      return;
    }
    setLoading(true);
    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error: sessionError }) => {
        if (sessionError) {
          setError(
            sessionError.message ||
              "We couldn't validate your reset link. Please request a new email.",
          );
          setView("signin");
          router.replace("/auth?mode=signin");
          handledRecovery.current = false;
          return;
        }
        router.replace("/auth/change-password");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, sp]);

  React.useEffect(() => {
    if (resetNoticeHandled.current) return;
    if (sp.get("reset") !== "success") return;
    resetNoticeHandled.current = true;
    setNotice(
      "Password updated. You can now sign in with your new credentials.",
    );
    setError(null);
    setView("signin");
    router.replace("/auth?mode=signin");
  }, [router, sp]);

  React.useEffect(() => {
    if (sp.get("mode") === "reset") {
      router.replace("/auth/change-password");
    }
  }, [router, sp]);

  React.useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        router.replace("/auth/change-password");
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      if (view === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (err) throw err;
        if (data.session) {
          router.replace("/dashboard");
          return;
        }
        setNotice(
          "Check your inbox for a confirmation link. Once your email is verified you can sign in.",
        );
        setEmail("");
        setPassword("");
      } else if (view === "signin") {
        const { data, error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (err) throw err;
        if (!data.session) {
          setError(
            "We couldn't establish a session. Please confirm your email and try again.",
          );
          return;
        }
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          router.replace("/dashboard");
        }
      } else if (view === "forgot") {
        const { error: err } = await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo: `${window.location.origin}/auth/change-password`,
          },
        );
        if (err) throw err;
        setNotice("Check your email for a password reset link.");
      } else if (view === "reset") {
        if (!newPassword || newPassword.length < 8) {
          throw new Error(
            "Please choose a password with at least 8 characters.",
          );
        }
        if (newPassword !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          throw new Error(
            "Your reset session has expired. Request a new password reset email.",
          );
        }
        const { error: err } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (err) throw err;
        setNotice(
          "Password updated. You can now sign in with your new credentials.",
        );
        setNewPassword("");
        setConfirmPassword("");
        setPassword("");
        setView("signin");
        router.replace("/auth?mode=signin");
      }
    } catch (err: any) {
      setError(err?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const heading =
    view === "signup"
      ? "Create your account"
      : view === "signin"
        ? "Sign in"
        : view === "forgot"
          ? "Reset your password"
          : "Choose a new password";

  const description =
    view === "signup"
      ? "Use your email and a secure password."
      : view === "signin"
        ? "Use your email and password to access Driving Mastery."
        : view === "forgot"
          ? "Enter the email associated with your account and we will send a reset link."
          : "Enter and confirm your new password.";

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,#1e3a8a_0%,rgba(30,58,138,0)_70%)] opacity-70 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-80px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,#2563eb_0%,rgba(37,99,235,0)_70%)] opacity-70 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-950 to-slate-950" />
      </div>
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
        <div className="grid w-full max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl bg-white/95 p-8 shadow-2xl shadow-blue-900/30 backdrop-blur-sm lg:p-12">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:text-blue-700"
            >
              <span aria-hidden="true">{"←"}</span> Back home
            </button>
            <div className="mt-6 flex flex-col gap-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-blue-light px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand-blue">
                Driving Mastery
              </span>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 lg:text-4xl">
                  {heading}
                </h1>
                <p className="mt-2 text-base text-slate-600">{description}</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {error && (
                <div
                  className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                  role="alert"
                >
                  {error}
                </div>
              )}
              {notice && (
                <div
                  className="rounded-2xl border border-brand-blue/30 bg-brand-blue-light px-4 py-3 text-sm text-brand-blue"
                  role="status"
                >
                  {notice}
                </div>
              )}
            </div>
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
              aria-label={`${view} form`}
            >
              {(view === "signin" ||
                view === "signup" ||
                view === "forgot") && (
                <label className="block text-sm font-medium text-slate-700">
                  Email
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base shadow-sm transition focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/70"
                    autoComplete="email"
                  />
                </label>
              )}
              {(view === "signin" || view === "signup") && (
                <label className="block text-sm font-medium text-slate-700">
                  Password
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base shadow-sm transition focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/70"
                    autoComplete={
                      view === "signup" ? "new-password" : "current-password"
                    }
                  />
                </label>
              )}
              {view === "reset" && (
                <>
                  <label className="block text-sm font-medium text-slate-700">
                    New password
                    <input
                      type="password"
                      required
                      placeholder="Choose a secure password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base shadow-sm transition focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/70"
                      autoComplete="new-password"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Confirm new password
                    <input
                      type="password"
                      required
                      placeholder="Re-enter the password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base shadow-sm transition focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/70"
                      autoComplete="new-password"
                    />
                  </label>
                </>
              )}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-2xl bg-brand-blue px-5 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/40 transition hover:bg-brand-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? view === "signup"
                    ? "Creating your account…"
                    : view === "signin"
                      ? "Signing you in…"
                      : view === "forgot"
                        ? "Sending reset link…"
                        : "Updating password…"
                  : view === "signup"
                    ? "Create account"
                    : view === "signin"
                      ? "Sign in"
                      : view === "forgot"
                        ? "Send reset link"
                        : "Update password"}
              </button>
            </form>
            <div className="mt-6 space-y-4 text-sm text-slate-600">
              {view === "signin" && (
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setView("forgot");
                      setError(null);
                      setNotice(null);
                    }}
                    className="font-semibold text-brand-blue hover:text-blue-700"
                  >
                    Forgot your password?
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setView("signup");
                      router.replace("/auth?mode=signup");
                    }}
                    className="font-semibold text-brand-blue hover:text-blue-700"
                  >
                    Create an account
                  </button>
                </div>
              )}
              {view === "signup" && (
                <p>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setView("signin");
                      router.replace("/auth?mode=signin");
                    }}
                    className="font-semibold text-brand-blue hover:text-blue-700"
                  >
                    Sign in
                  </button>
                </p>
              )}
              {(view === "forgot" || view === "reset") && (
                <button
                  type="button"
                  onClick={() => {
                    setView("signin");
                    router.replace("/auth?mode=signin");
                    setNotice(null);
                    setError(null);
                  }}
                  className="font-semibold text-brand-blue hover:text-blue-700"
                >
                  Back to sign in
                </button>
              )}
            </div>
          </section>
          <aside className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#2563eb] p-10 text-slate-100">
            <div className="absolute -top-24 right-10 h-60 w-60 rounded-full bg-[radial-gradient(circle_at_top,#38bdf8_0%,rgba(56,189,248,0)_70%)] opacity-60 blur-2xl" />
            <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full border border-white/20" />
            <div className="relative flex h-full flex-col justify-between gap-12">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
                  What our learners say
                </span>
                <blockquote className="space-y-4 text-lg font-semibold leading-relaxed">
                  <p>
                    “The mock tests and bite-sized lessons helped me pass my
                    driving test on the first try.”
                  </p>
                  <footer className="text-sm font-normal text-white/70">
                    Aisling O&rsquo;Connell · Dublin
                  </footer>
                </blockquote>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">
                  Your journey to driving confidence starts here.
                </h3>
                <p className="text-white/70">
                  Access structured modules, mini quizzes, and progress tracking
                  designed for Irish learner drivers. Join thousands mastering
                  the rules of the road.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-semibold text-white">
                      DM
                    </span>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-semibold text-white">
                      AB
                    </span>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-semibold text-white">
                      KC
                    </span>
                  </div>
                  <p className="text-sm text-white/70">
                    Trusted by the Driving Mastery community.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-md p-6">
          <p>Loading…</p>
        </main>
      }
    >
      <AuthInner />
    </Suspense>
  );
}
