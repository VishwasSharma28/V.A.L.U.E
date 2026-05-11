import { z } from 'zod';

const billing    = ['MONTHLY','QUARTERLY','SEMI_ANNUAL','ANNUAL','LIFETIME','ONE_TIME'] as const;
const frequency  = ['DAILY','WEEKLY','MONTHLY','RARELY','NEVER'] as const;

const optionalBoolQuery = z
  .enum(['true', 'false'])
  .optional()
  .transform((v) => (v === undefined ? undefined : v === 'true'));

export const createSubSchema = z.object({
  planId:          z.string().uuid(),
  usageFrequency:  z.enum(frequency).default('MONTHLY'),
  lastUsed:        z.coerce.date().optional(),
  autoRenew:       z.boolean().default(true),
  notes:           z.string().max(500).optional(),
  nextBillingDate: z.coerce.date().optional(),
});

export const updateSubSchema = createSubSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const subQuerySchema = z.object({
  categoryId: z.string().uuid().optional(),
  providerId: z.string().uuid().optional(),
  isActive:   z.enum(['true','false']).transform(v => v === 'true').optional(),
  search:     z.string().optional(),
  sortBy:     z.enum(['monthlyCost','serviceName','createdAt','lastUsed']).optional(),
  sortOrder:  z.enum(['asc','desc']).default('desc'),
  page:       z.coerce.number().int().positive().default(1),
  pageSize:   z.coerce.number().int().min(1).max(100).default(20),
});

// Taxonomy queries (IDs live in URL params where applicable)
export const categoryQuerySchema = z.object({
  isActive: optionalBoolQuery,
  search:   z.string().trim().optional(),
});

export const taxonomyListQuerySchema = z.object({
  isActive: optionalBoolQuery,
  search:   z.string().trim().optional(),
});

export const providerQuerySchema = z.object({
  region:   z.enum(['GLOBAL','INDIA','US','EU','ASIA','OTHER']).optional(),
  isActive: optionalBoolQuery,
  search:   z.string().trim().optional(),
});

export const taxonomyPlanQuerySchema = z.object({
  isActive: optionalBoolQuery,
  search:   z.string().trim().optional(),
});

/** @deprecated use taxonomyListQuerySchema — kept for backwards imports */
export const subcategoryQuerySchema = taxonomyListQuerySchema;
/** @deprecated use taxonomyPlanQuerySchema */
export const planQuerySchema = taxonomyPlanQuerySchema;

export type CreateSubInput = z.infer<typeof createSubSchema>;
export type UpdateSubInput = z.infer<typeof updateSubSchema>;
export type SubQuery       = z.infer<typeof subQuerySchema>;
export type CategoryQuery  = z.infer<typeof categoryQuerySchema>;
export type SubcategoryQuery = z.infer<typeof taxonomyListQuerySchema>;
export type ProviderQuery  = z.infer<typeof providerQuerySchema>;
export type PlanQuery      = z.infer<typeof taxonomyPlanQuerySchema>;
