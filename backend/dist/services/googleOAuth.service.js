"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleOAuthService = void 0;
const axios_1 = __importDefault(require("axios"));
const prisma_1 = require("../lib/prisma");
const tokens_1 = require("../utils/tokens");
const env_1 = require("../config/env");
class GoogleOAuthService {
    static async handleCallback(code) {
        // Exchange code for Google tokens
        const tokenRes = await axios_1.default.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: env_1.env.GOOGLE_CLIENT_ID,
            client_secret: env_1.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: env_1.env.GOOGLE_CALLBACK_URL,
            grant_type: 'authorization_code',
        });
        const accessToken = tokenRes.data.access_token;
        // Fetch user profile
        const userRes = await axios_1.default.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const { id, email, name, picture } = userRes.data;
        // Upsert user — create settings on first login
        const user = await prisma_1.prisma.user.upsert({
            where: { email },
            create: {
                email,
                name,
                avatar: picture,
                provider: 'GOOGLE',
                providerId: id,
                emailVerified: true,
                settings: { create: {} },
            },
            update: { name, avatar: picture, providerId: id },
        });
        const tokens = (0, tokens_1.generateTokenPair)(user.id);
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: tokens.refreshToken },
        });
        return { user, tokens };
    }
}
exports.GoogleOAuthService = GoogleOAuthService;
//# sourceMappingURL=googleOAuth.service.js.map