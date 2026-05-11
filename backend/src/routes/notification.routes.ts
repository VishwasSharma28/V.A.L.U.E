import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { NotificationService } from '../notifications/notification.service';
import { sendSuccess, sendPaginated } from '../utils/response';

const router = Router();
router.use(authenticate);
router.get('/', async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const { items, total } = await NotificationService.getForUser(req.user!.id, page);
    sendPaginated(res, items, total, page, 20);
  } catch(e){next(e);}
});
router.get('/unread-count', async (req, res, next) => {
  try { sendSuccess(res, { count: await NotificationService.getUnreadCount(req.user!.id) }); } catch(e){next(e);}
});
router.patch('/:id/read',  async (req, res, next) => { try { sendSuccess(res, await NotificationService.markRead(req.params.id, req.user!.id)); } catch(e){next(e);} });
router.post('/mark-all-read', async (req, res, next) => { try { await NotificationService.markAllRead(req.user!.id); sendSuccess(res, null, { message: 'All marked read' }); } catch(e){next(e);} });
export default router;
