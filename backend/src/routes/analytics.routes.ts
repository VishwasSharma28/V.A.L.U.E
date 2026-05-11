import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { AnalyticsService } from '../analytics/analytics.service';
import { sendSuccess } from '../utils/response';

const router = Router();
router.use(authenticate);
router.get('/summary',    async (req, res, next) => { try { sendSuccess(res, await AnalyticsService.getSummary(req.user!.id)); } catch(e){next(e);} });
router.get('/trend',      async (req, res, next) => { try { const g = (req.query.granularity as any) ?? 'monthly'; sendSuccess(res, await AnalyticsService.getSpendTrend(req.user!.id, g)); } catch(e){next(e);} });
router.get('/categories', async (req, res, next) => { try { sendSuccess(res, await AnalyticsService.getCategoryBreakdown(req.user!.id)); } catch(e){next(e);} });
router.get('/efficiency', async (req, res, next) => { try { sendSuccess(res, await AnalyticsService.getEfficiencyTrend(req.user!.id)); } catch(e){next(e);} });
export default router;
