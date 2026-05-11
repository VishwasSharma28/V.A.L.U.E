"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCronJobs = startCronJobs;
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = require("../lib/prisma");
const valueScoring_service_1 = require("../services/valueScoring.service");
const recommendation_service_1 = require("../recommendations/recommendation.service");
const analytics_service_1 = require("../analytics/analytics.service");
const logger_1 = require("../utils/logger");
const notification_service_1 = require("../notifications/notification.service");
function startCronJobs() {
    // ── Every 6 hours: recalculate value scores ──────────────
    node_cron_1.default.schedule('0 */6 * * *', async () => {
        logger_1.logger.info('[CRON] Recalculating value scores...');
        const users = await prisma_1.prisma.user.findMany({ select: { id: true } });
        for (const user of users) {
            try {
                await valueScoring_service_1.ValueScoringService.recalculateForUser(user.id);
            }
            catch (e) {
                logger_1.logger.error(`Score calc failed for ${user.id}:`, e);
            }
        }
        logger_1.logger.info(`[CRON] Scores updated for ${users.length} users`);
    });
    // ── Daily at 2am: generate AI recommendations ─────────────
    node_cron_1.default.schedule('0 2 * * *', async () => {
        logger_1.logger.info('[CRON] Generating AI recommendations...');
        const users = await prisma_1.prisma.user.findMany({ select: { id: true } });
        for (const user of users) {
            try {
                await recommendation_service_1.RecommendationService.generateForUser(user.id);
            }
            catch (e) {
                logger_1.logger.error(`Recs failed for ${user.id}:`, e);
            }
        }
        logger_1.logger.info('[CRON] Recommendations done');
    });
    // ── Every hour: detect inactive subscriptions ─────────────
    node_cron_1.default.schedule('0 * * * *', async () => {
        const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days
        const idle = await prisma_1.prisma.userSubscription.findMany({
            where: { isActive: true, lastUsed: { lt: cutoff } },
            select: { id: true, userId: true, plan: { select: { name: true } } },
        });
        for (const sub of idle) {
            await notification_service_1.NotificationService.create({
                userId: sub.userId,
                type: 'WASTE_ALERT',
                title: `${sub.plan.name} is idle`,
                body: `You haven't used ${sub.plan.name} in 30+ days. Consider cancelling.`,
                metadata: { subscriptionId: sub.id },
            });
        }
    });
    // ── Daily at midnight: analytics snapshots ────────────────
    node_cron_1.default.schedule('0 0 * * *', async () => {
        logger_1.logger.info('[CRON] Storing analytics snapshots...');
        const users = await prisma_1.prisma.user.findMany({ select: { id: true } });
        const period = new Date().toISOString().slice(0, 7); // "2024-05"
        for (const user of users) {
            try {
                await analytics_service_1.AnalyticsService.storeSnapshot(user.id, period, 'monthly');
            }
            catch { /* ignore */ }
        }
    });
    // ── 3 days before renewal: billing reminders ─────────────
    node_cron_1.default.schedule('0 9 * * *', async () => {
        const soon = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        const due = await prisma_1.prisma.userSubscription.findMany({
            where: {
                isActive: true,
                nextBillingDate: { gte: new Date(), lte: soon },
                user: { settings: { billingReminders: true } },
            },
            select: { id: true, userId: true, plan: { select: { name: true, monthlyCost: true } } },
        });
        for (const sub of due) {
            await notification_service_1.NotificationService.create({
                userId: sub.userId,
                type: 'BILLING_REMINDER',
                title: `${sub.plan.name} renews in 3 days`,
                body: `Your ${sub.plan.name} subscription will renew soon.`,
                metadata: { subscriptionId: sub.id, amount: sub.plan.monthlyCost },
            });
        }
    });
    logger_1.logger.info('✅ All cron jobs scheduled');
}
//# sourceMappingURL=cron.js.map