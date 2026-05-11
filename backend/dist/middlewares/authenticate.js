"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = require("../utils/ApiError");
const env_1 = require("../config/env");
const prisma_1 = require("../lib/prisma");
const authenticate = async (req, _res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token)
        return next(new ApiError_1.ApiError(401, 'Access token required'));
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: payload.sub },
            select: { id: true, email: true, name: true, avatar: true, provider: true },
        });
        if (!user)
            return next(new ApiError_1.ApiError(401, 'User not found'));
        req.user = user;
        next();
    }
    catch {
        return next(new ApiError_1.ApiError(401, 'Invalid or expired token'));
    }
};
exports.authenticate = authenticate;
const optionalAuth = async (req, _res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token)
        return next();
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: payload.sub },
            select: { id: true, email: true, name: true, avatar: true, provider: true },
        });
        if (user)
            req.user = user;
    }
    catch { /* ignore */ }
    next();
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=authenticate.js.map