"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyRefreshToken = verifyRefreshToken;
exports.generateTokenPair = generateTokenPair;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
function signAccessToken(userId) {
    const opts = { expiresIn: env_1.env.JWT_ACCESS_EXPIRY };
    return jsonwebtoken_1.default.sign({ sub: userId, type: 'access' }, env_1.env.JWT_ACCESS_SECRET, opts);
}
function signRefreshToken(userId) {
    const opts = { expiresIn: env_1.env.JWT_REFRESH_EXPIRY };
    return jsonwebtoken_1.default.sign({ sub: userId, type: 'refresh' }, env_1.env.JWT_REFRESH_SECRET, opts);
}
function verifyRefreshToken(token) {
    return jsonwebtoken_1.default.verify(token, env_1.env.JWT_REFRESH_SECRET);
}
function generateTokenPair(userId) {
    return {
        accessToken: signAccessToken(userId),
        refreshToken: signRefreshToken(userId),
    };
}
//# sourceMappingURL=tokens.js.map