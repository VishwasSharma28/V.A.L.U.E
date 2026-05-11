import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { prisma } from '../lib/prisma';
import { sendSuccess } from '../utils/response';

const router = Router();
router.use(authenticate);
router.get('/', async (req, res, next) => {
  try { sendSuccess(res, await prisma.settings.findUnique({ where: { userId: req.user!.id } })); } catch(e){next(e);}
});
router.patch('/', async (req, res, next) => {
  try {
    const settings = await prisma.settings.upsert({
      where:  { userId: req.user!.id },
      create: { userId: req.user!.id, ...req.body },
      update: req.body,
    });
    sendSuccess(res, settings, { message: 'Settings updated' });
  } catch(e){next(e);}
});
export default router;
