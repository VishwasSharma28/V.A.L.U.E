import { Request, Response, NextFunction } from 'express';
import { AnalyticsService }     from '../analytics/analytics.service';
import { RecommendationService }from '../recommendations/recommendation.service';
import { BlockchainService }    from '../blockchain/blockchain.service';
import { sendSuccess }          from '../utils/response';
import { prisma }               from '../lib/prisma';
import { cacheGet, cacheSet }   from '../lib/redis';

export const getSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AnalyticsService.getSummary(req.user!.id);
    sendSuccess(res, data);
  } catch (e) { next(e); }
};

export const getSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subs = await prisma.userSubscription.findMany({
      where:   { userId: req.user!.id, isActive: true },
      include: { valueScores: { orderBy: { computedAt: 'desc' }, take: 1 } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    sendSuccess(res, subs);
  } catch (e) { next(e); }
};

export const getScore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheKey = `dashboard:score:${req.user!.id}`;
    const cached   = await cacheGet(cacheKey);
    if (cached) return sendSuccess(res, cached);

    const scores = await prisma.valueScore.findMany({
      where:   { userSubscription: { userId: req.user!.id } },
      orderBy: { computedAt: 'desc' },
      distinct: ['userSubscriptionId'],
    });
    const avg = scores.length ? scores.reduce((s, sc) => s + sc.overallScore, 0) / scores.length : 0;
    const data = { overallScore: parseFloat(avg.toFixed(1)), breakdown: scores };
    await cacheSet(cacheKey, data, 300);
    sendSuccess(res, data);
  } catch (e) { next(e); }
};

export const getSpendChart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AnalyticsService.getSpendTrend(req.user!.id);
    sendSuccess(res, data);
  } catch (e) { next(e); }
};

export const getEfficiencyChart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AnalyticsService.getEfficiencyTrend(req.user!.id);
    sendSuccess(res, data);
  } catch (e) { next(e); }
};

export const getRecommendations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await RecommendationService.getForUser(req.user!.id);
    sendSuccess(res, data);
  } catch (e) { next(e); }
};

export const getBlockchainStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { records, total } = await BlockchainService.getLedgerForUser(req.user!.id, 1, 3);
    sendSuccess(res, { latestRecords: records, totalRecords: total });
  } catch (e) { next(e); }
};
