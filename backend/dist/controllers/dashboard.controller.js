"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlockchainStatus = exports.getRecommendations = exports.getEfficiencyChart = exports.getSpendChart = exports.getScore = exports.getSubscriptions = exports.getSummary = void 0;
const analytics_service_1 = require("../analytics/analytics.service");
const recommendation_service_1 = require("../recommendations/recommendation.service");
const blockchain_service_1 = require("../blockchain/blockchain.service");
const response_1 = require("../utils/response");
const prisma_1 = require("../lib/prisma");
const redis_1 = require("../lib/redis");
const getSummary = async (req, res, next) => {
    try {
        const data = await analytics_service_1.AnalyticsService.getSummary(req.user.id);
        (0, response_1.sendSuccess)(res, data);
    }
    catch (e) {
        next(e);
    }
};
exports.getSummary = getSummary;
const getSubscriptions = async (req, res, next) => {
    try {
        const subs = await prisma_1.prisma.userSubscription.findMany({
            where: { userId: req.user.id, isActive: true },
            include: { valueScores: { orderBy: { computedAt: 'desc' }, take: 1 } },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });
        (0, response_1.sendSuccess)(res, subs);
    }
    catch (e) {
        next(e);
    }
};
exports.getSubscriptions = getSubscriptions;
const getScore = async (req, res, next) => {
    try {
        const cacheKey = `dashboard:score:${req.user.id}`;
        const cached = await (0, redis_1.cacheGet)(cacheKey);
        if (cached)
            return (0, response_1.sendSuccess)(res, cached);
        const scores = await prisma_1.prisma.valueScore.findMany({
            where: { userSubscription: { userId: req.user.id } },
            orderBy: { computedAt: 'desc' },
            distinct: ['userSubscriptionId'],
        });
        const avg = scores.length ? scores.reduce((s, sc) => s + sc.overallScore, 0) / scores.length : 0;
        const data = { overallScore: parseFloat(avg.toFixed(1)), breakdown: scores };
        await (0, redis_1.cacheSet)(cacheKey, data, 300);
        (0, response_1.sendSuccess)(res, data);
    }
    catch (e) {
        next(e);
    }
};
exports.getScore = getScore;
const getSpendChart = async (req, res, next) => {
    try {
        const data = await analytics_service_1.AnalyticsService.getSpendTrend(req.user.id);
        (0, response_1.sendSuccess)(res, data);
    }
    catch (e) {
        next(e);
    }
};
exports.getSpendChart = getSpendChart;
const getEfficiencyChart = async (req, res, next) => {
    try {
        const data = await analytics_service_1.AnalyticsService.getEfficiencyTrend(req.user.id);
        (0, response_1.sendSuccess)(res, data);
    }
    catch (e) {
        next(e);
    }
};
exports.getEfficiencyChart = getEfficiencyChart;
const getRecommendations = async (req, res, next) => {
    try {
        const data = await recommendation_service_1.RecommendationService.getForUser(req.user.id);
        (0, response_1.sendSuccess)(res, data);
    }
    catch (e) {
        next(e);
    }
};
exports.getRecommendations = getRecommendations;
const getBlockchainStatus = async (req, res, next) => {
    try {
        const { records, total } = await blockchain_service_1.BlockchainService.getLedgerForUser(req.user.id, 1, 3);
        (0, response_1.sendSuccess)(res, { latestRecords: records, totalRecords: total });
    }
    catch (e) {
        next(e);
    }
};
exports.getBlockchainStatus = getBlockchainStatus;
//# sourceMappingURL=dashboard.controller.js.map