"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import React from "react";

const tabs = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/modules", label: "Modules" },
  { href: "/mock-test", label: "Mock Test" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [signedIn, setSignedIn] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) setSignedIn(!!data.session);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session);
    });
    return () => {
      mounted = false;
      sub.subscription?.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    if (typeof router.prefetch !== "function") return;
    tabs.forEach((t) => {
      void router.prefetch(t.href).catch(() => {});
    });
  }, [router]);

  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center h-14 gap-2">
          <div className="font-extrabold text-brand-blue mr-4">
            Driving Mastery
          </div>
          <div className="ml-auto flex items-center gap-3">
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
              <button
                onClick={() => router.push("/auth?mode=signin")}
                className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
