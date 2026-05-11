import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { Server as SocketIOServer } from 'socket.io';

import { env } from './config/env';
import { prisma } from './lib/prisma';
import { redis } from './lib/redis';
import { logger } from './utils/logger';
import { globalErrorHandler, notFoundHandler } from './middlewares/errorHandler';
import { globalRateLimiter } from './middlewares/rateLimiter';
import { registerSocketHandlers } from './socket';
import { setIO } from './socket/io';
import { startCronJobs } from './jobs/cron';
import { registerRoutes } from './routes';

const app = express();
const server = http.createServer(app);

// ─── Socket.IO ────────────────────────────────────────────
const io = new SocketIOServer(server, {
  cors: { origin: env.FRONTEND_URL, credentials: true },
});
setIO(io);
registerSocketHandlers(io);

// ─── Core Middleware ───────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(globalRateLimiter);

// ─── Health ────────────────────────────────────────────────
app.get('/health', (_req, res) =>
  res.json({ status: 'ok', ts: new Date().toISOString(), version: '1.0.0' })
);

// ─── API Routes ────────────────────────────────────────────
registerRoutes(app);

// ─── Error Handling ────────────────────────────────────────
app.use(notFoundHandler);
app.use(globalErrorHandler);

// ─── Bootstrap ─────────────────────────────────────────────
async function bootstrap() {
  try {
    await prisma.$connect();
    logger.info('✅ PostgreSQL connected via Prisma');

    try {
      await redis.ping();
      logger.info('✅ Redis connected');
    } catch (redisErr) {
      logger.warn('⚠️ Redis unavailable; continuing without cache', redisErr);
    }

    startCronJobs();
    logger.info('✅ Cron jobs started');

    server.listen(env.PORT, () => {
      logger.info(`🚀 V.A.L.U.E Backend running on port ${env.PORT}`);
    });
  } catch (err) {
    logger.error('Bootstrap failed:', err);
    process.exit(1);
  }
}

bootstrap();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  await redis.quit();
  process.exit(0);
});
