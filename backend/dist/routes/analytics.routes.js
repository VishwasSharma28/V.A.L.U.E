"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middlewares/authenticate");
const analytics_service_1 = require("../analytics/analytics.service");
const response_1 = require("../utils/response");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
router.get('/summary', async (req, res, next) => { try {
    (0, response_1.sendSuccess)(res, await analytics_service_1.AnalyticsService.getSummary(req.user.id));
}
catch (e) {
    next(e);
} });
router.get('/trend', async (req, res, next) => { try {
    const g = req.query.granularity ?? 'monthly';
    (0, response_1.sendSuccess)(res, await analytics_service_1.AnalyticsService.getSpendTrend(req.user.id, g));
}
catch (e) {
    next(e);
} });
router.get('/categories', async (req, res, next) => { try {
    (0, response_1.sendSuccess)(res, await analytics_service_1.AnalyticsService.getCategoryBreakdown(req.user.id));
}
catch (e) {
    next(e);
} });
router.get('/efficiency', async (req, res, next) => { try {
    (0, response_1.sendSuccess)(res, await analytics_service_1.AnalyticsService.getEfficiencyTrend(req.user.id));
}
catch (e) {
    next(e);
} });
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map