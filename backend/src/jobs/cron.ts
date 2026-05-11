import cron from 'node-cron';
import { prisma }                    from '../lib/prisma';
import { ValueScoringService }       from '../services/valueScoring.service';
import { RecommendationService }     from '../recommendations/recommendation.service';
import { AnalyticsService }          from '../analytics/analytics.service';
import { logger }                    from '../utils/logger';
import { NotificationService }       from '../notifications/notification.service';

export function startCronJobs() {

  // ── Every 6 hours: recalculate value scores ──────────────
  cron.schedule('0 */6 * * *', async () => {
    logger.info('[CRON] Recalculating value scores...');
    const users = await prisma.user.findMany({ select: { id: true } });
    for (const user of users) {
      try { await ValueScoringService.recalculateForUser(user.id); }
      catch (e) { logger.error(`Score calc failed for ${user.id}:`, e); }
    }
    logger.info(`[CRON] Scores updated for ${users.length} users`);
  });

  // ── Daily at 2am: generate AI recommendations ─────────────
  cron.schedule('0 2 * * *', async () => {
    logger.info('[CRON] Generating AI recommendations...');
    const users = await prisma.user.findMany({ select: { id: true } });
    for (const user of users) {
      try { await RecommendationService.generateForUser(user.id); }
      catch (e) { logger.error(`Recs failed for ${user.id}:`, e); }
    }
    logger.info('[CRON] Recommendations done');
  });

  // ── Every hour: detect inactive subscriptions ─────────────
  cron.schedule('0 * * * *', async () => {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days
    const idle = await prisma.userSubscription.findMany({
      where: { isActive: true, lastUsed: { lt: cutoff } },
      select: { id: true, userId: true, plan: { select: { name: true } } },
    });
    for (const sub of idle) {
      await NotificationService.create({
        userId: sub.userId,
        type: 'WASTE_ALERT',
        title: `${sub.plan.name} is idle`,
        body:  `You haven't used ${sub.plan.name} in 30+ days. Consider cancelling.`,
        metadata: { subscriptionId: sub.id },
      });
    }
  });

  // ── Daily at midnight: analytics snapshots ────────────────
  cron.schedule('0 0 * * *', async () => {
    logger.info('[CRON] Storing analytics snapshots...');
    const users = await prisma.user.findMany({ select: { id: true } });
    const period = new Date().toISOString().slice(0, 7); // "2024-05"
    for (const user of users) {
      try { await AnalyticsService.storeSnapshot(user.id, period, 'monthly'); }
      catch { /* ignore */ }
    }
  });

  // ── 3 days before renewal: billing reminders ─────────────
  cron.schedule('0 9 * * *', async () => {
    const soon = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const due = await prisma.userSubscription.findMany({
      where: {
        isActive: true,
        nextBillingDate: { gte: new Date(), lte: soon },
        user: { settings: { billingReminders: true } },
      },
      select: { id: true, userId: true, plan: { select: { name: true, monthlyCost: true } } },
    });
    for (const sub of due) {
      await NotificationService.create({
        userId: sub.userId,
        type: 'BILLING_REMINDER',
        title: `${sub.plan.name} renews in 3 days`,
        body:  `Your ${sub.plan.name} subscription will renew soon.`,
        metadata: { subscriptionId: sub.id, amount: sub.plan.monthlyCost },
      });
    }
  });

  logger.info('✅ All cron jobs scheduled');
}
