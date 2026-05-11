export declare class ValueScoringService {
    /**
     * Core scoring formula — produces a 0-100 efficiency score.
     * Combines: usage frequency, cost/use ratio, inactivity penalty,
     * feature utilisation, and overlap detection stub.
     */
    static calculateAndStore(userSubscriptionId: string): Promise<{
        id: string;
        efficiencyScore: number;
        wastePercentage: number;
        costPerUse: number;
        usageScore: number;
        recommendationScore: number;
        overallScore: number;
        computedAt: Date;
        userSubscriptionId: string;
    } | null>;
    /** Recalculate scores for all subscriptions of a user */
    static recalculateForUser(userId: string): Promise<void>;
}
//# sourceMappingURL=valueScoring.service.d.ts.map