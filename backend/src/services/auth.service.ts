import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/ApiError';
import { generateTokenPair, verifyRefreshToken } from '../utils/tokens';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { cacheSet, cacheDel } from '../lib/redis';
import { sendVerificationEmail, sendPasswordResetEmail } from './email.service';
import { env } from '../config/env';

const SALT_ROUNDS = 12;

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw ApiError.conflict('Email already in use');

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const verifyToken  = crypto.randomBytes(32).toString('hex');

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      verifyToken,
      settings: { create: {} },  // auto-create default settings
    },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  await sendVerificationEmail(user.email, user.name, verifyToken);
  return user;
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !user.passwordHash)
    throw ApiError.unauthorized('Invalid credentials');

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) throw ApiError.unauthorized('Invalid credentials');

  const tokens = generateTokenPair(user.id);
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: tokens.refreshToken },
  });

  return {
    user:  { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
    tokens,
  };
}

export async function logout(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data:  { refreshToken: null },
  });
  await cacheDel(`user:${userId}`);
}

export async function refreshTokens(token: string) {
  let payload;
  try { payload = verifyRefreshToken(token); }
  catch { throw ApiError.unauthorized('Invalid refresh token'); }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || user.refreshToken !== token)
    throw ApiError.unauthorized('Refresh token revoked');

  const tokens = generateTokenPair(user.id);
  await prisma.user.update({
    where: { id: user.id },
    data:  { refreshToken: tokens.refreshToken },
  });
  return tokens;
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  // Always return ok (don't leak user existence)
  if (!user) return;

  const resetToken  = crypto.randomBytes(32).toString('hex');
  const expiry      = new Date(Date.now() + 60 * 60 * 1000); // 1 hr

  await prisma.user.update({
    where: { id: user.id },
    data:  { resetToken, resetTokenExpiry: expiry },
  });
  await sendPasswordResetEmail(user.email, user.name, resetToken);
}

export async function resetPassword(token: string, newPassword: string) {
  const user = await prisma.user.findFirst({
    where: {
      resetToken:       token,
      resetTokenExpiry: { gt: new Date() },
    },
  });
  if (!user) throw ApiError.badRequest('Invalid or expired reset token');

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.user.update({
    where: { id: user.id },
    data:  { passwordHash, resetToken: null, resetTokenExpiry: null, refreshToken: null },
  });
}

export async function verifyEmail(token: string) {
  const user = await prisma.user.findFirst({ where: { verifyToken: token } });
  if (!user) throw ApiError.badRequest('Invalid verification token');

  await prisma.user.update({
    where: { id: user.id },
    data:  { emailVerified: true, verifyToken: null },
  });
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: { id: true, name: true, email: true, avatar: true,
              provider: true, emailVerified: true, createdAt: true,
              settings: true },
  });
  if (!user) throw ApiError.notFound('User not found');
  return user;
}

export async function updateProfile(userId: string, data: { name?: string; avatar?: string }) {
  return prisma.user.update({
    where:  { id: userId },
    data,
    select: { id: true, name: true, email: true, avatar: true },
  });
}
