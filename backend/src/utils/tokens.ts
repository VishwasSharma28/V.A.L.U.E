import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { JwtPayload } from '../types';

export function signAccessToken(userId: string): string {
  const opts: SignOptions = { expiresIn: env.JWT_ACCESS_EXPIRY as SignOptions['expiresIn'] };
  return jwt.sign(
    { sub: userId, type: 'access' } as object,
    env.JWT_ACCESS_SECRET,
    opts
  );
}

export function signRefreshToken(userId: string): string {
  const opts: SignOptions = { expiresIn: env.JWT_REFRESH_EXPIRY as SignOptions['expiresIn'] };
  return jwt.sign(
    { sub: userId, type: 'refresh' } as object,
    env.JWT_REFRESH_SECRET,
    opts
  );
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
}

export function generateTokenPair(userId: string) {
  return {
    accessToken:  signAccessToken(userId),
    refreshToken: signRefreshToken(userId),
  };
}
