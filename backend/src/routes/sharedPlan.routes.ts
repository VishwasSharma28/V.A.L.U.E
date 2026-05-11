import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/response';
import { ApiError } from '../utils/ApiError';

const router = Router();
router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const plans = await prisma.sharedPlan.findMany({
      where: { OR: [{ ownerId: req.user!.id }, { members: { some: { userId: req.user!.id } } }] },
      include: { members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } } },
    });
    sendSuccess(res, plans);
  } catch(e){next(e);}
});

router.post('/', async (req, res, next) => {
  try {
    const plan = await prisma.sharedPlan.create({
      data: { ...req.body, ownerId: req.user!.id,
        members: { create: { userId: req.user!.id, role: 'OWNER', monthlyShare: req.body.totalCost } }
      },
      include: { members: true },
    });
    sendCreated(res, plan);
  } catch(e){next(e);}
});

router.post('/join', async (req, res, next) => {
  try {
    const plan = await prisma.sharedPlan.findUnique({ where: { inviteCode: req.body.inviteCode } });
    if (!plan) throw ApiError.notFound('Invalid invite code');
    const member = await prisma.sharedMember.create({
      data: { planId: plan.id, userId: req.user!.id, role: 'MEMBER', monthlyShare: plan.totalCost / (plan.maxMembers) },
    });
    sendCreated(res, member);
  } catch(e){next(e);}
});

export default router;
