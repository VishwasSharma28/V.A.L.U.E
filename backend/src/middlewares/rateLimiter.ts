import rateLimit from 'express-rate-limit';
import { redis } from '../lib/redis';

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 min
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests — try again later' },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts' },
});

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,   // 1 hr
  max: 50,
  message: { success: false, message: 'AI request limit reached — try again in 1 hour' },
});
