import { Router } from 'express';
import * as SC         from '../controllers/subscription.controller';
import { authenticate } from '../middlewares/authenticate';
import { validate }    from '../middlewares/validate';
import {
  createSubSchema,
  updateSubSchema,
  subQuerySchema,
  categoryQuerySchema,
  taxonomyListQuerySchema,
  providerQuerySchema,
  taxonomyPlanQuerySchema,
} from '../validators/subscription.validator';

const router = Router();
router.use(authenticate);

// Taxonomy first — must not be caught by /:id
router.get('/taxonomy/categories', validate(categoryQuerySchema, 'query'), SC.listCategories);
router.get(
  '/taxonomy/categories/:categoryId/subcategories',
  validate(taxonomyListQuerySchema, 'query'),
  SC.listSubcategories
);
router.get(
  '/taxonomy/subcategories/:subcategoryId/providers',
  validate(providerQuerySchema, 'query'),
  SC.listProviders
);
router.get(
  '/taxonomy/providers/:providerId/plan-types',
  validate(taxonomyPlanQuerySchema, 'query'),
  SC.listPlanTypes
);
router.get(
  '/taxonomy/plan-types/:planTypeId/plans',
  validate(taxonomyPlanQuerySchema, 'query'),
  SC.listPlans
);

// User subscriptions
router.get   ('/',     validate(subQuerySchema, 'query'), SC.list);
router.post  ('/',     validate(createSubSchema),         SC.create);
router.get   ('/:id',                                     SC.getById);
router.patch ('/:id',  validate(updateSubSchema),         SC.update);
router.delete('/:id',                                     SC.remove);
router.get   ('/:id/score',                               SC.getScore);
router.post  ('/:id/recalculate',                         SC.recalculateScore);

export default router;
