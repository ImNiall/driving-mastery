"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

function parseHashParams() {
  if (typeof window === "undefined") return new URLSearchParams();
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  return new URLSearchParams(hash);
}

export default function ChangePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [initializing, setInitializing] = React.useState(true);
  const [canReset, setCanReset] = React.useState(false);
  const handledRecovery = React.useRef(false);

  React.useEffect(() => {
    let isActive = true;

    const establishSessionFromParams = async () => {
      setInitializing(true);
      const hashParams = parseHashParams();
      const getParam = (key: string) =>
        searchParams.get(key) ?? hashParams.get(key);

      const type = getParam("type");
      if (type !== "recovery") {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!isActive) return;
        if (session) {
          setCanReset(true);
          setError(null);
        } else {
          setError(
            "Reset link is invalid or expired. Request a new password reset email.",
          );
          setCanReset(false);
        }
        setInitializing(false);
        return;
      }

      const accessToken = getParam("access_token");
      const refreshToken = getParam("refresh_token");
      if (!accessToken || !refreshToken) {
        setError(
          "Reset link is invalid or expired. Request a new password reset email.",
        );
        setCanReset(false);
        setInitializing(false);
        return;
      }

      if (handledRecovery.current) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!isActive) return;
        if (session) {
          setCanReset(true);
          setError(null);
        } else {
          setError(
            "Your reset session has expired. Request a new password reset email.",
          );
          setCanReset(false);
        }
        setInitializing(false);
        return;
      }

      handledRecovery.current = true;
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (!isActive) return;

      if (sessionError) {
        setError(
          sessionError.message ||
            "We couldn't validate your reset link. Request a new email.",
        );
        setCanReset(false);
        handledRecovery.current = false;
        setInitializing(false);
        return;
      }

      setCanReset(true);
      setError(null);
      setInitializing(false);
      router.replace("/auth/change-password");
    };

    void establishSessionFromParams();

    return () => {
      isActive = false;
    };
  }, [router, searchParams]);

  React.useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setCanReset(true);
        setError(null);
        setInitializing(false);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!canReset) {
      setError(
        "Your reset session has expired. Request a new password reset email.",
      );
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setError("Please choose a password with at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error(
          "Your reset session has expired. Request a new password reset email.",
        );
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) {
        throw updateError;
      }

      await supabase.auth.signOut();
      router.replace("/auth?mode=signin&reset=success");
    } catch (err: any) {
      setError(err?.message || "We couldn't update your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md p-6">
      <button
        className="text-brand-blue"
        onClick={() => router.push("/auth?mode=signin")}
      >
        {"<-"} Back
      </button>
      <h1 className="text-3xl font-bold mt-4">Change your password</h1>
      <p className="text-gray-600 mt-2">
        Enter and confirm your new password to complete the reset.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4"
        aria-label="change password form"
      >
        <label className="block">
          <span className="sr-only">New password</span>
          <input
            type="password"
            required
            placeholder="New password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
            autoComplete="new-password"
            disabled={loading || initializing || !canReset}
          />
        </label>
        <label className="block">
          <span className="sr-only">Confirm new password</span>
          <input
            type="password"
            required
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
            autoComplete="new-password"
            disabled={loading || initializing || !canReset}
          />
        </label>

        {initializing && (
          <p className="text-sm text-gray-600" role="status">
            Validating your reset link…
          </p>
        )}
        {error && !initializing && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || initializing || !canReset}
          className="w-full rounded-full bg-brand-blue text-white px-4 py-3 font-semibold disabled:opacity-60"
        >
          {loading ? "Updating password…" : "Update password"}
        </button>
      </form>
    </main>
  );
}
