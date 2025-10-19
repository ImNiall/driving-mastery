import { describe, expect, it } from "vitest";

import {
  countryCodeToFlag,
  formatStreakLabel,
  formatTestCountdown,
  getActivityStatus,
  getAverageScoreStyles,
  pluralise,
} from "@/lib/utils/leaderboard";

describe("leaderboard utility helpers", () => {
  it("returns the correct style bucket for average scores", () => {
    expect(getAverageScoreStyles(95)).toBe("bg-green-100 text-green-700");
    expect(getAverageScoreStyles(84)).toBe("bg-blue-100 text-blue-700");
    expect(getAverageScoreStyles(72)).toBe("bg-orange-100 text-orange-700");
    expect(getAverageScoreStyles(55)).toBe("bg-red-100 text-red-700");
  });

  it("pluralises phrases correctly", () => {
    expect(pluralise(1, "quiz", "quizzes")).toBe("1 quiz");
    expect(pluralise(3, "quiz", "quizzes")).toBe("3 quizzes");
  });

  it("formats streak labels", () => {
    expect(formatStreakLabel(1)).toBe("1 day streak");
    expect(formatStreakLabel(12)).toBe("12 day streak");
  });

  it("converts ISO country codes to flag emojis", () => {
    expect(countryCodeToFlag("gb")).toBe("🇬🇧");
    expect(countryCodeToFlag("US")).toBe("🇺🇸");
    expect(countryCodeToFlag(null)).toBeNull();
    expect(countryCodeToFlag("abc")).toBeNull();
  });

  it("formats the test countdown label", () => {
    const reference = new Date("2024-01-01T00:00:00Z");
    expect(formatTestCountdown("2024-01-01T10:00:00Z", reference)).toBe(
      "🚦 Test day today",
    );
    expect(formatTestCountdown("2024-01-02T00:00:00Z", reference)).toBe(
      "🚦 Test in 1 day",
    );
    expect(formatTestCountdown("2023-12-31T00:00:00Z", reference)).toBe(
      "✅ Test completed",
    );
    expect(formatTestCountdown(null, reference)).toBeNull();
  });

  it("categorises activity status based on recency", () => {
    const reference = new Date("2024-01-08T00:00:00Z");

    expect(getActivityStatus("2024-01-07T12:00:00Z", reference)).toMatchObject({
      indicator: "🟢",
      className: "text-green-600",
    });

    expect(getActivityStatus("2024-01-05T00:00:00Z", reference)).toMatchObject({
      indicator: "🟡",
      className: "text-yellow-600",
    });

    expect(getActivityStatus("2023-12-20T00:00:00Z", reference)).toMatchObject({
      indicator: "⚪",
      className: "text-gray-400",
    });

    expect(getActivityStatus(null, reference)).toMatchObject({
      indicator: "⚪",
      className: "text-gray-400",
    });
  });
});
