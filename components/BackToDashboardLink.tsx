"use client";

import Link from "next/link";

import { ArrowLeftIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

type BackToDashboardLinkProps = {
  className?: string;
  label?: string;
  variant?: "link" | "pill";
};

export default function BackToDashboardLink({
  className,
  label = "Back to Dashboard",
  variant = "link",
}: BackToDashboardLinkProps) {
  const variantClassName =
    variant === "pill"
      ? "rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      : "text-sm text-brand-blue hover:text-brand-blue/80";

  return (
    <Link
      href="/dashboard"
      className={cn(
        "inline-flex items-center gap-2 font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue",
        variantClassName,
        className,
      )}
    >
      <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}
