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

const MEMBERSHIPS: Membership[] = [
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

export default function MembershipsPage() {
  const [activeTab, setActiveTab] = React.useState<MembershipKey>("pro");
  const membership = React.useMemo<Membership>(() => {
    const match = MEMBERSHIPS.find((m) => m.key === activeTab);
    if (match) {
      return match;
    }
    if (MEMBERSHIPS.length === 0) {
      throw new Error("No memberships configured");
    }
    return MEMBERSHIPS[0]!;
  }, [activeTab]);

  const Icon = membership.icon;

  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto max-w-5xl px-4">
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

        <div className="mt-10 flex justify-center">
          <div className="inline-flex items-center rounded-full border border-gray-200 bg-white p-1 shadow-sm">
            {MEMBERSHIPS.map((plan) => {
              const isActive = plan.key === activeTab;
              return (
                <button
                  key={plan.key}
                  type="button"
                  onClick={() => setActiveTab(plan.key)}
                  className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-brand-blue text-white shadow"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {plan.name}
                </button>
              );
            })}
          </div>
        </div>

        <section className="mt-12">
          <article className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-xl">
            <div className="flex flex-col gap-8 p-10 sm:flex-row">
              <div className="flex flex-col items-center text-center sm:w-1/2">
                <span className="inline-flex items-center justify-center rounded-full bg-brand-blue-light p-4">
                  <Icon className="h-7 w-7 text-brand-blue" />
                </span>
                <h2 className="mt-6 text-2xl font-semibold text-gray-900">
                  {membership.name}
                </h2>
                <p className="mt-3 text-sm text-gray-600">
                  {membership.tagline}
                </p>

                <div className="mt-6 flex items-end gap-2">
                  <span className="text-4xl font-bold text-gray-900">
                    {membership.price}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {membership.cadence}
                  </span>
                </div>
                {membership.highlight && (
                  <p className="mt-2 text-sm font-semibold text-brand-blue">
                    {membership.highlight}
                  </p>
                )}

                <button
                  type="button"
                  className="mt-8 w-full max-w-xs rounded-full bg-brand-blue py-3 text-sm font-semibold text-white transition hover:bg-brand-blue/90 sm:w-auto sm:self-center"
                >
                  {membership.ctaLabel}
                </button>
              </div>

              <div className="sm:w-1/2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  What&apos;s included
                </h3>
                <ul className="mt-4 space-y-4 text-sm">
                  {membership.features.map((feature) => (
                    <li key={feature.label} className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full ${
                          feature.available
                            ? "bg-brand-blue-light text-brand-blue"
                            : "bg-red-50 text-brand-red"
                        }`}
                      >
                        {feature.available ? (
                          <CheckIcon className="h-4 w-4" />
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
            </div>
          </article>
        </section>

        <section className="mt-14 rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Need help choosing?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Chat with our team at support@drivingmastery.app and we will guide
            you to the right membership.
          </p>
        </section>
      </div>
    </main>
  );
}
