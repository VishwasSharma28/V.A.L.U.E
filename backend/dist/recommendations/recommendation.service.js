"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationService = void 0;
const prisma_1 = require("../lib/prisma");
const ai_service_1 = require("../ai/ai.service");
const analytics_service_1 = require("../analytics/analytics.service");
const redis_1 = require("../lib/redis");
const logger_1 = require("../utils/logger");
class RecommendationService {
    static async generateForUser(userId) {
        try {
            const [subs, summary, settings] = await Promise.all([
                prisma_1.prisma.userSubscription.findMany({
                    where: { userId, isActive: true },
                    include: {
                        valueScores: { orderBy: { computedAt: 'desc' }, take: 1 },
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
                }),
                analytics_service_1.AnalyticsService.getSummary(userId),
                prisma_1.prisma.settings.findUnique({ where: { userId } }),
            ]);
            if (!subs.length)
                return [];
            const aiInput = {
                subscriptions: subs.map(s => ({
                    serviceName: s.plan.name,
                    category: s.plan.planType.provider.subcategory.category.name,
                    monthlyCost: s.plan.monthlyCost,
                    usageFrequency: s.usageFrequency,
                    lastUsed: s.lastUsed?.toISOString(),
                    efficiencyScore: s.valueScores[0]?.efficiencyScore,
                    wastePercentage: s.valueScores[0]?.wastePercentage,
                })),
                totalMonthlySpend: summary.totalMonthlySpend,
                avgScore: summary.avgEfficiencyScore,
                currency: settings?.currency ?? 'INR',
            };
            const aiRecs = await (0, ai_service_1.generateAIRecommendations)(aiInput);
            const created = await Promise.all(aiRecs.map(r => prisma_1.prisma.recommendation.create({
                data: {
                    userId,
                    type: r.type,
                    title: r.title,
                    description: r.description,
                    savingAmount: r.savingAmount,
                    impactScore: r.impactScore,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            })));
            await (0, redis_1.cacheDelPattern)(`recs:${userId}:*`);
            return created;
        }
        catch (err) {
            logger_1.logger.error('Recommendation generation failed:', err);
            return [];
        }
    }
    static async getForUser(userId, includeRead = false) {
        return prisma_1.prisma.recommendation.findMany({
            where: {
                userId,
                isDismissed: false,
                ...(includeRead ? {} : { isRead: false }),
                OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
            },
            orderBy: [{ impactScore: 'desc' }, { createdAt: 'desc' }],
            take: 20,
        });
    }
    static async markRead(id, _userId) {
        return prisma_1.prisma.recommendation.update({
            where: { id },
            data: { isRead: true },
        });
    }
    static async dismiss(id, _userId) {
        return prisma_1.prisma.recommendation.update({
            where: { id },
            data: { isDismissed: true },
        });
    }
}
exports.RecommendationService = RecommendationService;
//# sourceMappingURL=recommendation.service.js.map