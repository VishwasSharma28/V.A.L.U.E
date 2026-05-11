"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSocketHandlers = registerSocketHandlers;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
function registerSocketHandlers(io) {
    // ── Auth middleware ──────────────────────────────────────
    io.use((socket, next) => {
        const token = socket.handshake.auth.token ??
            socket.handshake.headers.authorization?.split(' ')[1];
        if (!token)
            return next(new Error('Authentication required'));
        try {
            const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
            socket.data.userId = payload.sub;
            next();
        }
        catch {
            next(new Error('Invalid token'));
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.data.userId;
        socket.join(`user:${userId}`);
        logger_1.logger.debug(`[Socket] connected: ${userId} (${socket.id})`);
        socket.on('subscribe:dashboard', () => socket.join(`dashboard:${userId}`));
        socket.on('disconnect', () => logger_1.logger.debug(`[Socket] disconnected: ${userId}`));
    });
}
//# sourceMappingURL=index.js.map