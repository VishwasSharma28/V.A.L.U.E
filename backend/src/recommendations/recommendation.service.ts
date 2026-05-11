import { prisma }                    from '../lib/prisma';
import { generateAIRecommendations } from '../ai/ai.service';
import { AnalyticsService }          from '../analytics/analytics.service';
import { cacheDelPattern }           from '../lib/redis';
import { logger }                    from '../utils/logger';
import { RecommendationType }        from '@prisma/client';

export class RecommendationService {

  static async generateForUser(userId: string) {
    try {
      const [subs, summary, settings] = await Promise.all([
        prisma.userSubscription.findMany({
          where:   { userId, isActive: true },
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
        AnalyticsService.getSummary(userId),
        prisma.settings.findUnique({ where: { userId } }),
      ]);

      if (!subs.length) return [];

      const aiInput = {
        subscriptions: subs.map(s => ({
          serviceName:      s.plan.name,
          category:         s.plan.planType.provider.subcategory.category.name,
          monthlyCost:      s.plan.monthlyCost,
          usageFrequency:   s.usageFrequency,
          lastUsed:         s.lastUsed?.toISOString(),
          efficiencyScore:  s.valueScores[0]?.efficiencyScore,
          wastePercentage:  s.valueScores[0]?.wastePercentage,
        })),
        totalMonthlySpend: summary.totalMonthlySpend,
        avgScore:          summary.avgEfficiencyScore,
        currency:          settings?.currency ?? 'INR',
      };

      const aiRecs = await generateAIRecommendations(aiInput);

      const created = await Promise.all(
        aiRecs.map(r =>
          prisma.recommendation.create({
            data: {
              userId,
              type:         r.type as RecommendationType,
              title:        r.title,
              description:  r.description,
              savingAmount: r.savingAmount,
              impactScore:  r.impactScore,
              expiresAt:    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          })
        )
      );

      await cacheDelPattern(`recs:${userId}:*`);
      return created;
    } catch (err) {
      logger.error('Recommendation generation failed:', err);
      return [];
    }
  }

  static async getForUser(userId: string, includeRead = false) {
    return prisma.recommendation.findMany({
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

  static async markRead(id: string, _userId: string) {
    return prisma.recommendation.update({
      where: { id },
      data:  { isRead: true },
    });
  }

  static async dismiss(id: string, _userId: string) {
    return prisma.recommendation.update({
      where: { id },
      data:  { isDismissed: true },
    });
  }
}
