import { Request, Response, NextFunction } from 'express';
import * as SubService from '../services/subscription.service';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/response';
import { SubQuery } from '../validators/subscription.validator';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await SubService.listSubscriptions(req.user!.id, req.query as unknown as SubQuery);
    sendPaginated(res, result.items, result.total, result.page, result.pageSize);
  } catch (e) { next(e); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    sendCreated(res, await SubService.createSubscription(req.user!.id, req.body));
  } catch (e) { next(e); }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    sendSuccess(res, await SubService.getSubscription(req.params.id, req.user!.id));
  } catch (e) { next(e); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    sendSuccess(res, await SubService.updateSubscription(req.params.id, req.user!.id, req.body), { message: 'Updated' });
  } catch (e) { next(e); }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await SubService.deleteSubscription(req.params.id, req.user!.id);
    sendSuccess(res, null, { message: 'Subscription deleted' });
  } catch (e) { next(e); }
};

export const getScore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    sendSuccess(res, await SubService.getSubscriptionScore(req.params.id, req.user!.id));
  } catch (e) { next(e); }
};

export const recalculateScore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ValueScoringService } = await import('../services/valueScoring.service');
    const score = await ValueScoringService.calculateAndStore(req.params.id);
    sendSuccess(res, score, { message: 'Score recalculated' });
  } catch (e) { next(e); }
};

// Taxonomy endpoints
export const listCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    sendSuccess(res, await SubService.listCategories(req.query));
  } catch (e) { next(e); }
};

export const listSubcategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    sendSuccess(res, await SubService.listSubcategories(req.params.categoryId, req.query));
  } catch (e) { next(e); }
};

export const listProviders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    sendSuccess(res, await SubService.listProviders(req.params.subcategoryId, req.query));
  } catch (e) { next(e); }
};

export const listPlanTypes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    sendSuccess(res, await SubService.listPlanTypes(req.params.providerId, req.query));
  } catch (e) { next(e); }
};

export const listPlans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    sendSuccess(res, await SubService.listPlans(req.params.planTypeId, req.query));
  } catch (e) { next(e); }
};
