"use client";

import React from "react";
import dynamic from "next/dynamic";

const MockTestPage = dynamic(() => import("@/app/mock-test/page"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[200px] items-center justify-center text-sm text-gray-500">
      Preparing mock test experience...
    </div>
  ),
});

export default function MockTestDashboardView() {
  return (
    <div className="rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-6">
      <MockTestPage />
    </div>
  );
}
