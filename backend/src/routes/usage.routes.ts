import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/response';

const router = Router();
router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const pageSize = 20;
    const [items, total] = await Promise.all([
      prisma.usageLog.findMany({
        where: { userId: req.user!.id },
        include: { userSubscription: { select: { plan: { select: { name: true } } } } },
        orderBy: { sessionDate: 'desc' },
        skip: (page - 1) * pageSize, take: pageSize,
      }),
      prisma.usageLog.count({ where: { userId: req.user!.id } }),
    ]);
    sendPaginated(res, items, total, page, pageSize);
  } catch(e){next(e);}
});

router.post('/', async (req, res, next) => {
  try {
    const log = await prisma.usageLog.create({
      data: { ...req.body, userId: req.user!.id },
    });
    // Update lastUsed on subscription
    await prisma.userSubscription.update({
      where: { id: req.body.userSubscriptionId },
      data:  { lastUsed: new Date() },
    });
    sendCreated(res, log);
  } catch(e){next(e);}
});

export default router;
