import { ProgressService } from "./progress";

export interface TestReadinessData {
  readinessScore: number; // 0-100
  status: "ready" | "almost" | "preparing";
  overallAverage: number;
  last10Average: number;
  mockTestsPassed: number;
  totalQuestions: number;
  currentStreak: number;
  categoriesMastered: number;
  totalCategories: number;
  weakestCategory?: string;
  recommendations: string[];
  passLikelihood: number; // 0-100 percentage
}

export interface ReadinessBreakdown {
  performance: { score: number; max: number; status: string };
  coverage: { score: number; max: number; status: string };
  volume: { score: number; max: number; status: string };
  consistency: { score: number; max: number; status: string };
}

export class TestReadyService {
  /**
   * Calculate comprehensive test readiness score
   */
  static calculateReadiness(userStats: any): TestReadinessData {
    let score = 0;
    const recommendations: string[] = [];

    // Core Performance (40 points max)
    const performanceScore = this.calculatePerformanceScore(
      userStats,
      recommendations,
    );
    score += performanceScore;

    // Category Coverage (25 points max)
    const coverageScore = this.calculateCoverageScore(
      userStats,
      recommendations,
    );
    score += coverageScore;

    // Practice Volume (20 points max)
    const volumeScore = this.calculateVolumeScore(userStats, recommendations);
    score += volumeScore;

    // Consistency (15 points max)
    const consistencyScore = this.calculateConsistencyScore(
      userStats,
      recommendations,
    );
    score += consistencyScore;

    const finalScore = Math.min(100, Math.max(0, score));
    const status = this.getReadinessStatus(finalScore);
    const passLikelihood = this.calculatePassLikelihood(finalScore, userStats);

    return {
      readinessScore: finalScore,
      status,
      overallAverage: userStats.averageScore || 0,
      last10Average: userStats.last10Average || 0,
      mockTestsPassed: userStats.mockTestsPassed || 0,
      totalQuestions: userStats.totalQuestions || 0,
      currentStreak: userStats.currentStreak || 0,
      categoriesMastered: userStats.categoriesMastered || 0,
      totalCategories: 14, // DVSA has 14 categories
      weakestCategory: userStats.weakestCategory,
      recommendations: recommendations.slice(0, 3), // Top 3 recommendations
      passLikelihood,
    };
  }

  /**
   * Get detailed breakdown of readiness areas
   */
  static getReadinessBreakdown(userStats: any): ReadinessBreakdown {
    const performance = {
      score: this.calculatePerformanceScore(userStats, []),
      max: 40,
      status: this.getAreaStatus(
        this.calculatePerformanceScore(userStats, []),
        40,
      ),
    };

    const coverage = {
      score: this.calculateCoverageScore(userStats, []),
      max: 25,
      status: this.getAreaStatus(
        this.calculateCoverageScore(userStats, []),
        25,
      ),
    };

    const volume = {
      score: this.calculateVolumeScore(userStats, []),
      max: 20,
      status: this.getAreaStatus(this.calculateVolumeScore(userStats, []), 20),
    };

    const consistency = {
      score: this.calculateConsistencyScore(userStats, []),
      max: 15,
      status: this.getAreaStatus(
        this.calculateConsistencyScore(userStats, []),
        15,
      ),
    };

    return { performance, coverage, volume, consistency };
  }

  private static calculatePerformanceScore(
    userStats: any,
    recommendations: string[],
  ): number {
    let score = 0;
    const overallAvg = userStats.averageScore || 0;
    const last10Avg = userStats.last10Average || 0;
    const mockPasses = userStats.mockTestsPassed || 0;

    // Overall average scoring
    if (overallAvg >= 90) score += 15;
    else if (overallAvg >= 86) score += 10;
    else if (overallAvg >= 80) score += 5;
    else
      recommendations.push(
        "Improve overall score to 86%+ (DVSA pass threshold)",
      );

    // Recent performance
    if (last10Avg >= 86) score += 15;
    else if (last10Avg >= 80) score += 10;
    else recommendations.push("Achieve 86%+ average in your last 10 attempts");

    // Mock test performance
    if (mockPasses >= 3) score += 10;
    else if (mockPasses >= 1) score += 5;
    else recommendations.push("Pass at least 3 consecutive mock tests");

    return score;
  }

  private static calculateCoverageScore(
    userStats: any,
    recommendations: string[],
  ): number {
    const categoriesMastered = userStats.categoriesMastered || 0;
    const totalCategories = 14;

    const coverageRatio = categoriesMastered / totalCategories;
    const score = Math.floor(coverageRatio * 25);

    if (coverageRatio < 0.8) {
      recommendations.push(
        `Master more categories (${categoriesMastered}/${totalCategories} ready)`,
      );
    }

    if (userStats.weakestCategory) {
      recommendations.push(`Focus on "${userStats.weakestCategory}" category`);
    }

    return score;
  }

  private static calculateVolumeScore(
    userStats: any,
    recommendations: string[],
  ): number {
    let score = 0;
    const totalQuestions = userStats.totalQuestions || 0;
    const mockTests = userStats.mockTests || 0;

    // Question volume
    if (totalQuestions >= 500) score += 10;
    else if (totalQuestions >= 300) score += 7;
    else if (totalQuestions >= 150) score += 4;
    else
      recommendations.push(
        `Complete more practice questions (${totalQuestions}/500)`,
      );

    // Mock test volume
    if (mockTests >= 10) score += 10;
    else if (mockTests >= 5) score += 7;
    else if (mockTests >= 3) score += 4;
    else
      recommendations.push(
        `Take more mock tests (${mockTests}/10 recommended)`,
      );

    return score;
  }

  private static calculateConsistencyScore(
    userStats: any,
    recommendations: string[],
  ): number {
    let score = 0;
    const currentStreak = userStats.currentStreak || 0;
    const daysSinceLastActive = userStats.daysSinceLastActive || 0;

    // Study streak
    if (currentStreak >= 7) score += 8;
    else if (currentStreak >= 3) score += 5;
    else if (currentStreak >= 1) score += 2;
    else recommendations.push("Build a consistent daily study habit");

    // Recent activity
    if (daysSinceLastActive <= 1) score += 7;
    else if (daysSinceLastActive <= 3) score += 4;
    else if (daysSinceLastActive <= 7) score += 2;
    else recommendations.push("Practice more regularly - stay active");

    return score;
  }

  private static getReadinessStatus(
    score: number,
  ): "ready" | "almost" | "preparing" {
    if (score >= 85) return "ready";
    if (score >= 65) return "almost";
    return "preparing";
  }

  private static getAreaStatus(score: number, max: number): string {
    const ratio = score / max;
    if (ratio >= 0.9) return "excellent";
    if (ratio >= 0.7) return "good";
    if (ratio >= 0.5) return "needs-work";
    return "poor";
  }

  private static calculatePassLikelihood(
    readinessScore: number,
    userStats: any,
  ): number {
    // Base likelihood from readiness score
    let likelihood = Math.min(95, readinessScore * 0.9);

    // Boost for consistent high performance
    if (userStats.last10Average >= 90) likelihood += 5;
    if (userStats.currentStreak >= 7) likelihood += 3;

    // Penalty for inconsistency
    if (userStats.last10Average < 80) likelihood -= 10;
    if (userStats.daysSinceLastActive > 7) likelihood -= 5;

    return Math.min(98, Math.max(10, Math.round(likelihood)));
  }

  /**
   * Get user's test readiness data from API
   */
  static async getUserReadiness(): Promise<TestReadinessData> {
    try {
      // Get user's overview data
      const overview = await ProgressService.getOverview();

      // Calculate overall score from categories
      const overallScore = this.calculateOverallScore(
        overview.categories || [],
      );

      // Transform overview data for readiness calculation
      const userStats = {
        averageScore: overallScore,
        last10Average: this.calculateLast10Average(overview.attempts || []),
        mockTestsPassed: this.countMockTestPasses(overview.attempts || []),
        totalQuestions: this.countTotalQuestions(overview.attempts || []),
        mockTests: this.countMockTests(overview.attempts || []),
        currentStreak: this.calculateCurrentStreak(overview.attempts || []),
        categoriesMastered: this.countMasteredCategories(
          overview.categories || [],
        ),
        weakestCategory: this.findWeakestCategory(overview.categories || []),
        daysSinceLastActive: this.calculateDaysSinceLastActive(
          overview.attempts || [],
        ),
      };

      return this.calculateReadiness(userStats);
    } catch (error) {
      console.error("Failed to get user readiness:", error);
      // Return default/safe values
      return {
        readinessScore: 0,
        status: "preparing",
        overallAverage: 0,
        last10Average: 0,
        mockTestsPassed: 0,
        totalQuestions: 0,
        currentStreak: 0,
        categoriesMastered: 0,
        totalCategories: 14,
        recommendations: [
          "Complete more practice questions to assess readiness",
        ],
        passLikelihood: 0,
      };
    }
  }

  // Helper methods for data transformation
  private static calculateOverallScore(categories: any[]): number {
    if (categories.length === 0) return 0;

    let totalQuestions = 0;
    let correctAnswers = 0;

    categories.forEach((cat) => {
      totalQuestions += cat.total || 0;
      correctAnswers += cat.correct || 0;
    });

    return totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;
  }

  private static calculateCurrentStreak(attempts: any[]): number {
    // Simple implementation - count consecutive recent attempts with score >= 80%
    if (attempts.length === 0) return 0;

    const recentAttempts = attempts
      .filter((a) => a.score_percent != null && a.finished_at)
      .sort(
        (a, b) =>
          new Date(b.finished_at).getTime() - new Date(a.finished_at).getTime(),
      );

    let streak = 0;
    for (const attempt of recentAttempts) {
      if ((attempt.score_percent || 0) >= 80) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  private static calculateLast10Average(attempts: any[]): number {
    const recent = attempts.filter((a) => a.score_percent != null).slice(-10);

    if (recent.length === 0) return 0;

    const sum = recent.reduce(
      (acc, attempt) => acc + (attempt.score_percent || 0),
      0,
    );
    return Math.round(sum / recent.length);
  }

  private static countMockTestPasses(attempts: any[]): number {
    return attempts.filter(
      (a) => a.source === "mock-test" && (a.score_percent || 0) >= 86,
    ).length;
  }

  private static countTotalQuestions(attempts: any[]): number {
    return attempts.reduce((sum, attempt) => sum + (attempt.total || 0), 0);
  }

  private static countMockTests(attempts: any[]): number {
    return attempts.filter((a) => a.source === "mock-test").length;
  }

  private static countMasteredCategories(categories: any[]): number {
    return categories.filter((cat) => {
      const total = cat.total || 0;
      const correct = cat.correct || 0;
      return total > 0 && correct / total >= 0.8;
    }).length;
  }

  private static findWeakestCategory(categories: any[]): string | undefined {
    const validCategories = categories.filter((cat) => (cat.total || 0) > 0);
    if (validCategories.length === 0) return undefined;

    const weakest = validCategories.reduce((min, cat) => {
      const currentRatio = (cat.correct || 0) / (cat.total || 1);
      const minRatio = (min.correct || 0) / (min.total || 1);
      return currentRatio < minRatio ? cat : min;
    });

    return weakest.category;
  }

  private static calculateDaysSinceLastActive(attempts: any[]): number {
    if (attempts.length === 0) return 999;

    const lastAttempt = attempts
      .filter((a) => a.finished_at)
      .sort(
        (a, b) =>
          new Date(b.finished_at).getTime() - new Date(a.finished_at).getTime(),
      )[0];

    if (!lastAttempt) return 999;

    const lastDate = new Date(lastAttempt.finished_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
