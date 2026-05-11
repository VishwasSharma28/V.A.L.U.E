"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middlewares/authenticate");
const prisma_1 = require("../lib/prisma");
const response_1 = require("../utils/response");
const ApiError_1 = require("../utils/ApiError");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
router.get('/', async (req, res, next) => {
    try {
        const plans = await prisma_1.prisma.sharedPlan.findMany({
            where: { OR: [{ ownerId: req.user.id }, { members: { some: { userId: req.user.id } } }] },
            include: { members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } } },
        });
        (0, response_1.sendSuccess)(res, plans);
    }
    catch (e) {
        next(e);
    }
});
router.post('/', async (req, res, next) => {
    try {
        const plan = await prisma_1.prisma.sharedPlan.create({
            data: { ...req.body, ownerId: req.user.id,
                members: { create: { userId: req.user.id, role: 'OWNER', monthlyShare: req.body.totalCost } }
            },
            include: { members: true },
        });
        (0, response_1.sendCreated)(res, plan);
    }
    catch (e) {
        next(e);
    }
});
router.post('/join', async (req, res, next) => {
    try {
        const plan = await prisma_1.prisma.sharedPlan.findUnique({ where: { inviteCode: req.body.inviteCode } });
        if (!plan)
            throw ApiError_1.ApiError.notFound('Invalid invite code');
        const member = await prisma_1.prisma.sharedMember.create({
            data: { planId: plan.id, userId: req.user.id, role: 'MEMBER', monthlyShare: plan.totalCost / (plan.maxMembers) },
        });
        (0, response_1.sendCreated)(res, member);
    }
    catch (e) {
        next(e);
    }
});
exports.default = router;
//# sourceMappingURL=sharedPlan.routes.js.map