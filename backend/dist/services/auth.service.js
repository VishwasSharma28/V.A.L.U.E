"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.logout = logout;
exports.refreshTokens = refreshTokens;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
exports.verifyEmail = verifyEmail;
exports.getMe = getMe;
exports.updateProfile = updateProfile;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../lib/prisma");
const ApiError_1 = require("../utils/ApiError");
const tokens_1 = require("../utils/tokens");
const redis_1 = require("../lib/redis");
const email_service_1 = require("./email.service");
const SALT_ROUNDS = 12;
async function register(input) {
    const existing = await prisma_1.prisma.user.findUnique({ where: { email: input.email } });
    if (existing)
        throw ApiError_1.ApiError.conflict('Email already in use');
    const passwordHash = await bcryptjs_1.default.hash(input.password, SALT_ROUNDS);
    const verifyToken = crypto_1.default.randomBytes(32).toString('hex');
    const user = await prisma_1.prisma.user.create({
        data: {
            name: input.name,
            email: input.email,
            passwordHash,
            verifyToken,
            settings: { create: {} }, // auto-create default settings
        },
        select: { id: true, name: true, email: true, createdAt: true },
    });
    await (0, email_service_1.sendVerificationEmail)(user.email, user.name, verifyToken);
    return user;
}
async function login(input) {
    const user = await prisma_1.prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !user.passwordHash)
        throw ApiError_1.ApiError.unauthorized('Invalid credentials');
    const valid = await bcryptjs_1.default.compare(input.password, user.passwordHash);
    if (!valid)
        throw ApiError_1.ApiError.unauthorized('Invalid credentials');
    const tokens = (0, tokens_1.generateTokenPair)(user.id);
    await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: tokens.refreshToken },
    });
    return {
        user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
        tokens,
    };
}
async function logout(userId) {
    await prisma_1.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
    });
    await (0, redis_1.cacheDel)(`user:${userId}`);
}
async function refreshTokens(token) {
    let payload;
    try {
        payload = (0, tokens_1.verifyRefreshToken)(token);
    }
    catch {
        throw ApiError_1.ApiError.unauthorized('Invalid refresh token');
    }
    const user = await prisma_1.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || user.refreshToken !== token)
        throw ApiError_1.ApiError.unauthorized('Refresh token revoked');
    const tokens = (0, tokens_1.generateTokenPair)(user.id);
    await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: tokens.refreshToken },
    });
    return tokens;
}
async function forgotPassword(email) {
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    // Always return ok (don't leak user existence)
    if (!user)
        return;
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hr
    await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: { resetToken, resetTokenExpiry: expiry },
    });
    await (0, email_service_1.sendPasswordResetEmail)(user.email, user.name, resetToken);
}
async function resetPassword(token, newPassword) {
    const user = await prisma_1.prisma.user.findFirst({
        where: {
            resetToken: token,
            resetTokenExpiry: { gt: new Date() },
        },
    });
    if (!user)
        throw ApiError_1.ApiError.badRequest('Invalid or expired reset token');
    const passwordHash = await bcryptjs_1.default.hash(newPassword, SALT_ROUNDS);
    await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: { passwordHash, resetToken: null, resetTokenExpiry: null, refreshToken: null },
    });
}
async function verifyEmail(token) {
    const user = await prisma_1.prisma.user.findFirst({ where: { verifyToken: token } });
    if (!user)
        throw ApiError_1.ApiError.badRequest('Invalid verification token');
    await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true, verifyToken: null },
    });
}
async function getMe(userId) {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, avatar: true,
            provider: true, emailVerified: true, createdAt: true,
            settings: true },
    });
    if (!user)
        throw ApiError_1.ApiError.notFound('User not found');
    return user;
}
async function updateProfile(userId, data) {
    return prisma_1.prisma.user.update({
        where: { id: userId },
        data,
        select: { id: true, name: true, email: true, avatar: true },
    });
}
//# sourceMappingURL=auth.service.js.map