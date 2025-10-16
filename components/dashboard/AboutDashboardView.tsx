"use client";

import React from "react";
import { AboutContent } from "@/app/about/page";

export default function AboutDashboardView() {
  return (
    <div className="rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-6">
      <AboutContent variant="dashboard" />
    </div>
  );
}
