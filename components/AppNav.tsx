"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import React from "react";
import {
  PRIMARY_SIGNED_IN_ITEMS,
  PUBLIC_NAV_ITEMS,
  SECONDARY_SIGNED_IN_ITEMS,
} from "@/lib/navigation";

export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [signedIn, setSignedIn] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const signedInTabs = React.useMemo(
    () => [...PRIMARY_SIGNED_IN_ITEMS, ...SECONDARY_SIGNED_IN_ITEMS],
    [],
  );
  const tabs = signedIn ? signedInTabs : PUBLIC_NAV_ITEMS;

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) setSignedIn(!!data.session);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session);
    });
    if (signedIn && typeof router.prefetch === "function") {
      signedInTabs.forEach((t) => {
        if (!t.href) return;
        try {
          router.prefetch(t.href);
        } catch (_) {
          // ignore prefetch errors; navigation still works without cache
        }
      });
    }
    return () => {
      mounted = false;
      sub.subscription?.unsubscribe();
    };
  }, [router, signedIn, signedInTabs]);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <nav className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-lg font-extrabold text-brand-blue">
            Driving Mastery
          </div>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-blue text-white transition hover:bg-brand-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="app-nav-mobile"
          >
            <span className="sr-only">Toggle navigation</span>
            <svg
              aria-hidden
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  mobileOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>

          <div
            className={`items-center gap-4 ${isDashboard ? "hidden" : "hidden md:flex"}`}
          >
            {!!tabs.length && (
              <ul className="flex gap-1">
                {tabs.map((t) => {
                  if (!t.href) return null;
                  const active = pathname?.startsWith(t.href);
                  return (
                    <li key={t.href}>
                      <Link
                        href={t.href}
                        prefetch
                        className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                          active
                            ? "bg-brand-blue text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {t.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
            {signedIn ? (
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/");
                }}
                className="h-11 rounded-full bg-gray-100 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
              >
                Sign Out
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push("/auth?mode=signup")}
                  className="h-11 rounded-full bg-brand-blue px-4 text-sm font-semibold text-white transition hover:bg-brand-blue/90"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => router.push("/auth?mode=signin")}
                  className="h-11 rounded-full bg-gray-100 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          id="app-nav-mobile"
          className={`mt-3 space-y-3 rounded-2xl border border-gray-200 bg-white/95 shadow-lg transition-all duration-200 md:hidden ${
            mobileOpen
              ? "pointer-events-auto px-4 py-4 opacity-100"
              : "pointer-events-none max-h-0 overflow-hidden px-4 py-0 opacity-0"
          }`}
        >
          {!!tabs.length && (
            <ul className="space-y-2">
              {tabs.map((t) => {
                if (!t.href) return null;
                const active = pathname?.startsWith(t.href);
                return (
                  <li key={t.href}>
                    <Link
                      href={t.href}
                      prefetch
                      className={`block rounded-lg px-3 py-2 text-base font-semibold transition-colors ${
                        active
                          ? "bg-brand-blue text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {t.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          {signedIn ? (
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/");
              }}
              className="w-full rounded-full bg-gray-100 px-4 py-2.5 text-base font-semibold text-gray-700 transition hover:bg-gray-200"
            >
              Sign Out
            </button>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => router.push("/auth?mode=signup")}
                className="w-full rounded-full bg-brand-blue px-4 py-2.5 text-base font-semibold text-white transition hover:bg-brand-blue/90"
              >
                Sign Up
              </button>
              <button
                onClick={() => router.push("/auth?mode=signin")}
                className="w-full rounded-full bg-gray-100 px-4 py-2.5 text-base font-semibold text-gray-700 transition hover:bg-gray-200"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
