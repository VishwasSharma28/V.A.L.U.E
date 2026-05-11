"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
exports.cacheGet = cacheGet;
exports.cacheSet = cacheSet;
exports.cacheDel = cacheDel;
exports.cacheDelPattern = cacheDelPattern;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
exports.redis = new ioredis_1.default(env_1.env.REDIS_URL, {
    retryStrategy: (times) => Math.min(times * 100, 3000),
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: false,
});
exports.redis.on('error', (err) => logger_1.logger.error('Redis error:', err));
exports.redis.on('connect', () => logger_1.logger.info('Redis connecting...'));
exports.redis.on('ready', () => logger_1.logger.info('Redis ready'));
// ─── Cache helpers ─────────────────────────────────────────
async function cacheGet(key) {
    const value = await exports.redis.get(key);
    return value ? JSON.parse(value) : null;
}
async function cacheSet(key, value, ttlSeconds = 300) {
    await exports.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
}
async function cacheDel(key) {
    await exports.redis.del(key);
}
async function cacheDelPattern(pattern) {
    const keys = await exports.redis.keys(pattern);
    if (keys.length > 0)
        await exports.redis.del(...keys);
}
//# sourceMappingURL=redis.js.map