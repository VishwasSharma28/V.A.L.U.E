import Redis from 'ioredis';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export const redis = new Redis(env.REDIS_URL, {
  retryStrategy: (times) => Math.min(times * 100, 3000),
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: false,
});

redis.on('error', (err) => logger.error('Redis error:', err));
redis.on('connect', () => logger.info('Redis connecting...'));
redis.on('ready', () => logger.info('Redis ready'));

// ─── Cache helpers ─────────────────────────────────────────

export async function cacheGet<T>(key: string): Promise<T | null> {
  const value = await redis.get(key);
  return value ? JSON.parse(value) : null;
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
  await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
}

export async function cacheDel(key: string): Promise<void> {
  await redis.del(key);
}

export async function cacheDelPattern(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) await redis.del(...keys);
}
