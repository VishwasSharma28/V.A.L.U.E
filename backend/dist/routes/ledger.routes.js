"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middlewares/authenticate");
const blockchain_service_1 = require("../blockchain/blockchain.service");
const response_1 = require("../utils/response");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
router.get('/', async (req, res, next) => {
    try {
        const page = Number(req.query.page ?? 1);
        const pageSize = Number(req.query.pageSize ?? 20);
        const { records, total } = await blockchain_service_1.BlockchainService.getLedgerForUser(req.user.id, page, pageSize);
        (0, response_1.sendPaginated)(res, records, total, page, pageSize);
    }
    catch (e) {
        next(e);
    }
});
router.get('/verify/:hash', async (req, res, next) => {
    try {
        const ok = await blockchain_service_1.BlockchainService.verifyRecord(req.params.hash);
        (0, response_1.sendSuccess)(res, { verified: ok, hash: req.params.hash });
    }
    catch (e) {
        next(e);
    }
});
exports.default = router;
//# sourceMappingURL=ledger.routes.js.map