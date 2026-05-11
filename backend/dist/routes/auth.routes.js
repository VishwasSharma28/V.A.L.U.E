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
const express_1 = require("express");
const AuthController = __importStar(require("../controllers/auth.controller"));
const validate_1 = require("../middlewares/validate");
const authenticate_1 = require("../middlewares/authenticate");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const auth_validator_1 = require("../validators/auth.validator");
const router = (0, express_1.Router)();
router.post('/register', rateLimiter_1.authRateLimiter, (0, validate_1.validate)(auth_validator_1.registerSchema), AuthController.register);
router.post('/login', rateLimiter_1.authRateLimiter, (0, validate_1.validate)(auth_validator_1.loginSchema), AuthController.login);
router.post('/logout', authenticate_1.authenticate, AuthController.logout);
router.post('/refresh', (0, validate_1.validate)(auth_validator_1.refreshSchema), AuthController.refresh);
router.post('/forgot-password', rateLimiter_1.authRateLimiter, (0, validate_1.validate)(auth_validator_1.forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', (0, validate_1.validate)(auth_validator_1.resetPasswordSchema), AuthController.resetPassword);
router.get('/verify-email', AuthController.verifyEmail);
router.get('/me', authenticate_1.authenticate, AuthController.me);
router.patch('/me', authenticate_1.authenticate, AuthController.updateProfile);
// Google OAuth
router.get('/google', AuthController.googleOAuthRedirect);
router.get('/google/callback', AuthController.googleOAuthCallback);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map