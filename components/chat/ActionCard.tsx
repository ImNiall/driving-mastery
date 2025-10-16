"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { forwardRef } from "react";

export type ActionCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  onSelect?: () => void;
};

const ActionCard = forwardRef<HTMLButtonElement, ActionCardProps>(
  ({ icon: Icon, title, description, onSelect }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onSelect}
        className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      >
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon aria-hidden className="h-6 w-6" />
        </span>
        <span className="mb-2 text-base font-semibold text-gray-900">
          {title}
        </span>
        <span className="mb-4 flex-1 text-sm text-gray-600">{description}</span>
        <span className="mt-auto inline-flex items-center text-sm font-medium text-blue-600">
          Get started
          <ArrowRight
            aria-hidden
            className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          />
        </span>
      </button>
    );
  },
);

ActionCard.displayName = "ActionCard";

export default ActionCard;
