"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middlewares/authenticate");
const prisma_1 = require("../lib/prisma");
const response_1 = require("../utils/response");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
router.get('/', async (req, res, next) => {
    try {
        const page = Number(req.query.page ?? 1);
        const pageSize = 20;
        const [items, total] = await Promise.all([
            prisma_1.prisma.usageLog.findMany({
                where: { userId: req.user.id },
                include: { userSubscription: { select: { plan: { select: { name: true } } } } },
                orderBy: { sessionDate: 'desc' },
                skip: (page - 1) * pageSize, take: pageSize,
            }),
            prisma_1.prisma.usageLog.count({ where: { userId: req.user.id } }),
        ]);
        (0, response_1.sendPaginated)(res, items, total, page, pageSize);
    }
    catch (e) {
        next(e);
    }
});
router.post('/', async (req, res, next) => {
    try {
        const log = await prisma_1.prisma.usageLog.create({
            data: { ...req.body, userId: req.user.id },
        });
        // Update lastUsed on subscription
        await prisma_1.prisma.userSubscription.update({
            where: { id: req.body.userSubscriptionId },
            data: { lastUsed: new Date() },
        });
        (0, response_1.sendCreated)(res, log);
    }
    catch (e) {
        next(e);
    }
});
exports.default = router;
//# sourceMappingURL=usage.routes.js.map