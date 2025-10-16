import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { Category } from "@/types";

const mockStartAttempt = vi.fn();
const mockSaveProgress = vi.fn();
const mockRecordAnswer = vi.fn();
const mockAnswersBulk = vi.fn();
const mockFinishAttempt = vi.fn();
const mockLatestAttempt = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
}));

function createQuestion(id: number, category: Category) {
  return {
    id,
    category,
    question: `Question ${id}`,
    explanation: "Because it is correct.",
    options: [
      { text: `Correct ${id}`, isCorrect: true },
      { text: `Wrong ${id}-1`, isCorrect: false },
      { text: `Wrong ${id}-2`, isCorrect: false },
      { text: `Wrong ${id}-3`, isCorrect: false },
    ],
  };
}

function buildMockQuestions() {
  return [
    ...Array.from({ length: 10 }, (_, i) =>
      createQuestion(1000 + i, Category.ALERTNESS),
    ),
    ...Array.from({ length: 10 }, (_, i) =>
      createQuestion(2000 + i, Category.ATTITUDE),
    ),
  ];
}

vi.mock("@/constants", () => ({
  QUESTION_BANK: buildMockQuestions(),
}));

vi.mock("@/components/QuestionCard", () => ({
  __esModule: true,
  default: ({ question, onOptionSelect, isAnswered }: any) => (
    <div>
      <h2>{question.question}</h2>
      {question.options.map((option: any) => (
        <button
          key={option.text}
          disabled={isAnswered}
          onClick={() => onOptionSelect(option.text)}
        >
          {option.text}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("@/components/QuizTimer", () => ({
  __esModule: true,
  default: () => <div data-testid="timer" />, // no-op timer for tests
}));

vi.mock("@/lib/services/progress", () => ({
  ProgressService: {
    latestAttempt: (...args: any[]) => mockLatestAttempt(...args),
    startAttempt: (...args: any[]) => mockStartAttempt(...args),
    saveProgress: (...args: any[]) => mockSaveProgress(...args),
    recordAnswer: (...args: any[]) => mockRecordAnswer(...args),
    answersBulk: (...args: any[]) => mockAnswersBulk(...args),
    finishAttempt: (...args: any[]) => mockFinishAttempt(...args),
  },
}));

import QuizByCategoryPage from "@/app/quiz-by-category/page";

const QUIZ_LENGTH = 10;

beforeEach(() => {
  vi.clearAllMocks();
  mockLatestAttempt.mockResolvedValue(null);
  mockStartAttempt.mockResolvedValue({
    attemptId: "attempt-1",
    startedAt: new Date().toISOString(),
  });
  mockSaveProgress.mockResolvedValue({ ok: true });
  mockRecordAnswer.mockResolvedValue({ ok: true });
  mockAnswersBulk.mockResolvedValue({ ok: true, count: 0 });
  mockFinishAttempt.mockResolvedValue({
    total: QUIZ_LENGTH,
    correct: QUIZ_LENGTH,
    score_percent: 100,
    duration_sec: 600,
  });
});

describe("QuizByCategoryPage", () => {
  test("renders category selection buttons", () => {
    render(<QuizByCategoryPage />);
    expect(
      screen.getByRole("button", {
        name: /Alertness/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /Attitude/i,
      }),
    ).toBeInTheDocument();
  });

  test("can start and complete a category quiz", async () => {
    render(<QuizByCategoryPage />);

    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /Alertness/i }));
    await user.click(
      screen.getByRole("button", { name: /Start 10-question quiz/i }),
    );

    await screen.findByRole("heading", { name: /Question/i });

    await waitFor(() =>
      expect(mockStartAttempt).toHaveBeenCalledWith(
        "category",
        null,
        Category.ALERTNESS,
      ),
    );

    for (let i = 0; i < QUIZ_LENGTH; i++) {
      await user.click(
        screen.getByRole("button", {
          name: /Correct/i,
        }),
      );
      if (i < QUIZ_LENGTH - 1) {
        await user.click(screen.getByRole("button", { name: /Next/i }));
      } else {
        await user.click(screen.getByRole("button", { name: /Finish quiz/i }));
      }
    }

    await waitFor(() =>
      expect(mockFinishAttempt).toHaveBeenCalledWith("attempt-1"),
    );

    expect(await screen.findByText(/Quiz complete/i)).toBeInTheDocument();
    expect(screen.getByText(/Score: 100%/i)).toBeInTheDocument();
    expect(mockRecordAnswer).toHaveBeenCalled();
  }, 15000);
});
