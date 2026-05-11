import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import * as DC from '../controllers/dashboard.controller';

const router = Router();
router.use(authenticate);
router.get('/summary',       DC.getSummary);
router.get('/subscriptions', DC.getSubscriptions);
router.get('/score',         DC.getScore);
router.get('/chart/spend',   DC.getSpendChart);
router.get('/chart/efficiency', DC.getEfficiencyChart);
router.get('/recommendations',  DC.getRecommendations);
router.get('/blockchain',    DC.getBlockchainStatus);
export default router;
