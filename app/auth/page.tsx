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

  React.useEffect(() => {
    setView(initialMode);
  }, [initialMode]);

  React.useEffect(() => {
    if (handledRecovery.current) return;
    const type = sp.get("type");
    if (type !== "recovery") return;
    handledRecovery.current = true;
    const accessToken = sp.get("access_token");
    const refreshToken = sp.get("refresh_token");
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
          return;
        }
        setNotice(
          "Enter a new password below to finish resetting your account.",
        );
        setError(null);
        setView("reset");
        router.replace("/auth?mode=reset");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, sp]);

  React.useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setNotice(
          "Enter a new password below to finish resetting your account.",
        );
        setError(null);
        setView("reset");
        router.replace("/auth?mode=reset");
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
            redirectTo: `${window.location.origin}/auth?mode=reset`,
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
    <main className="mx-auto max-w-md p-6">
      <button className="text-brand-blue" onClick={() => router.push("/")}>
        {"<-"} Back
      </button>
      <h1 className="text-3xl font-bold mt-4">{heading}</h1>
      <p className="text-gray-600 mt-2">{description}</p>
      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4"
        aria-label={`${view} form`}
      >
        {(view === "signin" || view === "signup" || view === "forgot") && (
          <label className="block">
            <span className="sr-only">Email</span>
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
              autoComplete="email"
            />
          </label>
        )}
        {(view === "signin" || view === "signup") && (
          <label className="block">
            <span className="sr-only">Password</span>
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
              autoComplete={
                view === "signup" ? "new-password" : "current-password"
              }
            />
          </label>
        )}
        {view === "reset" && (
          <>
            <label className="block">
              <span className="sr-only">New password</span>
              <input
                type="password"
                required
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                autoComplete="new-password"
              />
            </label>
            <label className="block">
              <span className="sr-only">Confirm new password</span>
              <input
                type="password"
                required
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                autoComplete="new-password"
              />
            </label>
          </>
        )}
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="text-sm text-brand-blue" role="status">
            {notice}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand-blue text-white px-4 py-3 font-semibold disabled:opacity-60"
        >
          {loading
            ? view === "signup"
              ? "Creating account..."
              : view === "signin"
                ? "Signing in..."
                : view === "forgot"
                  ? "Sending reset link..."
                  : "Updating password..."
            : view === "signup"
              ? "Sign up"
              : view === "signin"
                ? "Sign in"
                : view === "forgot"
                  ? "Send reset link"
                  : "Update password"}
        </button>
      </form>
      <div className="mt-4 text-sm text-gray-600 space-y-2">
        {view === "signin" && (
          <button
            type="button"
            onClick={() => {
              setView("forgot");
              setError(null);
              setNotice(null);
            }}
            className="text-brand-blue font-semibold"
          >
            Forgot your password?
          </button>
        )}
        {view === "signup" && (
          <p>
            Have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setView("signin");
                router.replace("/auth?mode=signin");
              }}
              className="text-brand-blue font-semibold"
            >
              Sign in
            </button>
          </p>
        )}
        {view === "signin" && (
          <p>
            Need an account?{" "}
            <button
              type="button"
              onClick={() => {
                setView("signup");
                router.replace("/auth?mode=signup");
              }}
              className="text-brand-blue font-semibold"
            >
              Sign up
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
            className="text-brand-blue font-semibold"
          >
            Back to sign in
          </button>
        )}
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
