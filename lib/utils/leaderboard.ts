export type ActivityStatus = {
  indicator: "🟢" | "🟡" | "⚪";
  className: string;
};

export const getAverageScoreStyles = (score: number): string => {
  if (score >= 90) return "bg-green-100 text-green-700";
  if (score >= 80) return "bg-blue-100 text-blue-700";
  if (score >= 70) return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
};

export const pluralise = (
  value: number,
  singular: string,
  plural: string,
): string => `${value.toLocaleString()} ${value === 1 ? singular : plural}`;

export const formatStreakLabel = (days: number): string =>
  days === 1 ? "1 day streak" : `${days.toLocaleString()} day streak`;

export const countryCodeToFlag = (code: string | null): string | null => {
  if (!code) return null;
  const trimmed = code.trim();
  if (trimmed.length !== 2) return null;
  const upper = trimmed.toUpperCase();
  const flag = Array.from(upper).map((char) =>
    String.fromCodePoint(127397 + char.charCodeAt(0)),
  );
  return flag.join("");
};

export const formatTestCountdown = (
  testDate: string | null,
  referenceDate: Date = new Date(),
): string | null => {
  if (!testDate) return null;
  const target = new Date(testDate);
  if (Number.isNaN(target.getTime())) return null;
  const diffMs = target.getTime() - referenceDate.getTime();
  const dayMs = 1000 * 60 * 60 * 24;

  if (diffMs < 0) {
    return "✅ Test completed";
  }

  if (diffMs < dayMs) {
    return "🚦 Test day today";
  }

  const diffDays = Math.ceil(diffMs / dayMs);
  if (diffDays === 1) return "🚦 Test in 1 day";
  return `🚦 Test in ${diffDays} days`;
};

export const getActivityStatus = (
  lastActiveISO: string | null,
  referenceDate: Date = new Date(),
): ActivityStatus => {
  if (!lastActiveISO) {
    return { indicator: "⚪", className: "text-gray-400" };
  }

  const lastActive = new Date(lastActiveISO);
  const diffMs = referenceDate.getTime() - lastActive.getTime();

  if (Number.isNaN(diffMs) || diffMs < 0) {
    return { indicator: "🟢", className: "text-green-600" };
  }

  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours < 24) {
    return { indicator: "🟢", className: "text-green-600" };
  }

  if (diffHours < 24 * 7) {
    return { indicator: "🟡", className: "text-yellow-600" };
  }

  return { indicator: "⚪", className: "text-gray-400" };
};
