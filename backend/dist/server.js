"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const socket_io_1 = require("socket.io");
const env_1 = require("./config/env");
const prisma_1 = require("./lib/prisma");
const redis_1 = require("./lib/redis");
const logger_1 = require("./utils/logger");
const errorHandler_1 = require("./middlewares/errorHandler");
const rateLimiter_1 = require("./middlewares/rateLimiter");
const socket_1 = require("./socket");
const io_1 = require("./socket/io");
const cron_1 = require("./jobs/cron");
const routes_1 = require("./routes");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// ─── Socket.IO ────────────────────────────────────────────
const io = new socket_io_1.Server(server, {
    cors: { origin: env_1.env.FRONTEND_URL, credentials: true },
});
(0, io_1.setIO)(io);
(0, socket_1.registerSocketHandlers)(io);
// ─── Core Middleware ───────────────────────────────────────
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: env_1.env.FRONTEND_URL, credentials: true }));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('combined', { stream: { write: (msg) => logger_1.logger.info(msg.trim()) } }));
app.use(rateLimiter_1.globalRateLimiter);
// ─── Health ────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString(), version: '1.0.0' }));
// ─── API Routes ────────────────────────────────────────────
(0, routes_1.registerRoutes)(app);
// ─── Error Handling ────────────────────────────────────────
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.globalErrorHandler);
// ─── Bootstrap ─────────────────────────────────────────────
async function bootstrap() {
    try {
        await prisma_1.prisma.$connect();
        logger_1.logger.info('✅ PostgreSQL connected via Prisma');
        try {
            await redis_1.redis.ping();
            logger_1.logger.info('✅ Redis connected');
        }
        catch (redisErr) {
            logger_1.logger.warn('⚠️ Redis unavailable; continuing without cache', redisErr);
        }
        (0, cron_1.startCronJobs)();
        logger_1.logger.info('✅ Cron jobs started');
        server.listen(env_1.env.PORT, () => {
            logger_1.logger.info(`🚀 V.A.L.U.E Backend running on port ${env_1.env.PORT}`);
        });
    }
    catch (err) {
        logger_1.logger.error('Bootstrap failed:', err);
        process.exit(1);
    }
}
bootstrap();
process.on('SIGINT', async () => {
    await prisma_1.prisma.$disconnect();
    await redis_1.redis.quit();
    process.exit(0);
});
//# sourceMappingURL=server.js.map