"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/modules", label: "Modules" },
  { href: "/mock-test", label: "Mock Test" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export default function AppNav() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center h-14 gap-2">
          <div className="font-extrabold text-brand-blue mr-4">
            Driving Mastery
          </div>
          <ul className="flex gap-1">
            {tabs.map((t) => {
              const active = pathname?.startsWith(t.href);
              return (
                <li key={t.href}>
                  <Link
                    href={t.href}
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
          <div className="ml-auto text-xs text-gray-500 hidden sm:block">
            Beta
          </div>
        </div>
      </div>
    </nav>
  );
}
