"use client";

import React from "react";
import ModulesIndexClient from "@/app/modules/ModulesIndexClient";
import { LEARNING_MODULES } from "@/constants";

export default function ModulesDashboardView() {
  return <ModulesIndexClient modules={LEARNING_MODULES} embedVariant />;
}
