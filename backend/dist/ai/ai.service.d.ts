export interface AIInsightInput {
    subscriptions: {
        serviceName: string;
        category: string;
        monthlyCost: number;
        usageFrequency: string;
        lastUsed?: string;
        efficiencyScore?: number;
        wastePercentage?: number;
    }[];
    totalMonthlySpend: number;
    avgScore: number;
    currency: string;
}
export interface AIRecommendation {
    type: string;
    title: string;
    description: string;
    savingAmount?: number;
    impactScore: number;
}
/**
 * Generate AI-powered recommendations using OpenAI.
 * Falls back to rule-based recommendations if API key missing.
 */
export declare function generateAIRecommendations(input: AIInsightInput): Promise<AIRecommendation[]>;
/** Summarise a single subscription in natural language */
export declare function summariseSubscription(serviceName: string, score: number, spend: number, currency: string): Promise<string>;
//# sourceMappingURL=ai.service.d.ts.map