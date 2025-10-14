"use client";

import React from "react";
import { MembershipsContent } from "@/app/memberships/page";

export default function MembershipsDashboardView() {
  return (
    <div className="rounded-3xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-6">
      <MembershipsContent variant="dashboard" />
    </div>
  );
}
