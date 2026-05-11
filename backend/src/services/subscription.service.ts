import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/ApiError';
import { cacheGet, cacheSet, cacheDelPattern } from '../lib/redis';
import { ValueScoringService } from './valueScoring.service';
import { CreateSubInput, UpdateSubInput, SubQuery } from '../validators/subscription.validator';
import { Prisma, Region, UserSubscription, ValueScore } from '@prisma/client';

const CACHE_TTL = 120; // 2 min

// ─── Return types ─────────────────────────────────────────
export interface SubWithScore extends UserSubscription {
  plan: {
    id: string;
    name: string;
    monthlyCost: number;
    billingCycle: string;
    features: string[];
    planType: {
      name: string;
      provider: {
        name: string;
        logoUrl?: string;
        subcategory: {
          name: string;
          category: {
            name: string;
            icon?: string;
            color?: string;
          };
        };
      };
    };
  };
  valueScores: ValueScore[];
}

export interface SubListResult {
  items:    SubWithScore[];
  total:    number;
  page:     number;
  pageSize: number;
}

// ─── Service functions ────────────────────────────────────

export async function listSubscriptions(
  userId: string,
  query: SubQuery
): Promise<SubListResult> {
  const cacheKey = `subs:${userId}:${JSON.stringify(query)}`;
  const cached   = await cacheGet<SubListResult>(cacheKey);
  if (cached) return cached;

  const where: Prisma.UserSubscriptionWhereInput = {
    userId,
    ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
    ...(query.categoryId ? {
      plan: {
        planType: {
          provider: {
            subcategory: {
              categoryId: query.categoryId
            }
          }
        }
      }
    } : {}),
    ...(query.providerId ? {
      plan: {
        planType: {
          providerId: query.providerId
        }
      }
    } : {}),
    ...(query.search ? {
      plan: {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' as const } },
          { planType: { provider: { name: { contains: query.search, mode: 'insensitive' as const } } } },
          { planType: { provider: { subcategory: { name: { contains: query.search, mode: 'insensitive' as const } } } } },
          { planType: { provider: { subcategory: { category: { name: { contains: query.search, mode: 'insensitive' as const } } } } } },
        ]
      }
    } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.userSubscription.findMany({
      where,
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
        },
        valueScores: { orderBy: { computedAt: 'desc' }, take: 1 }
      },
      orderBy: { [query.sortBy ?? 'createdAt']: query.sortOrder },
      skip:    (query.page - 1) * query.pageSize,
      take:    query.pageSize,
    }),
    prisma.userSubscription.count({ where }),
  ]);

  const result: SubListResult = {
    items: items as SubWithScore[],
    total,
    page:     query.page,
    pageSize: query.pageSize,
  };
  await cacheSet(cacheKey, result, CACHE_TTL);
  return result;
}

export async function createSubscription(userId: string, input: CreateSubInput) {
  // Verify plan exists
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: input.planId }
  });
  if (!plan) throw ApiError.notFound('Plan not found');

  // Check if user already has this subscription
  const existing = await prisma.userSubscription.findFirst({
    where: { userId, planId: input.planId, isActive: true }
  });
  if (existing) throw ApiError.badRequest('You already have this subscription');

  const sub = await prisma.userSubscription.create({
    data: { ...input, userId },
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
    }
  });

  // Fire-and-forget score calculation
  ValueScoringService.calculateAndStore(sub.id).catch(() => {});
  await cacheDelPattern(`subs:${userId}:*`);
  return sub;
}

export async function getSubscription(id: string, userId: string) {
  const sub = await prisma.userSubscription.findFirst({
    where:   { id, userId },
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
      },
      valueScores: { orderBy: { computedAt: 'desc' }, take: 1 },
      usageLogs:   { take: 10, orderBy: { sessionDate: 'desc' } },
    },
  });
  if (!sub) throw ApiError.notFound('Subscription not found');
  return sub;
}

export async function updateSubscription(
  id: string,
  userId: string,
  input: UpdateSubInput
) {
  const existing = await prisma.userSubscription.findFirst({ where: { id, userId } });
  if (!existing) throw ApiError.notFound('Subscription not found');

  const updated = await prisma.userSubscription.update({
    where: { id },
    data: input,
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
    }
  });

  if (input.usageFrequency || input.lastUsed) {
    ValueScoringService.calculateAndStore(id).catch(() => {});
  }
  await cacheDelPattern(`subs:${userId}:*`);
  return updated;
}

export async function deleteSubscription(id: string, userId: string) {
  const existing = await prisma.userSubscription.findFirst({ where: { id, userId } });
  if (!existing) throw ApiError.notFound('Subscription not found');

  await prisma.userSubscription.update({
    where: { id },
    data: { isActive: false }
  });

  await cacheDelPattern(`subs:${userId}:*`);
}

// ─── Taxonomy services ────────────────────────────────────

export async function listCategories(query: { isActive?: boolean; search?: string } = {}) {
  return prisma.subscriptionCategory.findMany({
    where: {
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
      ...(query.search
        ? { name: { contains: query.search, mode: 'insensitive' as const } }
        : {}),
    },
    orderBy: { order: 'asc' },
  });
}

export async function listSubcategories(
  categoryId: string,
  query: { isActive?: boolean; search?: string } = {}
) {
  return prisma.subscriptionSubcategory.findMany({
    where: {
      categoryId,
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
      ...(query.search
        ? { name: { contains: query.search, mode: 'insensitive' as const } }
        : {}),
    },
    orderBy: { order: 'asc' },
  });
}

export async function listProviders(
  subcategoryId: string,
  query: { region?: string; isActive?: boolean; search?: string } = {}
) {
  return prisma.subscriptionProvider.findMany({
    where: {
      subcategoryId,
      ...(query.region ? { region: query.region as Region } : {}),
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
      ...(query.search
        ? { name: { contains: query.search, mode: 'insensitive' as const } }
        : {}),
    },
    orderBy: { name: 'asc' },
  });
}

export async function listPlanTypes(
  providerId: string,
  query: { isActive?: boolean; search?: string } = {}
) {
  return prisma.subscriptionPlanType.findMany({
    where: {
      providerId,
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
      ...(query.search
        ? { name: { contains: query.search, mode: 'insensitive' as const } }
        : {}),
    },
    orderBy: { order: 'asc' },
  });
}

export async function listPlans(planTypeId: string, query: { isActive?: boolean; search?: string } = {}) {
  return prisma.subscriptionPlan.findMany({
    where: {
      planTypeId,
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
      ...(query.search
        ? { name: { contains: query.search, mode: 'insensitive' as const } }
        : {}),
    },
    orderBy: { monthlyCost: 'asc' },
  });
}

export async function getScore(id: string, userId: string) {
  const sub = await prisma.userSubscription.findFirst({
    where: { id, userId },
    include: { valueScores: { orderBy: { computedAt: 'desc' }, take: 1 } }
  });
  if (!sub) throw ApiError.notFound('Subscription not found');

  return sub.valueScores[0] || null;
}

export async function getSubscriptionScore(id: string, userId: string) {
  const existing = await prisma.userSubscription.findFirst({ where: { id, userId } });
  if (!existing) throw ApiError.notFound('Subscription not found');

  const score = await prisma.valueScore.findFirst({
    where:   { userSubscriptionId: id },
    orderBy: { computedAt: 'desc' },
  });
  if (!score) return ValueScoringService.calculateAndStore(id);
  return score;
}
