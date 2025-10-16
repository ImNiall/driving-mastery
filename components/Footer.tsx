"use client";

import Link from "next/link";
import React from "react";

const linkClasses =
  "text-sm text-slate-500 hover:text-brand-blue transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue";

const sections = [
  {
    title: "Explore",
    links: [
      { href: "/modules", label: "Modules" },
      { href: "/mock-test", label: "Mock Test" },
      { href: "/faqs", label: "FAQs" },
    ],
  },
  {
    title: "Get Started",
    links: [
      { href: "/auth?mode=signup", label: "Create Account" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Support",
    links: [
      {
        href: "mailto:support@drivingmastery.app",
        label: "support@drivingmastery.app",
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <p className="text-lg font-bold text-brand-blue">Driving Mastery</p>
            <p className="text-sm text-slate-500">
              AI-powered practice tools that keep UK learner drivers on track
              for the DVSA theory test.
            </p>
          </div>
          {sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                {section.title}
              </p>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("mailto:") ? (
                      <a href={link.href} className={linkClasses}>
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className={linkClasses}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-400">
          © {new Date().getFullYear()} Driving Mastery. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
