"use client";

import React from "react";
import {
  AcademicCapIcon,
  CpuChipIcon,
  CheckIcon,
  XCircleIcon,
} from "@/components/icons";

type MembershipKey = "free" | "pro";

type Feature = {
  label: string;
  available: boolean;
  note?: string;
};

type Membership = {
  key: MembershipKey;
  name: string;
  tagline: string;
  price: string;
  cadence: string;
  highlight?: string;
  ctaLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  features: Feature[];
};

export const MEMBERSHIPS: Membership[] = [
  {
    key: "free",
    name: "Free Membership",
    tagline:
      "Get started with Driving Mastery basics. Create an account to unlock the essentials.",
    price: "\u00A30",
    cadence: "per month",
    highlight: "Must create an account",
    ctaLabel: "Create Free Account",
    icon: AcademicCapIcon,
    features: [
      { label: "Full access to mock tests", available: true },
      {
        label: "Limited chat bot access",
        available: true,
        note: "AI chat configuration coming soon",
      },
      { label: "Access to selected analytics", available: true },
      { label: "Access to modules", available: false },
    ],
  },
  {
    key: "pro",
    name: "Pro Membership",
    tagline:
      "Unlock every Driving Mastery feature, advanced coaching, and unlimited study tools.",
    price: "\u00A39.99",
    cadence: "per month",
    highlight: "7 day free trial for new members",
    ctaLabel: "Upgrade to Pro",
    icon: CpuChipIcon,
    features: [
      { label: "Full access to mock tests", available: true },
      { label: "Unlimited AI Mentor chat", available: true },
      { label: "Advanced analytics & progress tracking", available: true },
      { label: "All modules and premium learning paths", available: true },
    ],
  },
];

type MembershipsContentProps = {
  variant?: "page" | "dashboard";
};

export function MembershipsContent({
  variant = "page",
}: MembershipsContentProps) {
  const isDashboard = variant === "dashboard";

  return (
    <div className={isDashboard ? "space-y-10" : undefined}>
      {isDashboard ? (
        <header className="rounded-3xl border border-gray-200/70 bg-white px-6 py-5 text-center shadow-sm sm:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-blue-light px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-blue">
            Memberships
          </span>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Choose the plan that fits your journey
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Compare what&apos;s included in each membership without leaving your
            dashboard.
          </p>
        </header>
      ) : (
        <section className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-blue-light px-4 py-1 text-sm font-semibold text-brand-blue">
            Memberships
          </span>
          <h1 className="mt-6 text-3xl font-bold text-gray-900 md:text-4xl">
            Choose the Driving Mastery plan that fits your journey
          </h1>
          <p className="mt-3 text-base text-gray-600 md:text-lg">
            Compare what&apos;s included in each membership and switch whenever
            you need to. Both plans keep you ready for your UK driving theory
            test.
          </p>
        </section>
      )}

      <div className={isDashboard ? "" : "mx-auto max-w-5xl px-4"}>
        <section className={`${isDashboard ? "mt-6" : "mt-12"}`}>
          <div
            className={`grid gap-8 md:grid-cols-2 ${isDashboard ? "xl:grid-cols-2" : ""}`}
          >
            {MEMBERSHIPS.map((membership) => {
              const Icon = membership.icon;
              const isFeatured = membership.key === "pro";

              return (
                <article
                  key={membership.key}
                  className={`group flex h-full flex-col overflow-hidden rounded-3xl border-0 bg-white transition duration-200 ease-out hover:-translate-y-1 ${
                    isFeatured
                      ? "shadow-[0_25px_50px_-15px_rgba(59,130,246,0.4)] hover:shadow-[0_35px_70px_-20px_rgba(59,130,246,0.55)]"
                      : "shadow-lg hover:shadow-xl hover:shadow-brand-blue/20"
                  }`}
                >
                  <div className="flex flex-col items-center gap-4 px-8 pt-10 text-center">
                    <span
                      className={`inline-flex items-center justify-center rounded-full p-4 transition-colors duration-200 ${
                        isFeatured
                          ? "bg-brand-blue-light text-brand-blue group-hover:bg-brand-blue group-hover:text-white"
                          : "bg-gray-100 text-gray-500 group-hover:bg-brand-blue-light group-hover:text-brand-blue"
                      }`}
                    >
                      <Icon className="h-7 w-7" />
                    </span>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {membership.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {membership.tagline}
                    </p>

                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-bold text-gray-900">
                        {membership.price}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {membership.cadence}
                      </span>
                    </div>
                    {membership.highlight && (
                      <p
                        className={`text-sm font-semibold transition-colors duration-200 ${
                          isFeatured
                            ? "text-brand-blue group-hover:text-brand-blue/80"
                            : "text-gray-700 group-hover:text-brand-blue"
                        }`}
                      >
                        {membership.highlight}
                      </p>
                    )}

                    <button
                      type="button"
                      className={`mt-4 inline-flex w-full max-w-xs justify-center rounded-full px-6 py-3 text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                        isFeatured
                          ? "bg-brand-blue text-white hover:bg-brand-blue/90 focus-visible:outline-brand-blue"
                          : "bg-white text-brand-blue ring-1 ring-inset ring-brand-blue hover:bg-brand-blue/5 focus-visible:outline-brand-blue"
                      }`}
                    >
                      {membership.ctaLabel}
                    </button>
                  </div>

                  <div className="mt-8 border-t border-gray-100 px-8 pb-10 pt-8 transition-colors duration-200 group-hover:border-brand-blue/30">
                    <ul className="mt-4 space-y-4 text-sm">
                      {membership.features.map((feature) => (
                        <li
                          key={feature.label}
                          className="flex items-start gap-3 transition-transform duration-200 group-hover:translate-x-1"
                        >
                          <span
                            className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-200 ${
                              feature.available
                                ? "bg-brand-blue-light text-brand-blue"
                                : "bg-red-50 text-brand-red"
                            }`}
                          >
                            {feature.available ? (
                              <CheckIcon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                            ) : (
                              <XCircleIcon className="h-4 w-4" />
                            )}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {feature.label}
                            </p>
                            {feature.note && (
                              <p className="text-xs text-gray-500">
                                {feature.note}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section
          className={`${
            isDashboard
              ? "rounded-2xl border border-gray-200/80 bg-white p-6 text-center shadow-sm"
              : "mt-14 rounded-2xl bg-white p-8 text-center shadow-sm"
          }`}
        >
          <h2 className="text-lg font-semibold text-gray-900">
            Need help choosing?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Chat with our team at support@drivingmastery.app and we will guide
            you to the right membership.
          </p>
        </section>
      </div>
    </div>
  );
}

export default function MembershipsPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto max-w-5xl px-4">
        <MembershipsContent variant="page" />
      </div>
    </main>
  );
}
