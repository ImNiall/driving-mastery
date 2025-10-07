"use client";
import React, { useState, useEffect } from "react";
import { StudyPlan as StudyPlanType, StudyPlanStep } from "../types";
import { CheckCircleIcon } from "./icons";

interface StudyPlanProps {
  plan: StudyPlanType;
}

const StudyPlan: React.FC<StudyPlanProps> = ({ plan }) => {
  // Lazy initialize state from localStorage to retrieve saved progress
  const [steps, setSteps] = useState<StudyPlanStep[]>(() => {
    if (typeof window === "undefined") return plan.steps;
    try {
      const savedProgress = window.localStorage.getItem(
        `study-plan-${plan.name}`,
      );
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        if (
          Array.isArray(parsedProgress) &&
          parsedProgress.length === plan.steps.length
        ) {
          return parsedProgress as StudyPlanStep[];
        }
      }
    } catch (error) {
      // Safe log on client only
      console.error(
        "Failed to parse study plan progress from localStorage",
        error,
      );
    }
    return plan.steps;
  });

  // Persist state to localStorage whenever steps change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        `study-plan-${plan.name}`,
        JSON.stringify(steps),
      );
    } catch (error) {
      console.error(
        "Failed to save study plan progress to localStorage",
        error,
      );
    }
  }, [steps, plan.name]);

  const toggleStep = (index: number) => {
    const newSteps = steps.map((step, i) =>
      i === index ? { ...step, isCompleted: !step.isCompleted } : step,
    );
    setSteps(newSteps);
  };

  const completionPercentage =
    steps.length > 0
      ? Math.round(
          (steps.filter((step) => step.isCompleted).length / steps.length) *
            100,
        )
      : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-grow pr-4">
          <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
          <p className="text-sm text-gray-500">{plan.description}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-bold text-2xl text-brand-blue">
            {completionPercentage}%
          </p>
          <p className="text-xs text-gray-500">Complete</p>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div
          className="bg-brand-green h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start">
            <div className="flex flex-col items-center mr-4">
              <button
                onClick={() => toggleStep(index)}
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${step.isCompleted ? "bg-brand-green border-brand-green text-white" : "border-gray-300 bg-white hover:bg-gray-100"}`}
                aria-label={
                  step.isCompleted
                    ? `Mark '${step.title}' as incomplete`
                    : `Mark '${step.title}' as complete`
                }
              >
                {step.isCompleted ? (
                  <CheckCircleIcon className="w-5 h-5" />
                ) : (
                  <span className="text-gray-500 font-bold">{index + 1}</span>
                )}
              </button>
              {index < steps.length - 1 && (
                <div className="w-px h-12 bg-gray-200 mt-1"></div>
              )}
            </div>
            <div
              className={`pt-1 transition-colors duration-200 ${step.isCompleted ? "text-gray-400 line-through" : "text-gray-700"}`}
            >
              <p className="font-semibold">
                {step.title}{" "}
                <span className="text-xs font-normal text-gray-400 ml-2">
                  {step.duration}
                </span>
              </p>
              <p className="text-sm">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyPlan;
