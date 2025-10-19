import { ProgressService } from "./progress";

export interface TestReadinessData {
  readinessScore: number; // 0-100
  status: "ready" | "almost" | "preparing";

  // Knowledge Mastery Metrics
  categoriesFullyMastered: number;
  totalCategories: number;
  overallCategoryAverage: number;
  weakestCategories: string[];

  // Learning Depth Metrics
  modulesCompleted: number;
  totalModules: number;
  studyTimeHours: number;

  // Practice Quality Metrics
  uniqueQuestionsAttempted: number;
  questionsPerCategoryMin: number;
  recentAccuracy: number;
  perfectScoreRate: number;

  // Learning Consistency Metrics
  studyDaysLast2Weeks: number;
  averageSessionMinutes: number;
  knowledgeRetentionRate: number;
  daysSinceLastActivity: number;

  // Recommendations and Predictions
  recommendations: string[];
  passLikelihood: number; // 0-100 percentage

  // Detailed Breakdown
  breakdown: {
    knowledgeMastery: { score: number; max: number };
    learningDepth: { score: number; max: number };
    practiceQuality: { score: number; max: number };
    consistency: { score: number; max: number };
  };
}

export interface ReadinessBreakdown {
  performance: { score: number; max: number; status: string };
  coverage: { score: number; max: number; status: string };
  volume: { score: number; max: number; status: string };
  consistency: { score: number; max: number; status: string };
}

export class TestReadyService {
  /**
   * Calculate comprehensive test readiness score using learning-focused metrics
   */
  static calculateReadiness(userStats: any): TestReadinessData {
    const recommendations: string[] = [];

    // 1. Knowledge Mastery (40 points max) - Category-specific competency
    const knowledgeMasteryResult = this.calculateKnowledgeMastery(
      userStats,
      recommendations,
    );

    // 2. Learning Depth (25 points max) - Module completion and study time
    const learningDepthResult = this.calculateLearningDepth(
      userStats,
      recommendations,
    );

    // 3. Practice Quality (20 points max) - Question volume and accuracy
    const practiceQualityResult = this.calculatePracticeQuality(
      userStats,
      recommendations,
    );

    // 4. Learning Consistency (15 points max) - Study habits and retention
    const consistencyResult = this.calculateLearningConsistency(
      userStats,
      recommendations,
    );

    const finalScore = Math.min(
      100,
      Math.max(
        0,
        knowledgeMasteryResult.score +
          learningDepthResult.score +
          practiceQualityResult.score +
          consistencyResult.score,
      ),
    );

    const status = this.getReadinessStatus(finalScore);
    const passLikelihood = this.calculateEnhancedPassLikelihood(
      finalScore,
      userStats,
    );

    return {
      readinessScore: finalScore,
      status,

      // Knowledge Mastery Metrics
      categoriesFullyMastered: userStats.categoriesFullyMastered || 0,
      totalCategories: 14,
      overallCategoryAverage: userStats.overallCategoryAverage || 0,
      weakestCategories: userStats.weakestCategories || [],

      // Learning Depth Metrics
      modulesCompleted: userStats.modulesCompleted || 0,
      totalModules: 14,
      studyTimeHours: userStats.studyTimeHours || 0,

      // Practice Quality Metrics
      uniqueQuestionsAttempted: userStats.uniqueQuestionsAttempted || 0,
      questionsPerCategoryMin: userStats.questionsPerCategoryMin || 0,
      recentAccuracy: userStats.recentAccuracy || 0,
      perfectScoreRate: userStats.perfectScoreRate || 0,

      // Learning Consistency Metrics
      studyDaysLast2Weeks: userStats.studyDaysLast2Weeks || 0,
      averageSessionMinutes: userStats.averageSessionMinutes || 0,
      knowledgeRetentionRate: userStats.knowledgeRetentionRate || 0,
      daysSinceLastActivity: userStats.daysSinceLastActivity || 0,

      // Recommendations and Predictions
      recommendations: recommendations.slice(0, 4), // Top 4 recommendations
      passLikelihood,

      // Detailed Breakdown
      breakdown: {
        knowledgeMastery: knowledgeMasteryResult,
        learningDepth: learningDepthResult,
        practiceQuality: practiceQualityResult,
        consistency: consistencyResult,
      },
    };
  }

  /**
   * Get detailed breakdown of readiness areas (updated for enhanced algorithm)
   */
  static getReadinessBreakdown(userStats: any): ReadinessBreakdown {
    const knowledgeMastery = this.calculateKnowledgeMastery(userStats, []);
    const learningDepth = this.calculateLearningDepth(userStats, []);
    const practiceQuality = this.calculatePracticeQuality(userStats, []);
    const consistency = this.calculateLearningConsistency(userStats, []);

    return {
      performance: {
        score: knowledgeMastery.score,
        max: knowledgeMastery.max,
        status: this.getAreaStatus(
          knowledgeMastery.score,
          knowledgeMastery.max,
        ),
      },
      coverage: {
        score: learningDepth.score,
        max: learningDepth.max,
        status: this.getAreaStatus(learningDepth.score, learningDepth.max),
      },
      volume: {
        score: practiceQuality.score,
        max: practiceQuality.max,
        status: this.getAreaStatus(practiceQuality.score, practiceQuality.max),
      },
      consistency: {
        score: consistency.score,
        max: consistency.max,
        status: this.getAreaStatus(consistency.score, consistency.max),
      },
    };
  }

  /**
   * 1. Knowledge Mastery (40 points max) - Category-specific competency
   */
  private static calculateKnowledgeMastery(
    userStats: any,
    recommendations: string[],
  ): { score: number; max: number } {
    let score = 0;
    const maxScore = 40;

    const categoriesFullyMastered = userStats.categoriesFullyMastered || 0;
    const overallCategoryAverage = userStats.overallCategoryAverage || 0;
    const weakestCategories = userStats.weakestCategories || [];

    // Category mastery scoring (35 points max)
    const categoryMasteryScore = (categoriesFullyMastered / 14) * 35;
    score += categoryMasteryScore;

    // Excellence bonus (5 points max)
    if (overallCategoryAverage >= 90) score += 5;
    else if (overallCategoryAverage >= 85) score += 3;

    // Add recommendations
    if (categoriesFullyMastered < 12) {
      recommendations.push(
        `Master more categories (${categoriesFullyMastered}/14 ready)`,
      );
    }

    if (weakestCategories.length > 0) {
      recommendations.push(
        `Focus on weak areas: ${weakestCategories.slice(0, 2).join(", ")}`,
      );
    }

    if (overallCategoryAverage < 85) {
      recommendations.push("Improve accuracy across all categories to 85%+");
    }

    return { score: Math.round(score), max: maxScore };
  }

  /**
   * 2. Learning Depth (25 points max) - Module completion and study time
   */
  private static calculateLearningDepth(
    userStats: any,
    recommendations: string[],
  ): { score: number; max: number } {
    let score = 0;
    const maxScore = 25;

    const modulesCompleted = userStats.modulesCompleted || 0;
    const studyTimeHours = userStats.studyTimeHours || 0;

    // Module completion scoring (15 points max)
    const moduleCompletionScore = (modulesCompleted / 14) * 15;
    score += moduleCompletionScore;

    // Study engagement scoring (10 points max)
    const studyEngagementScore = Math.min(10, (studyTimeHours / 20) * 10);
    score += studyEngagementScore;

    // Add recommendations
    if (modulesCompleted < 12) {
      recommendations.push(
        `Complete more theory modules (${modulesCompleted}/14 done)`,
      );
    }

    if (studyTimeHours < 15) {
      recommendations.push(
        `Increase study time (${Math.round(studyTimeHours)}h of 20h+ recommended)`,
      );
    }

    return { score: Math.round(score), max: maxScore };
  }

  /**
   * 3. Practice Quality (20 points max) - Question volume and accuracy
   */
  private static calculatePracticeQuality(
    userStats: any,
    recommendations: string[],
  ): { score: number; max: number } {
    let score = 0;
    const maxScore = 20;

    const uniqueQuestionsAttempted = userStats.uniqueQuestionsAttempted || 0;
    const questionsPerCategoryMin = userStats.questionsPerCategoryMin || 0;
    const recentAccuracy = userStats.recentAccuracy || 0;
    const perfectScoreRate = userStats.perfectScoreRate || 0;

    // Question volume scoring (8 points max)
    if (uniqueQuestionsAttempted >= 400) score += 8;
    else if (uniqueQuestionsAttempted >= 250) score += 6;
    else if (uniqueQuestionsAttempted >= 150) score += 4;
    else score += 2;

    // Category coverage scoring (7 points max)
    if (questionsPerCategoryMin >= 25) score += 7;
    else if (questionsPerCategoryMin >= 15) score += 5;
    else if (questionsPerCategoryMin >= 10) score += 3;

    // Recent accuracy scoring (5 points max)
    if (recentAccuracy >= 0.85) score += 5;
    else if (recentAccuracy >= 0.8) score += 3;
    else if (recentAccuracy >= 0.75) score += 1;

    // Quality bonuses
    if (perfectScoreRate >= 0.2) score += 3; // Mastery bonus
    if (recentAccuracy >= 0.9 && uniqueQuestionsAttempted >= 200) score += 2; // Excellence bonus

    // Add recommendations
    if (uniqueQuestionsAttempted < 300) {
      recommendations.push(
        `Practice more questions (${uniqueQuestionsAttempted}/400+ recommended)`,
      );
    }

    if (questionsPerCategoryMin < 20) {
      recommendations.push(
        `Practice all categories evenly (min ${questionsPerCategoryMin} per category)`,
      );
    }

    if (recentAccuracy < 0.85) {
      recommendations.push(
        `Improve recent accuracy (${Math.round(recentAccuracy * 100)}% → 85%+)`,
      );
    }

    return { score: Math.min(maxScore, Math.round(score)), max: maxScore };
  }

  /**
   * 4. Learning Consistency (15 points max) - Study habits and retention
   */
  private static calculateLearningConsistency(
    userStats: any,
    recommendations: string[],
  ): { score: number; max: number } {
    let score = 0;
    const maxScore = 15;

    const studyDaysLast2Weeks = userStats.studyDaysLast2Weeks || 0;
    const averageSessionMinutes = userStats.averageSessionMinutes || 0;
    const knowledgeRetentionRate = userStats.knowledgeRetentionRate || 0;
    const daysSinceLastActivity = userStats.daysSinceLastActivity || 999;

    // Study frequency scoring (8 points max)
    if (studyDaysLast2Weeks >= 10) score += 8;
    else if (studyDaysLast2Weeks >= 7) score += 6;
    else if (studyDaysLast2Weeks >= 5) score += 4;
    else if (studyDaysLast2Weeks >= 3) score += 2;

    // Session quality scoring (4 points max)
    if (averageSessionMinutes >= 20) score += 4;
    else if (averageSessionMinutes >= 15) score += 3;
    else if (averageSessionMinutes >= 10) score += 2;
    else if (averageSessionMinutes >= 5) score += 1;

    // Knowledge retention scoring (3 points max)
    if (knowledgeRetentionRate >= 0.9) score += 3;
    else if (knowledgeRetentionRate >= 0.8) score += 2;
    else if (knowledgeRetentionRate >= 0.7) score += 1;

    // Recency penalty
    if (daysSinceLastActivity <= 1) {
      // No penalty
    } else if (daysSinceLastActivity <= 3) {
      score -= 2;
    } else if (daysSinceLastActivity <= 7) {
      score -= 5;
    } else {
      score -= 10;
    }

    // Add recommendations
    if (studyDaysLast2Weeks < 8) {
      recommendations.push(
        `Study more consistently (${studyDaysLast2Weeks}/14 days active)`,
      );
    }

    if (averageSessionMinutes < 15) {
      recommendations.push(
        `Increase session length (${Math.round(averageSessionMinutes)} min → 20+ min)`,
      );
    }

    if (daysSinceLastActivity > 2) {
      recommendations.push(
        "Practice regularly to maintain knowledge retention",
      );
    }

    return { score: Math.max(0, Math.round(score)), max: maxScore };
  }

  /**
   * Enhanced pass likelihood calculation
   */
  private static calculateEnhancedPassLikelihood(
    readinessScore: number,
    userStats: any,
  ): number {
    // Base likelihood from readiness score
    let likelihood = Math.min(95, readinessScore * 0.9);

    // Bonuses for specific strengths
    if (userStats.overallCategoryAverage >= 90) likelihood += 5;
    if (userStats.knowledgeRetentionRate >= 0.9) likelihood += 3;
    if (userStats.studyDaysLast2Weeks >= 10) likelihood += 2;

    // Penalties for risk factors
    if (userStats.overallCategoryAverage < 80) likelihood -= 15;
    if (userStats.recentAccuracy < 0.8) likelihood -= 10;
    if (userStats.daysSinceLastActivity > 7) likelihood -= 8;
    if (userStats.modulesCompleted < 10) likelihood -= 5;

    return Math.min(98, Math.max(5, Math.round(likelihood)));
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

      // Transform overview data for enhanced readiness calculation
      const userStats = {
        // Knowledge Mastery Metrics
        categoriesFullyMastered: this.countFullyMasteredCategories(
          overview.categories || [],
        ),
        overallCategoryAverage: this.calculateOverallCategoryAverage(
          overview.categories || [],
        ),
        weakestCategories: this.findWeakestCategories(
          overview.categories || [],
        ),

        // Learning Depth Metrics (simulated for now - would need actual module/study tracking)
        modulesCompleted: Math.min(
          14,
          Math.floor(
            this.countMasteredCategories(overview.categories || []) * 1.2,
          ),
        ),
        studyTimeHours: this.estimateStudyTimeFromAttempts(
          overview.attempts || [],
        ),

        // Practice Quality Metrics
        uniqueQuestionsAttempted: this.countTotalQuestions(
          overview.attempts || [],
        ),
        questionsPerCategoryMin: this.calculateMinQuestionsPerCategory(
          overview.categories || [],
        ),
        recentAccuracy: this.calculateRecentAccuracy(overview.attempts || []),
        perfectScoreRate: this.calculatePerfectScoreRate(
          overview.attempts || [],
        ),

        // Learning Consistency Metrics
        studyDaysLast2Weeks: this.calculateStudyDaysLast2Weeks(
          overview.attempts || [],
        ),
        averageSessionMinutes: this.calculateAverageSessionLength(
          overview.attempts || [],
        ),
        knowledgeRetentionRate: this.calculateKnowledgeRetention(
          overview.attempts || [],
        ),
        daysSinceLastActivity: this.calculateDaysSinceLastActive(
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
        categoriesFullyMastered: 0,
        totalCategories: 14,
        overallCategoryAverage: 0,
        weakestCategories: [],
        modulesCompleted: 0,
        totalModules: 14,
        studyTimeHours: 0,
        uniqueQuestionsAttempted: 0,
        questionsPerCategoryMin: 0,
        recentAccuracy: 0,
        perfectScoreRate: 0,
        studyDaysLast2Weeks: 0,
        averageSessionMinutes: 0,
        knowledgeRetentionRate: 0,
        daysSinceLastActivity: 999,
        recommendations: [
          "Complete more practice questions to assess readiness",
        ],
        passLikelihood: 0,
        breakdown: {
          knowledgeMastery: { score: 0, max: 40 },
          learningDepth: { score: 0, max: 25 },
          practiceQuality: { score: 0, max: 20 },
          consistency: { score: 0, max: 15 },
        },
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

  // Enhanced helper methods for learning-focused metrics
  private static countFullyMasteredCategories(categories: any[]): number {
    return categories.filter((cat) => {
      const total = cat.total || 0;
      const correct = cat.correct || 0;
      return total >= 20 && correct / total >= 0.85; // Stricter criteria
    }).length;
  }

  private static calculateOverallCategoryAverage(categories: any[]): number {
    if (categories.length === 0) return 0;

    let totalQuestions = 0;
    let correctAnswers = 0;

    categories.forEach((cat) => {
      totalQuestions += cat.total || 0;
      correctAnswers += cat.correct || 0;
    });

    return totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  }

  private static findWeakestCategories(categories: any[]): string[] {
    const validCategories = categories.filter((cat) => (cat.total || 0) > 0);
    if (validCategories.length === 0) return [];

    return validCategories
      .map((cat) => ({
        category: cat.category,
        accuracy: (cat.correct || 0) / (cat.total || 1),
      }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3)
      .filter((cat) => cat.accuracy < 0.8)
      .map((cat) => cat.category);
  }

  private static estimateStudyTimeFromAttempts(attempts: any[]): number {
    // Rough estimate: 2 minutes per question + session overhead
    const totalQuestions = attempts.reduce(
      (sum, attempt) => sum + (attempt.total || 0),
      0,
    );
    const estimatedMinutes = totalQuestions * 2 + attempts.length * 5; // 5 min overhead per session
    return Math.round((estimatedMinutes / 60) * 10) / 10; // Convert to hours, round to 1 decimal
  }

  private static calculateMinQuestionsPerCategory(categories: any[]): number {
    if (categories.length === 0) return 0;
    return Math.min(...categories.map((cat) => cat.total || 0));
  }

  private static calculateRecentAccuracy(attempts: any[]): number {
    const recentAttempts = attempts
      .filter((a) => a.score_percent != null)
      .slice(-20); // Last 20 attempts

    if (recentAttempts.length === 0) return 0;

    const sum = recentAttempts.reduce(
      (acc, attempt) => acc + (attempt.score_percent || 0),
      0,
    );
    return sum / (recentAttempts.length * 100); // Return as decimal
  }

  private static calculatePerfectScoreRate(attempts: any[]): number {
    const validAttempts = attempts.filter((a) => a.score_percent != null);
    if (validAttempts.length === 0) return 0;

    const perfectScores = validAttempts.filter(
      (a) => (a.score_percent || 0) >= 100,
    ).length;
    return perfectScores / validAttempts.length;
  }

  private static calculateStudyDaysLast2Weeks(attempts: any[]): number {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const recentAttempts = attempts.filter((a) => {
      if (!a.finished_at) return false;
      const attemptDate = new Date(a.finished_at);
      return attemptDate >= twoWeeksAgo;
    });

    // Count unique days
    const uniqueDays = new Set(
      recentAttempts.map((a) => new Date(a.finished_at).toDateString()),
    );

    return uniqueDays.size;
  }

  private static calculateAverageSessionLength(attempts: any[]): number {
    const sessionsWithTime = attempts.filter(
      (a) => a.started_at && a.finished_at,
    );
    if (sessionsWithTime.length === 0) return 0;

    const totalMinutes = sessionsWithTime.reduce((sum, attempt) => {
      const start = new Date(attempt.started_at);
      const end = new Date(attempt.finished_at);
      const minutes = (end.getTime() - start.getTime()) / (1000 * 60);
      return sum + Math.min(60, Math.max(1, minutes)); // Cap at 60 min, min 1 min
    }, 0);

    return Math.round(totalMinutes / sessionsWithTime.length);
  }

  private static calculateKnowledgeRetention(attempts: any[]): number {
    // Simple heuristic: if recent performance is maintaining or improving, retention is good
    if (attempts.length < 5) return 0.5; // Not enough data

    const recentAttempts = attempts
      .filter((a) => a.score_percent != null)
      .slice(-10);

    if (recentAttempts.length < 3) return 0.5;

    const firstHalf = recentAttempts.slice(
      0,
      Math.floor(recentAttempts.length / 2),
    );
    const secondHalf = recentAttempts.slice(
      Math.floor(recentAttempts.length / 2),
    );

    const firstAvg =
      firstHalf.reduce((sum, a) => sum + (a.score_percent || 0), 0) /
      firstHalf.length;
    const secondAvg =
      secondHalf.reduce((sum, a) => sum + (a.score_percent || 0), 0) /
      secondHalf.length;

    // If performance is maintained or improved, retention is good
    const retentionRatio = secondAvg / Math.max(firstAvg, 1);
    return Math.min(1, Math.max(0, retentionRatio / 100));
  }
}
