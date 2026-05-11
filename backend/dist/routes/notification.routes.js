"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middlewares/authenticate");
const notification_service_1 = require("../notifications/notification.service");
const response_1 = require("../utils/response");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
router.get('/', async (req, res, next) => {
    try {
        const page = Number(req.query.page ?? 1);
        const { items, total } = await notification_service_1.NotificationService.getForUser(req.user.id, page);
        (0, response_1.sendPaginated)(res, items, total, page, 20);
    }
    catch (e) {
        next(e);
    }
});
router.get('/unread-count', async (req, res, next) => {
    try {
        (0, response_1.sendSuccess)(res, { count: await notification_service_1.NotificationService.getUnreadCount(req.user.id) });
    }
    catch (e) {
        next(e);
    }
});
router.patch('/:id/read', async (req, res, next) => { try {
    (0, response_1.sendSuccess)(res, await notification_service_1.NotificationService.markRead(req.params.id, req.user.id));
}
catch (e) {
    next(e);
} });
router.post('/mark-all-read', async (req, res, next) => { try {
    await notification_service_1.NotificationService.markAllRead(req.user.id);
    (0, response_1.sendSuccess)(res, null, { message: 'All marked read' });
}
catch (e) {
    next(e);
} });
exports.default = router;
//# sourceMappingURL=notification.routes.js.map