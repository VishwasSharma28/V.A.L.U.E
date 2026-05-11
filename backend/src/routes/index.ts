import { Express } from 'express';
import authRoutes          from './auth.routes';
import subscriptionRoutes  from './subscription.routes';
import analyticsRoutes     from './analytics.routes';
import dashboardRoutes     from './dashboard.routes';
import ledgerRoutes        from './ledger.routes';
import recommendationRoutes from './recommendation.routes';
import notificationRoutes  from './notification.routes';
import sharedPlanRoutes    from './sharedPlan.routes';
import settingsRoutes      from './settings.routes';
import uploadRoutes        from './upload.routes';
import usageRoutes         from './usage.routes';

const API = '/api/v1';

export function registerRoutes(app: Express) {
  app.use(`${API}/auth`,          authRoutes);
  app.use(`${API}/subscriptions`, subscriptionRoutes);
  app.use(`${API}/analytics`,     analyticsRoutes);
  app.use(`${API}/dashboard`,     dashboardRoutes);
  app.use(`${API}/ledger`,        ledgerRoutes);
  app.use(`${API}/recommendations`, recommendationRoutes);
  app.use(`${API}/notifications`, notificationRoutes);
  app.use(`${API}/shared-plans`,  sharedPlanRoutes);
  app.use(`${API}/settings`,      settingsRoutes);
  app.use(`${API}/uploads`,       uploadRoutes);
  app.use(`${API}/usage`,         usageRoutes);
}
