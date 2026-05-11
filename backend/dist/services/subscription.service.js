"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSubscriptions = listSubscriptions;
exports.createSubscription = createSubscription;
exports.getSubscription = getSubscription;
exports.updateSubscription = updateSubscription;
exports.deleteSubscription = deleteSubscription;
exports.listCategories = listCategories;
exports.listSubcategories = listSubcategories;
exports.listProviders = listProviders;
exports.listPlanTypes = listPlanTypes;
exports.listPlans = listPlans;
exports.getScore = getScore;
exports.getSubscriptionScore = getSubscriptionScore;
const prisma_1 = require("../lib/prisma");
const ApiError_1 = require("../utils/ApiError");
const redis_1 = require("../lib/redis");
const valueScoring_service_1 = require("./valueScoring.service");
const CACHE_TTL = 120; // 2 min
// ─── Service functions ────────────────────────────────────
async function listSubscriptions(userId, query) {
    const cacheKey = `subs:${userId}:${JSON.stringify(query)}`;
    const cached = await (0, redis_1.cacheGet)(cacheKey);
    if (cached)
        return cached;
    const where = {
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
                    { name: { contains: query.search, mode: 'insensitive' } },
                    { planType: { provider: { name: { contains: query.search, mode: 'insensitive' } } } },
                    { planType: { provider: { subcategory: { name: { contains: query.search, mode: 'insensitive' } } } } },
                    { planType: { provider: { subcategory: { category: { name: { contains: query.search, mode: 'insensitive' } } } } } },
                ]
            }
        } : {}),
    };
    const [items, total] = await Promise.all([
        prisma_1.prisma.userSubscription.findMany({
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
            skip: (query.page - 1) * query.pageSize,
            take: query.pageSize,
        }),
        prisma_1.prisma.userSubscription.count({ where }),
    ]);
    const result = {
        items: items,
        total,
        page: query.page,
        pageSize: query.pageSize,
    };
    await (0, redis_1.cacheSet)(cacheKey, result, CACHE_TTL);
    return result;
}
async function createSubscription(userId, input) {
    // Verify plan exists
    const plan = await prisma_1.prisma.subscriptionPlan.findUnique({
        where: { id: input.planId }
    });
    if (!plan)
        throw ApiError_1.ApiError.notFound('Plan not found');
    // Check if user already has this subscription
    const existing = await prisma_1.prisma.userSubscription.findFirst({
        where: { userId, planId: input.planId, isActive: true }
    });
    if (existing)
        throw ApiError_1.ApiError.badRequest('You already have this subscription');
    const sub = await prisma_1.prisma.userSubscription.create({
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
    valueScoring_service_1.ValueScoringService.calculateAndStore(sub.id).catch(() => { });
    await (0, redis_1.cacheDelPattern)(`subs:${userId}:*`);
    return sub;
}
async function getSubscription(id, userId) {
    const sub = await prisma_1.prisma.userSubscription.findFirst({
        where: { id, userId },
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
            usageLogs: { take: 10, orderBy: { sessionDate: 'desc' } },
        },
    });
    if (!sub)
        throw ApiError_1.ApiError.notFound('Subscription not found');
    return sub;
}
async function updateSubscription(id, userId, input) {
    const existing = await prisma_1.prisma.userSubscription.findFirst({ where: { id, userId } });
    if (!existing)
        throw ApiError_1.ApiError.notFound('Subscription not found');
    const updated = await prisma_1.prisma.userSubscription.update({
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
        valueScoring_service_1.ValueScoringService.calculateAndStore(id).catch(() => { });
    }
    await (0, redis_1.cacheDelPattern)(`subs:${userId}:*`);
    return updated;
}
async function deleteSubscription(id, userId) {
    const existing = await prisma_1.prisma.userSubscription.findFirst({ where: { id, userId } });
    if (!existing)
        throw ApiError_1.ApiError.notFound('Subscription not found');
    await prisma_1.prisma.userSubscription.update({
        where: { id },
        data: { isActive: false }
    });
    await (0, redis_1.cacheDelPattern)(`subs:${userId}:*`);
}
// ─── Taxonomy services ────────────────────────────────────
async function listCategories(query = {}) {
    return prisma_1.prisma.subscriptionCategory.findMany({
        where: {
            ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
            ...(query.search
                ? { name: { contains: query.search, mode: 'insensitive' } }
                : {}),
        },
        orderBy: { order: 'asc' },
    });
}
async function listSubcategories(categoryId, query = {}) {
    return prisma_1.prisma.subscriptionSubcategory.findMany({
        where: {
            categoryId,
            ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
            ...(query.search
                ? { name: { contains: query.search, mode: 'insensitive' } }
                : {}),
        },
        orderBy: { order: 'asc' },
    });
}
async function listProviders(subcategoryId, query = {}) {
    return prisma_1.prisma.subscriptionProvider.findMany({
        where: {
            subcategoryId,
            ...(query.region ? { region: query.region } : {}),
            ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
            ...(query.search
                ? { name: { contains: query.search, mode: 'insensitive' } }
                : {}),
        },
        orderBy: { name: 'asc' },
    });
}
async function listPlanTypes(providerId, query = {}) {
    return prisma_1.prisma.subscriptionPlanType.findMany({
        where: {
            providerId,
            ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
            ...(query.search
                ? { name: { contains: query.search, mode: 'insensitive' } }
                : {}),
        },
        orderBy: { order: 'asc' },
    });
}
async function listPlans(planTypeId, query = {}) {
    return prisma_1.prisma.subscriptionPlan.findMany({
        where: {
            planTypeId,
            ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
            ...(query.search
                ? { name: { contains: query.search, mode: 'insensitive' } }
                : {}),
        },
        orderBy: { monthlyCost: 'asc' },
    });
}
async function getScore(id, userId) {
    const sub = await prisma_1.prisma.userSubscription.findFirst({
        where: { id, userId },
        include: { valueScores: { orderBy: { computedAt: 'desc' }, take: 1 } }
    });
    if (!sub)
        throw ApiError_1.ApiError.notFound('Subscription not found');
    return sub.valueScores[0] || null;
}
async function getSubscriptionScore(id, userId) {
    const existing = await prisma_1.prisma.userSubscription.findFirst({ where: { id, userId } });
    if (!existing)
        throw ApiError_1.ApiError.notFound('Subscription not found');
    const score = await prisma_1.prisma.valueScore.findFirst({
        where: { userSubscriptionId: id },
        orderBy: { computedAt: 'desc' },
    });
    if (!score)
        return valueScoring_service_1.ValueScoringService.calculateAndStore(id);
    return score;
}
//# sourceMappingURL=subscription.service.js.map