type Granularity = 'daily' | 'weekly' | 'monthly' | 'yearly';
export interface AnalyticsSummary {
    totalMonthlySpend: number;
    totalWaste: number;
    avgEfficiencyScore: number;
    recoveredValue: number;
    activeSubscriptions: number;
    totalUsageLogs: number;
}
export declare class AnalyticsService {
    static getSpendTrend(userId: string, granularity?: Granularity): Promise<unknown[]>;
    static getCategoryBreakdown(userId: string): Promise<unknown[]>;
    static getSummary(userId: string): Promise<AnalyticsSummary>;
    static getEfficiencyTrend(userId: string): Promise<{
        month: string;
        score: number;
    }[]>;
    static storeSnapshot(userId: string, period: string, granularity: string): Promise<void>;
}
export {};
//# sourceMappingURL=analytics.service.d.ts.map