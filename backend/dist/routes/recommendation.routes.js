"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middlewares/authenticate");
const recommendation_service_1 = require("../recommendations/recommendation.service");
const response_1 = require("../utils/response");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
router.get('/', async (req, res, next) => { try {
    (0, response_1.sendSuccess)(res, await recommendation_service_1.RecommendationService.getForUser(req.user.id));
}
catch (e) {
    next(e);
} });
router.post('/generate', async (req, res, next) => { try {
    (0, response_1.sendSuccess)(res, await recommendation_service_1.RecommendationService.generateForUser(req.user.id));
}
catch (e) {
    next(e);
} });
router.patch('/:id/read', async (req, res, next) => { try {
    (0, response_1.sendSuccess)(res, await recommendation_service_1.RecommendationService.markRead(req.params.id, req.user.id));
}
catch (e) {
    next(e);
} });
router.patch('/:id/dismiss', async (req, res, next) => { try {
    (0, response_1.sendSuccess)(res, await recommendation_service_1.RecommendationService.dismiss(req.params.id, req.user.id));
}
catch (e) {
    next(e);
} });
exports.default = router;
//# sourceMappingURL=recommendation.routes.js.map