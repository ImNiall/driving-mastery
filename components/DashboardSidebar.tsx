import React from "react";
import Image from "next/image";
import {
  PRIMARY_SIGNED_IN_ITEMS,
  SECONDARY_SIGNED_IN_ITEMS,
  SIGN_OUT_ITEM,
  type DashboardViewKey,
  type NavigationItem,
} from "@/lib/navigation";

type DashboardSidebarProps = {
  activeView: DashboardViewKey;
  onNavigate: (view: DashboardViewKey) => void;
  onSignOut: () => void;
  signingOut: boolean;
};

const railClasses =
  "flex h-12 w-12 items-center justify-center rounded-2xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue";

function DesktopNav({
  activeView,
  onNavigate,
  onSignOut,
  signingOut,
}: DashboardSidebarProps) {
  const primaryItems = React.useMemo(() => PRIMARY_SIGNED_IN_ITEMS, []);
  const secondaryItems = React.useMemo(() => SECONDARY_SIGNED_IN_ITEMS, []);
  const signOutItem = SIGN_OUT_ITEM;
  const SignOutIcon = signOutItem?.icon;

  return (
    <div className="hidden lg:flex lg:w-[268px]">
      <div className="flex w-full flex-col justify-between rounded-3xl border border-gray-200/70 bg-white p-6 shadow-sm">
        <div>
          <button
            type="button"
            className="flex items-center gap-3 rounded-2xl bg-brand-blue/5 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            onClick={() => onNavigate("dashboard")}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-blue text-sm font-semibold text-white shadow-sm">
              DM
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue/70">
                Driving Mastery
              </p>
              <p className="text-sm font-semibold text-gray-900">
                Theory Coach
              </p>
            </div>
          </button>

          <nav className="mt-8 space-y-6">
            <div>
              <p className="px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Overview
              </p>
              <ul className="mt-3 space-y-1.5">
                {primaryItems.map((item) => {
                  if (!item.dashboardView) return null;
                  const Icon = item.icon;
                  const active = item.dashboardView === activeView;
                  return (
                    <li key={item.key}>
                      <button
                        type="button"
                        onClick={() => onNavigate(item.dashboardView!)}
                        className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${
                          active
                            ? "bg-brand-blue text-white shadow-sm"
                            : "text-gray-600 hover:bg-brand-blue/10 hover:text-brand-blue"
                        }`}
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
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <p className="px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                More
              </p>
              <ul className="mt-3 space-y-1.5">
                {secondaryItems.map((item) => {
                  if (!item.dashboardView) return null;
                  const Icon = item.icon;
                  const active = item.dashboardView === activeView;
                  return (
                    <li key={item.key}>
                      <button
                        type="button"
                        onClick={() => onNavigate(item.dashboardView!)}
                        className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${
                          active
                            ? "bg-brand-blue text-white shadow-sm"
                            : "text-gray-600 hover:bg-brand-blue/10 hover:text-brand-blue"
                        }`}
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
                      </button>
                    </li>
                  );
                })}
                {signOutItem && SignOutIcon && (
                  <li>
                    <button
                      type="button"
                      onClick={onSignOut}
                      disabled={signingOut}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue/60"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500">
                        <SignOutIcon className="h-5 w-5" />
                      </span>
                      <span>{signOutItem.label}</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-gray-200/80 bg-gray-50 px-4 py-3 text-sm text-gray-700 shadow-sm">
          <Image
            src="/avatar-placeholder.svg"
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-900">You’re logged in</p>
            <p className="text-xs text-gray-500">Keep up the momentum!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RailNav({
  activeView,
  onNavigate,
  onSignOut,
  signingOut,
}: DashboardSidebarProps) {
  const primaryItems = React.useMemo(() => PRIMARY_SIGNED_IN_ITEMS, []);
  const secondaryItems = React.useMemo(() => SECONDARY_SIGNED_IN_ITEMS, []);
  const signOutItem = SIGN_OUT_ITEM;
  const SignOutIcon = signOutItem?.icon;

  return (
    <div className="hidden md:flex lg:hidden">
      <div className="flex h-full w-16 flex-col items-center gap-4 rounded-3xl border border-gray-200/70 bg-white p-3 shadow-sm">
        <button
          type="button"
          className={`${railClasses} bg-brand-blue text-white shadow-sm`}
          aria-label="Dashboard home"
          onClick={() => onNavigate("dashboard")}
        >
          <span className="text-sm font-semibold">DM</span>
        </button>
        {[...primaryItems, ...secondaryItems].map((item) => {
          if (!item.dashboardView) return null;
          const Icon = item.icon;
          const active = item.dashboardView === activeView;
          return (
            <button
              type="button"
              key={item.key}
              className={`${railClasses} ${
                active
                  ? "bg-brand-blue text-white shadow-sm"
                  : "bg-white text-gray-500 hover:bg-brand-blue/10 hover:text-brand-blue"
              }`}
              title={item.label}
              aria-label={item.label}
              onClick={() => onNavigate(item.dashboardView!)}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
        {signOutItem && SignOutIcon && (
          <button
            type="button"
            onClick={onSignOut}
            disabled={signingOut}
            title={signOutItem.label}
            aria-label={signOutItem.label}
            className={`${railClasses} bg-white text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <SignOutIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function DashboardSidebar({
  activeView,
  onNavigate,
  onSignOut,
  signingOut,
}: DashboardSidebarProps) {
  return (
    <>
      <RailNav
        activeView={activeView}
        onNavigate={onNavigate}
        onSignOut={onSignOut}
        signingOut={signingOut}
      />
      <DesktopNav
        activeView={activeView}
        onNavigate={onNavigate}
        onSignOut={onSignOut}
        signingOut={signingOut}
      />
    </>
  );
}
