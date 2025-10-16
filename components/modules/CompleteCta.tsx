import Link from "next/link";
import { CheckCircle } from "lucide-react";
import React from "react";

interface CompleteCtaProps {
  onComplete: () => void;
  nextModule?: { slug: string; title: string } | null;
}

export default function CompleteCta({
  onComplete,
  nextModule,
}: CompleteCtaProps) {
  return (
    <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <CheckCircle
            className="mt-1 h-8 w-8 text-emerald-500"
            aria-hidden="true"
          />
          <div>
            <h2 className="text-xl font-semibold text-emerald-900 sm:text-2xl">
              Ready to mark this module complete?
            </h2>
            <p className="mt-2 text-sm text-emerald-700">
              We’ll record your progress so the dashboard shows this module as
              finished. You can revisit it anytime for a refresher.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onComplete}
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            Mark module complete
          </button>
          {nextModule ? (
            <Link
              href={`/modules/${nextModule.slug}`}
              className="inline-flex items-center justify-center rounded-full border border-emerald-400 px-5 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              Continue to {nextModule.title}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
