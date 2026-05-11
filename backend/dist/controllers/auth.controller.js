"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleOAuthCallback = exports.googleOAuthRedirect = exports.updateProfile = exports.me = exports.verifyEmail = exports.resetPassword = exports.forgotPassword = exports.refresh = exports.logout = exports.login = exports.register = void 0;
const AuthService = __importStar(require("../services/auth.service"));
const response_1 = require("../utils/response");
const env_1 = require("../config/env");
const register = async (req, res, next) => {
    try {
        const user = await AuthService.register(req.body);
        (0, response_1.sendCreated)(res, user, 'Registration successful — check your email to verify');
    }
    catch (e) {
        next(e);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const result = await AuthService.login(req.body);
        res.cookie('refreshToken', result.tokens.refreshToken, {
            httpOnly: true, secure: env_1.env.NODE_ENV === 'production',
            sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        (0, response_1.sendSuccess)(res, { user: result.user, accessToken: result.tokens.accessToken }, { message: 'Login successful' });
    }
    catch (e) {
        next(e);
    }
};
exports.login = login;
const logout = async (req, res, next) => {
    try {
        await AuthService.logout(req.user.id);
        res.clearCookie('refreshToken');
        (0, response_1.sendSuccess)(res, null, { message: 'Logged out' });
    }
    catch (e) {
        next(e);
    }
};
exports.logout = logout;
const refresh = async (req, res, next) => {
    try {
        const token = req.body.refreshToken ?? req.cookies.refreshToken;
        const tokens = await AuthService.refreshTokens(token);
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true, secure: env_1.env.NODE_ENV === 'production',
            sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        (0, response_1.sendSuccess)(res, { accessToken: tokens.accessToken }, { message: 'Token refreshed' });
    }
    catch (e) {
        next(e);
    }
};
exports.refresh = refresh;
const forgotPassword = async (req, res, next) => {
    try {
        await AuthService.forgotPassword(req.body.email);
        (0, response_1.sendSuccess)(res, null, { message: 'If that email exists, a reset link has been sent' });
    }
    catch (e) {
        next(e);
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    try {
        await AuthService.resetPassword(req.body.token, req.body.password);
        (0, response_1.sendSuccess)(res, null, { message: 'Password updated — please log in again' });
    }
    catch (e) {
        next(e);
    }
};
exports.resetPassword = resetPassword;
const verifyEmail = async (req, res, next) => {
    try {
        await AuthService.verifyEmail(req.query.token);
        res.redirect(`${env_1.env.FRONTEND_URL}/verified`);
    }
    catch (e) {
        next(e);
    }
};
exports.verifyEmail = verifyEmail;
const me = async (req, res, next) => {
    try {
        const user = await AuthService.getMe(req.user.id);
        (0, response_1.sendSuccess)(res, user);
    }
    catch (e) {
        next(e);
    }
};
exports.me = me;
const updateProfile = async (req, res, next) => {
    try {
        const updated = await AuthService.updateProfile(req.user.id, req.body);
        (0, response_1.sendSuccess)(res, updated, { message: 'Profile updated' });
    }
    catch (e) {
        next(e);
    }
};
exports.updateProfile = updateProfile;
const googleOAuthRedirect = (_req, res) => {
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.set('client_id', env_1.env.GOOGLE_CLIENT_ID);
    url.searchParams.set('redirect_uri', env_1.env.GOOGLE_CALLBACK_URL);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'openid email profile');
    res.redirect(url.toString());
};
exports.googleOAuthRedirect = googleOAuthRedirect;
const googleOAuthCallback = async (req, res, next) => {
    try {
        const { GoogleOAuthService } = await Promise.resolve().then(() => __importStar(require('../services/googleOAuth.service')));
        const result = await GoogleOAuthService.handleCallback(req.query.code);
        res.cookie('refreshToken', result.tokens.refreshToken, {
            httpOnly: true, secure: env_1.env.NODE_ENV === 'production', sameSite: 'strict',
        });
        res.redirect(`${env_1.env.FRONTEND_URL}/auth/callback?token=${result.tokens.accessToken}`);
    }
    catch (e) {
        next(e);
    }
};
exports.googleOAuthCallback = googleOAuthCallback;
//# sourceMappingURL=auth.controller.js.map