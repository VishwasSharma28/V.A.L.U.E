"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const prisma_1 = require("../lib/prisma");
const redis_1 = require("../lib/redis");
class AnalyticsService {
    static async getSpendTrend(userId, granularity = 'monthly') {
        const cacheKey = `analytics:trend:${userId}:${granularity}`;
        const cached = await (0, redis_1.cacheGet)(cacheKey);
        if (cached)
            return cached;
        const subs = await prisma_1.prisma.userSubscription.findMany({
            where: { userId, isActive: true },
            select: { plan: { select: { monthlyCost: true, billingCycle: true } } },
        });
        const scores = await prisma_1.prisma.valueScore.findMany({
            where: { userSubscription: { userId } },
            orderBy: { computedAt: 'desc' },
            distinct: ['userSubscriptionId'],
        });
        const avgWastePct = scores.length
            ? scores.reduce((s, sc) => s + sc.wastePercentage, 0) / scores.length
            : 30;
        const monthlyTotal = subs.reduce((s, sub) => {
            const monthly = sub.plan.billingCycle === 'ANNUAL' ? sub.plan.monthlyCost / 12 :
                sub.plan.billingCycle === 'QUARTERLY' ? sub.plan.monthlyCost / 3 :
                    sub.plan.billingCycle === 'SEMI_ANNUAL' ? sub.plan.monthlyCost / 6 :
                        sub.plan.monthlyCost;
            return s + monthly;
        }, 0);
        const months = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (6 - i));
            return d.toLocaleString('default', { month: 'short' });
        });
        const wasteMonthly = monthlyTotal * (avgWastePct / 100);
        const trend = months.map((m) => ({
            month: m,
            spend: parseFloat(monthlyTotal.toFixed(0)),
            waste: parseFloat(wasteMonthly.toFixed(0)),
        }));
        await (0, redis_1.cacheSet)(cacheKey, trend, 600);
        return trend;
    }
    static async getCategoryBreakdown(userId) {
        const cacheKey = `analytics:category:${userId}`;
        const cached = await (0, redis_1.cacheGet)(cacheKey);
        if (cached)
            return cached;
        const subs = await prisma_1.prisma.userSubscription.findMany({
            where: { userId, isActive: true },
            include: {
                plan: {
                    include: {
                        planType: {
                            include: {
                                provider: {
                                    include: {
                                        subcategory: {
                                            include: {
                                                category: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
        });
        const map = {};
        for (const s of subs) {
            const categoryName = s.plan.planType.provider.subcategory.category.name;
            map[categoryName] = (map[categoryName] ?? 0) + s.plan.monthlyCost;
        }
        const result = Object.entries(map).map(([name, value]) => ({
            name,
            value: parseFloat(value.toFixed(2)),
        }));
        await (0, redis_1.cacheSet)(cacheKey, result, 300);
        return result;
    }
    static async getSummary(userId) {
        const cacheKey = `analytics:summary:${userId}`;
        const cached = await (0, redis_1.cacheGet)(cacheKey);
        if (cached)
            return cached;
        const [subs, scores, usageLogs] = await Promise.all([
            prisma_1.prisma.userSubscription.findMany({
                where: { userId, isActive: true },
                select: { plan: { select: { monthlyCost: true, billingCycle: true } } },
            }),
            prisma_1.prisma.valueScore.findMany({
                where: { userSubscription: { userId } },
                distinct: ['userSubscriptionId'],
                orderBy: { computedAt: 'desc' },
            }),
            prisma_1.prisma.usageLog.count({ where: { userId } }),
        ]);
        const totalMonthly = subs.reduce((s, sub) => {
            const m = sub.plan.billingCycle === 'ANNUAL' ? sub.plan.monthlyCost / 12 :
                sub.plan.billingCycle === 'QUARTERLY' ? sub.plan.monthlyCost / 3 :
                    sub.plan.billingCycle === 'SEMI_ANNUAL' ? sub.plan.monthlyCost / 6 :
                        sub.plan.monthlyCost;
            return s + m;
        }, 0);
        const avgScore = scores.length
            ? scores.reduce((s, sc) => s + sc.overallScore, 0) / scores.length
            : 0;
        const totalWaste = totalMonthly * (100 - avgScore) / 100;
        const recovered = totalWaste * 0.15;
        const result = {
            totalMonthlySpend: parseFloat(totalMonthly.toFixed(2)),
            totalWaste: parseFloat(totalWaste.toFixed(2)),
            avgEfficiencyScore: parseFloat(avgScore.toFixed(1)),
            recoveredValue: parseFloat(recovered.toFixed(2)),
            activeSubscriptions: subs.length,
            totalUsageLogs: usageLogs,
        };
        await (0, redis_1.cacheSet)(cacheKey, result, 300);
        return result;
    }
    static async getEfficiencyTrend(userId) {
        const scores = await prisma_1.prisma.valueScore.findMany({
            where: { userSubscription: { userId } },
            orderBy: { computedAt: 'asc' },
            take: 60,
        });
        const monthMap = {};
        for (const s of scores) {
            const key = s.computedAt.toLocaleString('default', { month: 'short' });
            (monthMap[key] ??= []).push(s.overallScore);
        }
        return Object.entries(monthMap).map(([month, vals]) => ({
            month,
            score: parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)),
        }));
    }
    static async storeSnapshot(userId, period, granularity) {
        const summary = await this.getSummary(userId);
        const cats = await this.getCategoryBreakdown(userId);
        const wastePercent = summary.totalMonthlySpend > 0
            ? (summary.totalWaste / summary.totalMonthlySpend) * 100
            : 0;
        await prisma_1.prisma.analyticsSnapshot.upsert({
            where: { userId_period_granularity: { userId, period, granularity } },
            create: {
                userId, period, granularity,
                totalSpend: summary.totalMonthlySpend,
                totalWaste: summary.totalWaste,
                wastePercent,
                avgScore: summary.avgEfficiencyScore,
                categoryBreakdown: cats,
                recoveredValue: summary.recoveredValue,
            },
            update: {
                totalSpend: summary.totalMonthlySpend,
                totalWaste: summary.totalWaste,
                wastePercent,
                avgScore: summary.avgEfficiencyScore,
                categoryBreakdown: cats,
                recoveredValue: summary.recoveredValue,
            },
        });
    }
}
exports.AnalyticsService = AnalyticsService;
//# sourceMappingURL=analytics.service.js.map