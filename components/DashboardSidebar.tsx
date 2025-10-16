"use client";

import Image from "next/image";
import React from "react";
import {
  PRIMARY_SIGNED_IN_ITEMS,
  SECONDARY_SIGNED_IN_ITEMS,
  SIGN_OUT_ITEM,
  type DashboardViewKey,
} from "@/lib/navigation";

interface SidebarContentProps {
  activeView: DashboardViewKey;
  onNavigate: (view: DashboardViewKey) => void;
  onSignOut: () => void;
  signingOut?: boolean;
}

function SidebarContent({
  activeView,
  onNavigate,
  onSignOut,
  signingOut,
}: SidebarContentProps) {
  const primaryItems = PRIMARY_SIGNED_IN_ITEMS.filter(
    (item) => item.dashboardView,
  );
  const secondaryItems = SECONDARY_SIGNED_IN_ITEMS.filter(
    (item) => item.dashboardView,
  );
  const signOutItem = SIGN_OUT_ITEM;
  const SignOutIcon = signOutItem?.icon;

  return (
    <div className="flex h-full flex-col">
      <div className="rounded-2xl border border-gray-200/80 bg-gradient-to-br from-brand-blue via-brand-blue to-brand-blue/90 p-4 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/10 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M4 24c3-2 5-4 6.5-7.5C12 13 13.5 6 16 6s4 7 5.5 10.5S25 22 28 24" />
              <path d="M4 11s3-3 5-4 3-1 7-1 5 0 7 1 5 4 5 4" />
              <path d="M16 6c.5 4.5 2 7.5 4.5 9.5S25.5 19 28 24" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white/80">
              Driving Mastery
            </p>
            <p className="text-base font-bold text-white">Theory Coach</p>
          </div>
        </div>
      </div>

      <nav className="mt-8 flex-1 space-y-6 overflow-auto">
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
                    className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${
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
                    className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${
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
  );
}

interface DashboardSidebarProps extends SidebarContentProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function DashboardSidebar({
  activeView,
  onNavigate,
  onSignOut,
  signingOut,
  mobileOpen = false,
  onMobileClose,
}: DashboardSidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <div className="w-60 rounded-3xl border border-gray-200/70 bg-white p-6 shadow-sm">
          <SidebarContent
            activeView={activeView}
            onNavigate={onNavigate}
            onSignOut={onSignOut}
            signingOut={signingOut}
          />
        </div>
      </div>

      {/* Mobile/Tablet overlay */}
      <div
        className={`fixed inset-0 z-40 flex lg:hidden ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          onClick={onMobileClose}
          className={`flex-1 bg-black/40 transition-opacity ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Close sidebar"
        />
        <div
          className={`relative h-full w-60 translate-x-full bg-white shadow-xl transition-transform duration-200 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-brand-blue">
                Navigation
              </span>
              <button
                type="button"
                onClick={onMobileClose}
                className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue"
              >
                Close
              </button>
            </div>
            <SidebarContent
              activeView={activeView}
              onNavigate={(view) => {
                onNavigate(view);
                onMobileClose?.();
              }}
              onSignOut={() => {
                onSignOut();
                onMobileClose?.();
              }}
              signingOut={signingOut}
            />
          </div>
        </div>
      </div>
    </>
  );
}
