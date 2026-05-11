import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { RecommendationService } from '../recommendations/recommendation.service';
import { sendSuccess } from '../utils/response';

const router = Router();
router.use(authenticate);
router.get('/',           async (req, res, next) => { try { sendSuccess(res, await RecommendationService.getForUser(req.user!.id)); } catch(e){next(e);} });
router.post('/generate',  async (req, res, next) => { try { sendSuccess(res, await RecommendationService.generateForUser(req.user!.id)); } catch(e){next(e);} });
router.patch('/:id/read', async (req, res, next) => { try { sendSuccess(res, await RecommendationService.markRead(req.params.id, req.user!.id)); } catch(e){next(e);} });
router.patch('/:id/dismiss', async (req, res, next) => { try { sendSuccess(res, await RecommendationService.dismiss(req.params.id, req.user!.id)); } catch(e){next(e);} });
export default router;
