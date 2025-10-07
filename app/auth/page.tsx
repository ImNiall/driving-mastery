"use client";
import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

function AuthInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const mode = (sp.get("mode") === "signup" ? "signup" : "signin") as
    | "signup"
    | "signin";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/modules` },
        });
        if (err) throw err;
        router.push("/modules");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (err) throw err;
        router.push("/modules");
      }
    } catch (err: any) {
      setError(err?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md p-6">
      <button className="text-brand-blue" onClick={() => router.push("/")}>
        {"<-"} Back
      </button>
      <h1 className="text-3xl font-bold mt-4">
        {mode === "signup" ? "Create your account" : "Sign in"}
      </h1>
      <p className="text-gray-600 mt-2">
        Use your email and a secure password.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4"
        aria-label={mode === "signup" ? "Sign up form" : "Sign in form"}
      >
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
              mode === "signup" ? "new-password" : "current-password"
            }
          />
        </label>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand-blue text-white px-4 py-3 font-semibold disabled:opacity-60"
        >
          {loading
            ? mode === "signup"
              ? "Creating account..."
              : "Signing in..."
            : mode === "signup"
              ? "Sign up"
              : "Sign in"}
        </button>
      </form>
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
