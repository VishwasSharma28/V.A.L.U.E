import { CreateSubInput, UpdateSubInput, SubQuery } from '../validators/subscription.validator';
import { UserSubscription, ValueScore } from '@prisma/client';
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
    items: SubWithScore[];
    total: number;
    page: number;
    pageSize: number;
}
export declare function listSubscriptions(userId: string, query: SubQuery): Promise<SubListResult>;
export declare function createSubscription(userId: string, input: CreateSubInput): Promise<{
    plan: {
        planType: {
            provider: {
                subcategory: {
                    category: {
                        description: string | null;
                        id: string;
                        isActive: boolean;
                        createdAt: Date;
                        name: string;
                        order: number;
                        icon: string | null;
                        color: string | null;
                    };
                } & {
                    description: string | null;
                    id: string;
                    isActive: boolean;
                    createdAt: Date;
                    name: string;
                    order: number;
                    categoryId: string;
                    icon: string | null;
                };
            } & {
                description: string | null;
                id: string;
                isActive: boolean;
                createdAt: Date;
                name: string;
                tags: string[];
                subcategoryId: string;
                logoUrl: string | null;
                website: string | null;
                region: import(".prisma/client").$Enums.Region;
                businessType: import(".prisma/client").$Enums.BusinessType;
            };
        } & {
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            name: string;
            providerId: string;
            order: number;
        };
    } & {
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        name: string;
        planTypeId: string;
        monthlyCost: number;
        billingCycle: import(".prisma/client").$Enums.BillingCycle;
        features: string[];
        tags: string[];
        isPopular: boolean;
    };
} & {
    id: string;
    userId: string;
    planId: string;
    usageFrequency: import(".prisma/client").$Enums.UsageFrequency;
    lastUsed: Date | null;
    autoRenew: boolean;
    notes: string | null;
    nextBillingDate: Date | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function getSubscription(id: string, userId: string): Promise<{
    plan: {
        planType: {
            provider: {
                subcategory: {
                    category: {
                        description: string | null;
                        id: string;
                        isActive: boolean;
                        createdAt: Date;
                        name: string;
                        order: number;
                        icon: string | null;
                        color: string | null;
                    };
                } & {
                    description: string | null;
                    id: string;
                    isActive: boolean;
                    createdAt: Date;
                    name: string;
                    order: number;
                    categoryId: string;
                    icon: string | null;
                };
            } & {
                description: string | null;
                id: string;
                isActive: boolean;
                createdAt: Date;
                name: string;
                tags: string[];
                subcategoryId: string;
                logoUrl: string | null;
                website: string | null;
                region: import(".prisma/client").$Enums.Region;
                businessType: import(".prisma/client").$Enums.BusinessType;
            };
        } & {
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            name: string;
            providerId: string;
            order: number;
        };
    } & {
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        name: string;
        planTypeId: string;
        monthlyCost: number;
        billingCycle: import(".prisma/client").$Enums.BillingCycle;
        features: string[];
        tags: string[];
        isPopular: boolean;
    };
    usageLogs: {
        id: string;
        userId: string;
        notes: string | null;
        createdAt: Date;
        sessionDate: Date;
        userSubscriptionId: string;
        durationHours: number;
        featuresUsed: string[];
    }[];
    valueScores: {
        id: string;
        efficiencyScore: number;
        wastePercentage: number;
        costPerUse: number;
        usageScore: number;
        recommendationScore: number;
        overallScore: number;
        computedAt: Date;
        userSubscriptionId: string;
    }[];
} & {
    id: string;
    userId: string;
    planId: string;
    usageFrequency: import(".prisma/client").$Enums.UsageFrequency;
    lastUsed: Date | null;
    autoRenew: boolean;
    notes: string | null;
    nextBillingDate: Date | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function updateSubscription(id: string, userId: string, input: UpdateSubInput): Promise<{
    plan: {
        planType: {
            provider: {
                subcategory: {
                    category: {
                        description: string | null;
                        id: string;
                        isActive: boolean;
                        createdAt: Date;
                        name: string;
                        order: number;
                        icon: string | null;
                        color: string | null;
                    };
                } & {
                    description: string | null;
                    id: string;
                    isActive: boolean;
                    createdAt: Date;
                    name: string;
                    order: number;
                    categoryId: string;
                    icon: string | null;
                };
            } & {
                description: string | null;
                id: string;
                isActive: boolean;
                createdAt: Date;
                name: string;
                tags: string[];
                subcategoryId: string;
                logoUrl: string | null;
                website: string | null;
                region: import(".prisma/client").$Enums.Region;
                businessType: import(".prisma/client").$Enums.BusinessType;
            };
        } & {
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            name: string;
            providerId: string;
            order: number;
        };
    } & {
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        name: string;
        planTypeId: string;
        monthlyCost: number;
        billingCycle: import(".prisma/client").$Enums.BillingCycle;
        features: string[];
        tags: string[];
        isPopular: boolean;
    };
} & {
    id: string;
    userId: string;
    planId: string;
    usageFrequency: import(".prisma/client").$Enums.UsageFrequency;
    lastUsed: Date | null;
    autoRenew: boolean;
    notes: string | null;
    nextBillingDate: Date | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function deleteSubscription(id: string, userId: string): Promise<void>;
export declare function listCategories(query?: {
    isActive?: boolean;
    search?: string;
}): Promise<{
    description: string | null;
    id: string;
    isActive: boolean;
    createdAt: Date;
    name: string;
    order: number;
    icon: string | null;
    color: string | null;
}[]>;
export declare function listSubcategories(categoryId: string, query?: {
    isActive?: boolean;
    search?: string;
}): Promise<{
    description: string | null;
    id: string;
    isActive: boolean;
    createdAt: Date;
    name: string;
    order: number;
    categoryId: string;
    icon: string | null;
}[]>;
export declare function listProviders(subcategoryId: string, query?: {
    region?: string;
    isActive?: boolean;
    search?: string;
}): Promise<{
    description: string | null;
    id: string;
    isActive: boolean;
    createdAt: Date;
    name: string;
    tags: string[];
    subcategoryId: string;
    logoUrl: string | null;
    website: string | null;
    region: import(".prisma/client").$Enums.Region;
    businessType: import(".prisma/client").$Enums.BusinessType;
}[]>;
export declare function listPlanTypes(providerId: string, query?: {
    isActive?: boolean;
    search?: string;
}): Promise<{
    description: string | null;
    id: string;
    isActive: boolean;
    createdAt: Date;
    name: string;
    providerId: string;
    order: number;
}[]>;
export declare function listPlans(planTypeId: string, query?: {
    isActive?: boolean;
    search?: string;
}): Promise<{
    description: string | null;
    id: string;
    isActive: boolean;
    createdAt: Date;
    name: string;
    planTypeId: string;
    monthlyCost: number;
    billingCycle: import(".prisma/client").$Enums.BillingCycle;
    features: string[];
    tags: string[];
    isPopular: boolean;
}[]>;
export declare function getScore(id: string, userId: string): Promise<{
    id: string;
    efficiencyScore: number;
    wastePercentage: number;
    costPerUse: number;
    usageScore: number;
    recommendationScore: number;
    overallScore: number;
    computedAt: Date;
    userSubscriptionId: string;
}>;
export declare function getSubscriptionScore(id: string, userId: string): Promise<{
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
//# sourceMappingURL=subscription.service.d.ts.map