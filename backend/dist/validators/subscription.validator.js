"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planQuerySchema = exports.subcategoryQuerySchema = exports.taxonomyPlanQuerySchema = exports.providerQuerySchema = exports.taxonomyListQuerySchema = exports.categoryQuerySchema = exports.subQuerySchema = exports.updateSubSchema = exports.createSubSchema = void 0;
const zod_1 = require("zod");
const billing = ['MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL', 'LIFETIME', 'ONE_TIME'];
const frequency = ['DAILY', 'WEEKLY', 'MONTHLY', 'RARELY', 'NEVER'];
const optionalBoolQuery = zod_1.z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true'));
exports.createSubSchema = zod_1.z.object({
    planId: zod_1.z.string().uuid(),
    usageFrequency: zod_1.z.enum(frequency).default('MONTHLY'),
    lastUsed: zod_1.z.coerce.date().optional(),
    autoRenew: zod_1.z.boolean().default(true),
    notes: zod_1.z.string().max(500).optional(),
    nextBillingDate: zod_1.z.coerce.date().optional(),
});
exports.updateSubSchema = exports.createSubSchema.partial().extend({
    isActive: zod_1.z.boolean().optional(),
});
exports.subQuerySchema = zod_1.z.object({
    categoryId: zod_1.z.string().uuid().optional(),
    providerId: zod_1.z.string().uuid().optional(),
    isActive: zod_1.z.enum(['true', 'false']).transform(v => v === 'true').optional(),
    search: zod_1.z.string().optional(),
    sortBy: zod_1.z.enum(['monthlyCost', 'serviceName', 'createdAt', 'lastUsed']).optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
    page: zod_1.z.coerce.number().int().positive().default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
// Taxonomy queries (IDs live in URL params where applicable)
exports.categoryQuerySchema = zod_1.z.object({
    isActive: optionalBoolQuery,
    search: zod_1.z.string().trim().optional(),
});
exports.taxonomyListQuerySchema = zod_1.z.object({
    isActive: optionalBoolQuery,
    search: zod_1.z.string().trim().optional(),
});
exports.providerQuerySchema = zod_1.z.object({
    region: zod_1.z.enum(['GLOBAL', 'INDIA', 'US', 'EU', 'ASIA', 'OTHER']).optional(),
    isActive: optionalBoolQuery,
    search: zod_1.z.string().trim().optional(),
});
exports.taxonomyPlanQuerySchema = zod_1.z.object({
    isActive: optionalBoolQuery,
    search: zod_1.z.string().trim().optional(),
});
/** @deprecated use taxonomyListQuerySchema — kept for backwards imports */
exports.subcategoryQuerySchema = exports.taxonomyListQuerySchema;
/** @deprecated use taxonomyPlanQuerySchema */
exports.planQuerySchema = exports.taxonomyPlanQuerySchema;
//# sourceMappingURL=subscription.validator.js.map