import { z } from 'zod';
export declare const createSubSchema: z.ZodObject<{
    planId: z.ZodString;
    usageFrequency: z.ZodDefault<z.ZodEnum<["DAILY", "WEEKLY", "MONTHLY", "RARELY", "NEVER"]>>;
    lastUsed: z.ZodOptional<z.ZodDate>;
    autoRenew: z.ZodDefault<z.ZodBoolean>;
    notes: z.ZodOptional<z.ZodString>;
    nextBillingDate: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    planId: string;
    usageFrequency: "DAILY" | "WEEKLY" | "MONTHLY" | "RARELY" | "NEVER";
    autoRenew: boolean;
    lastUsed?: Date | undefined;
    notes?: string | undefined;
    nextBillingDate?: Date | undefined;
}, {
    planId: string;
    usageFrequency?: "DAILY" | "WEEKLY" | "MONTHLY" | "RARELY" | "NEVER" | undefined;
    lastUsed?: Date | undefined;
    autoRenew?: boolean | undefined;
    notes?: string | undefined;
    nextBillingDate?: Date | undefined;
}>;
export declare const updateSubSchema: z.ZodObject<{
    planId: z.ZodOptional<z.ZodString>;
    usageFrequency: z.ZodOptional<z.ZodDefault<z.ZodEnum<["DAILY", "WEEKLY", "MONTHLY", "RARELY", "NEVER"]>>>;
    lastUsed: z.ZodOptional<z.ZodOptional<z.ZodDate>>;
    autoRenew: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    nextBillingDate: z.ZodOptional<z.ZodOptional<z.ZodDate>>;
} & {
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    planId?: string | undefined;
    usageFrequency?: "DAILY" | "WEEKLY" | "MONTHLY" | "RARELY" | "NEVER" | undefined;
    lastUsed?: Date | undefined;
    autoRenew?: boolean | undefined;
    notes?: string | undefined;
    nextBillingDate?: Date | undefined;
    isActive?: boolean | undefined;
}, {
    planId?: string | undefined;
    usageFrequency?: "DAILY" | "WEEKLY" | "MONTHLY" | "RARELY" | "NEVER" | undefined;
    lastUsed?: Date | undefined;
    autoRenew?: boolean | undefined;
    notes?: string | undefined;
    nextBillingDate?: Date | undefined;
    isActive?: boolean | undefined;
}>;
export declare const subQuerySchema: z.ZodObject<{
    categoryId: z.ZodOptional<z.ZodString>;
    providerId: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodEffects<z.ZodEnum<["true", "false"]>, boolean, "true" | "false">>;
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodOptional<z.ZodEnum<["monthlyCost", "serviceName", "createdAt", "lastUsed"]>>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    sortOrder: "asc" | "desc";
    page: number;
    pageSize: number;
    search?: string | undefined;
    isActive?: boolean | undefined;
    providerId?: string | undefined;
    categoryId?: string | undefined;
    sortBy?: "lastUsed" | "createdAt" | "monthlyCost" | "serviceName" | undefined;
}, {
    search?: string | undefined;
    isActive?: "true" | "false" | undefined;
    providerId?: string | undefined;
    categoryId?: string | undefined;
    sortBy?: "lastUsed" | "createdAt" | "monthlyCost" | "serviceName" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    page?: number | undefined;
    pageSize?: number | undefined;
}>;
export declare const categoryQuerySchema: z.ZodObject<{
    isActive: z.ZodEffects<z.ZodOptional<z.ZodEnum<["true", "false"]>>, boolean | undefined, "true" | "false" | undefined>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
    isActive?: boolean | undefined;
}, {
    search?: string | undefined;
    isActive?: "true" | "false" | undefined;
}>;
export declare const taxonomyListQuerySchema: z.ZodObject<{
    isActive: z.ZodEffects<z.ZodOptional<z.ZodEnum<["true", "false"]>>, boolean | undefined, "true" | "false" | undefined>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
    isActive?: boolean | undefined;
}, {
    search?: string | undefined;
    isActive?: "true" | "false" | undefined;
}>;
export declare const providerQuerySchema: z.ZodObject<{
    region: z.ZodOptional<z.ZodEnum<["GLOBAL", "INDIA", "US", "EU", "ASIA", "OTHER"]>>;
    isActive: z.ZodEffects<z.ZodOptional<z.ZodEnum<["true", "false"]>>, boolean | undefined, "true" | "false" | undefined>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
    isActive?: boolean | undefined;
    region?: "GLOBAL" | "INDIA" | "US" | "EU" | "ASIA" | "OTHER" | undefined;
}, {
    search?: string | undefined;
    isActive?: "true" | "false" | undefined;
    region?: "GLOBAL" | "INDIA" | "US" | "EU" | "ASIA" | "OTHER" | undefined;
}>;
export declare const taxonomyPlanQuerySchema: z.ZodObject<{
    isActive: z.ZodEffects<z.ZodOptional<z.ZodEnum<["true", "false"]>>, boolean | undefined, "true" | "false" | undefined>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
    isActive?: boolean | undefined;
}, {
    search?: string | undefined;
    isActive?: "true" | "false" | undefined;
}>;
/** @deprecated use taxonomyListQuerySchema — kept for backwards imports */
export declare const subcategoryQuerySchema: z.ZodObject<{
    isActive: z.ZodEffects<z.ZodOptional<z.ZodEnum<["true", "false"]>>, boolean | undefined, "true" | "false" | undefined>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
    isActive?: boolean | undefined;
}, {
    search?: string | undefined;
    isActive?: "true" | "false" | undefined;
}>;
/** @deprecated use taxonomyPlanQuerySchema */
export declare const planQuerySchema: z.ZodObject<{
    isActive: z.ZodEffects<z.ZodOptional<z.ZodEnum<["true", "false"]>>, boolean | undefined, "true" | "false" | undefined>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
    isActive?: boolean | undefined;
}, {
    search?: string | undefined;
    isActive?: "true" | "false" | undefined;
}>;
export type CreateSubInput = z.infer<typeof createSubSchema>;
export type UpdateSubInput = z.infer<typeof updateSubSchema>;
export type SubQuery = z.infer<typeof subQuerySchema>;
export type CategoryQuery = z.infer<typeof categoryQuerySchema>;
export type SubcategoryQuery = z.infer<typeof taxonomyListQuerySchema>;
export type ProviderQuery = z.infer<typeof providerQuerySchema>;
export type PlanQuery = z.infer<typeof taxonomyPlanQuerySchema>;
//# sourceMappingURL=subscription.validator.d.ts.map