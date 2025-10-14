import React from "react";
import Link from "next/link";
import {
  PRIMARY_SIGNED_IN_ITEMS,
  SECONDARY_SIGNED_IN_ITEMS,
  SIGN_OUT_ITEM,
  type NavigationItem,
} from "@/lib/navigation";

type DashboardSidebarProps = {
  pathname?: string | null;
  onSignOut: () => void;
  signingOut: boolean;
};

function isActive(pathname: string | null | undefined, item: NavigationItem) {
  if (!item.href) return false;
  return pathname?.startsWith(item.href) ?? false;
}

export default function DashboardSidebar({
  pathname,
  onSignOut,
  signingOut,
}: DashboardSidebarProps) {
  const primaryItems = React.useMemo(() => PRIMARY_SIGNED_IN_ITEMS, []);
  const secondaryItems = React.useMemo(() => SECONDARY_SIGNED_IN_ITEMS, []);
  const signOutItem = SIGN_OUT_ITEM;
  const SignOutIcon = signOutItem?.icon;

  return (
    <>
      <div className="hidden md:flex lg:hidden flex-col items-center gap-3 rounded-3xl border border-gray-200/70 bg-white p-3 shadow-sm">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-blue text-sm font-extrabold text-white">
          DM
        </div>
        {[...primaryItems, ...secondaryItems].map((item) => {
          if (!item.href) return null;
          const Icon = item.icon;
          const active = isActive(pathname, item);
          return (
            <Link
              key={item.key}
              href={item.href}
              prefetch
              className={`flex h-11 w-11 items-center justify-center rounded-2xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${
                active
                  ? "bg-brand-blue text-white shadow-sm"
                  : "bg-white text-gray-500 hover:bg-brand-blue/10 hover:text-brand-blue"
              }`}
              aria-current={active ? "page" : undefined}
              title={item.label}
              aria-label={item.label}
            >
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}
        {signOutItem && SignOutIcon && (
          <button
            type="button"
            onClick={onSignOut}
            disabled={signingOut}
            title={signOutItem.label}
            aria-label={signOutItem.label}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SignOutIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="hidden lg:block">
        <div className="space-y-4 rounded-3xl border border-gray-200/70 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between rounded-2xl bg-brand-blue/5 px-3 py-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-blue text-base font-extrabold text-white shadow-sm">
                DM
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue/70">
                  Driving Mastery
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  Training Hub
                </p>
              </div>
            </div>
            <div className="hidden xl:flex h-10 w-10 items-center justify-center rounded-2xl border border-brand-blue/20 text-brand-blue">
              <span className="text-xs font-semibold">PRO</span>
            </div>
          </div>

          <nav className="space-y-6">
            <div>
              <p className="px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Overview
              </p>
              <div className="mt-3 space-y-1.5">
                {primaryItems.map((item) => {
                  if (!item.href) return null;
                  const Icon = item.icon;
                  const active = isActive(pathname, item);
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      prefetch
                      className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${
                        active
                          ? "bg-brand-blue text-white shadow-sm"
                          : "text-gray-600 hover:bg-brand-blue/10 hover:text-brand-blue"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-brand-blue/10 text-brand-blue group-hover:bg-brand-blue/15"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                More
              </p>
              <div className="mt-3 space-y-1.5">
                {secondaryItems.map((item) => {
                  if (!item.href) return null;
                  const Icon = item.icon;
                  const active = isActive(pathname, item);
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      prefetch
                      className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${
                        active
                          ? "bg-brand-blue text-white shadow-sm"
                          : "text-gray-600 hover:bg-brand-blue/10 hover:text-brand-blue"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-brand-blue/10 text-brand-blue group-hover:bg-brand-blue/15"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                {signOutItem && SignOutIcon && (
                  <button
                    type="button"
                    onClick={onSignOut}
                    disabled={signingOut}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue/50"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500">
                      <SignOutIcon className="h-5 w-5" />
                    </span>
                    <span>{signOutItem.label}</span>
                  </button>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
