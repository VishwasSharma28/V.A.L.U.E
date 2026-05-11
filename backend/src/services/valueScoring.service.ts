import { prisma } from '../lib/prisma';
import { UsageFrequency } from '@prisma/client';

const USAGE_SCORE_MAP: Record<UsageFrequency, number> = {
  DAILY:   100,
  WEEKLY:  80,
  MONTHLY: 55,
  RARELY:  25,
  NEVER:   0,
};

export class ValueScoringService {

  /**
   * Core scoring formula — produces a 0-100 efficiency score.
   * Combines: usage frequency, cost/use ratio, inactivity penalty,
   * feature utilisation, and overlap detection stub.
   */
  static async calculateAndStore(userSubscriptionId: string) {
    const sub = await prisma.userSubscription.findUnique({
      where: { id: userSubscriptionId },
      include: {
        plan: true,
        usageLogs: { orderBy: { sessionDate: 'desc' }, take: 30 },
      },
    });
    if (!sub) return null;

    // 1. Usage score from frequency enum
    const usageScore = USAGE_SCORE_MAP[sub.usageFrequency];

    // 2. Inactivity penalty (0-30 pts lost)
    let inactivityPenalty = 0;
    if (sub.lastUsed) {
      const daysSince = (Date.now() - sub.lastUsed.getTime()) / 86_400_000;
      inactivityPenalty = Math.min(30, daysSince * 0.5);
    } else {
      inactivityPenalty = 20; // never used
    }

    // 3. Cost/use ratio
    const totalHoursLast30 = sub.usageLogs.reduce((s, l) => s + l.durationHours, 0);
    const costPerUse = totalHoursLast30 > 0
      ? sub.plan.monthlyCost / totalHoursLast30
      : sub.plan.monthlyCost; // high cost/use if never logged

    // Normalise costPerUse into 0-100 score (lower cost/hr = better)
    const costScore = Math.max(0, 100 - Math.min(100, costPerUse * 5));

    // 4. Feature utilisation from usage log richness
    const featureCount = sub.usageLogs.reduce((s, l) => s + l.featuresUsed.length, 0);
    const featureScore = Math.min(100, featureCount * 5);

    // 5. Overall
    const efficiencyScore = Math.round(
      usageScore * 0.35 +
      costScore  * 0.30 +
      featureScore * 0.20 -
      inactivityPenalty * 0.15
    );

    const clamped = Math.max(0, Math.min(100, efficiencyScore));
    const wastePercentage = Math.round(100 - clamped);

    const score = await prisma.valueScore.create({
      data: {
        userSubscriptionId,
        efficiencyScore: clamped,
        wastePercentage,
        costPerUse: parseFloat(costPerUse.toFixed(2)),
        usageScore,
        recommendationScore: clamped,
        overallScore: clamped,
      },
    });

    return score;
  }

  /** Recalculate scores for all subscriptions of a user */
  static async recalculateForUser(userId: string) {
    const subs = await prisma.userSubscription.findMany({
      where: { userId, isActive: true },
      select: { id: true },
    });
    await Promise.allSettled(subs.map(s => this.calculateAndStore(s.id)));
  }
}
