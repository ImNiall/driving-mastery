"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import React from "react";

type NavLink = { href: string; label: string };

const privateTabs: NavLink[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/modules", label: "Modules" },
  { href: "/mock-test", label: "Mock Test" },
  { href: "/leaderboard", label: "Leaderboard" },
];

const publicTabs: NavLink[] = [
  { href: "/memberships", label: "Memberships" },
  { href: "/about", label: "About" },
];

export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [signedIn, setSignedIn] = React.useState(false);
  const tabs: NavLink[] = signedIn
    ? [...privateTabs, ...publicTabs]
    : publicTabs;

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
      privateTabs.forEach((t) => {
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
  }, [router, signedIn]);

  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center h-14 gap-2">
          <div className="font-extrabold text-brand-blue mr-4">
            Driving Mastery
          </div>
          <div className="ml-auto flex items-center gap-3">
            {!!tabs.length && (
              <ul className="flex gap-1">
                {tabs.map((t) => {
                  const active = pathname?.startsWith(t.href);
                  return (
                    <li key={t.href}>
                      <Link
                        href={t.href}
                        prefetch
                        className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
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
                className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold"
              >
                Sign Out
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push("/auth?mode=signup")}
                  className="px-3 py-1.5 rounded-full bg-brand-blue text-white text-sm font-semibold hover:bg-brand-blue/90"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => router.push("/auth?mode=signin")}
                  className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
