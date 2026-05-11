import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { BlockchainService } from '../blockchain/blockchain.service';
import { sendSuccess, sendPaginated } from '../utils/response';

const router = Router();
router.use(authenticate);
router.get('/', async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const pageSize = Number(req.query.pageSize ?? 20);
    const { records, total } = await BlockchainService.getLedgerForUser(req.user!.id, page, pageSize);
    sendPaginated(res, records, total, page, pageSize);
  } catch(e){next(e);}
});
router.get('/verify/:hash', async (req, res, next) => {
  try {
    const ok = await BlockchainService.verifyRecord(req.params.hash);
    sendSuccess(res, { verified: ok, hash: req.params.hash });
  } catch(e){next(e);}
});
export default router;
