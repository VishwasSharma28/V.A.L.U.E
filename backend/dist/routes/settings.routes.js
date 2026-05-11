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
        (0, response_1.sendSuccess)(res, await prisma_1.prisma.settings.findUnique({ where: { userId: req.user.id } }));
    }
    catch (e) {
        next(e);
    }
});
router.patch('/', async (req, res, next) => {
    try {
        const settings = await prisma_1.prisma.settings.upsert({
            where: { userId: req.user.id },
            create: { userId: req.user.id, ...req.body },
            update: req.body,
        });
        (0, response_1.sendSuccess)(res, settings, { message: 'Settings updated' });
    }
    catch (e) {
        next(e);
    }
});
exports.default = router;
//# sourceMappingURL=settings.routes.js.map