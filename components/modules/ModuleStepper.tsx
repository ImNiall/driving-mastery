import { Check } from "lucide-react";
import React from "react";

interface ModuleStepperProps {
  steps: string[];
  currentStep: number;
}

export default function ModuleStepper({
  steps,
  currentStep,
}: ModuleStepperProps) {
  return (
    <div className="-mx-4 mb-8 overflow-x-auto pb-4 sm:mx-0">
      <ol
        className="flex min-w-max items-center gap-4 px-4 sm:px-0"
        role="list"
      >
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isComplete = index < currentStep;
          return (
            <li key={step} className="flex items-center">
              <span
                className={`inline-flex min-w-[160px] items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${
                  isActive
                    ? "border-brand-blue bg-brand-blue text-white"
                    : isComplete
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-600"
                }`}
                aria-current={isActive ? "step" : undefined}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current">
                  {isComplete ? (
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span>{step}</span>
              </span>
              {index < steps.length - 1 ? (
                <span
                  className="mx-2 hidden h-px w-8 bg-slate-200 sm:block"
                  aria-hidden="true"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
