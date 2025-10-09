"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  index: number;
  total: number;
  question: string;
  options: string[];
  selectedIndex?: number | null;
  onSelect?: (index: number) => void;
  onNext?: () => void;
  isNextDisabled?: boolean;
  nextLabel?: string;
}

export default function QuizCard({
  index,
  total,
  question,
  options,
  selectedIndex,
  onSelect,
  onNext,
  isNextDisabled,
  nextLabel = "Next \u2192",
}: QuizCardProps) {
  return (
    <Card className="shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <p className="text-sm font-semibold text-blue-600">
          Question {index} of {total}
        </p>
        <CardTitle className="text-xl text-gray-900">{question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-gray-700">
        {options.map((option, optionIndex) => {
          const isSelected = selectedIndex === optionIndex;
          return (
            <Button
              key={`${option}-${optionIndex}`}
              variant="outline"
              className={cn(
                "w-full justify-start text-left whitespace-normal break-words px-4 py-3",
                isSelected && "border-blue-500 bg-blue-50 text-blue-800",
              )}
              onClick={() => onSelect?.(optionIndex)}
              aria-pressed={isSelected}
              aria-label={`Answer option ${optionIndex + 1}`}
            >
              <span className="flex-1">{option}</span>
            </Button>
          );
        })}
      </CardContent>
      <CardFooter className="flex justify-end pt-2">
        <Button onClick={onNext} disabled={isNextDisabled}>
          {nextLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}
