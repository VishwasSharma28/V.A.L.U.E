import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';
import { prisma } from '../lib/prisma';
import { JwtPayload } from '../types';

declare global {
  namespace Express {
    interface Request { user?: import('../types').AuthUser; }
  }
}

export const authenticate = async (
  req: Request, _res: Response, next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) return next(new ApiError(401, 'Access token required'));

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, avatar: true, provider: true },
    });

    if (!user) return next(new ApiError(401, 'User not found'));

    req.user = user;
    next();
  } catch {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
};

export const optionalAuth = async (
  req: Request, _res: Response, next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return next();

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, avatar: true, provider: true },
    });
    if (user) req.user = user;
  } catch { /* ignore */ }
  next();
};
