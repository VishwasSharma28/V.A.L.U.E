"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = sendVerificationEmail;
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
function createTransporter() {
    if (!env_1.env.SMTP_HOST)
        return null;
    return nodemailer_1.default.createTransport({
        host: env_1.env.SMTP_HOST,
        port: env_1.env.SMTP_PORT ?? 587,
        secure: (env_1.env.SMTP_PORT ?? 587) === 465,
        auth: { user: env_1.env.SMTP_USER, pass: env_1.env.SMTP_PASS },
    });
}
const transporter = createTransporter();
async function sendEmail(to, subject, html) {
    if (!transporter) {
        logger_1.logger.warn('SMTP not configured — email skipped');
        return;
    }
    await transporter.sendMail({ from: env_1.env.EMAIL_FROM, to, subject, html });
}
async function sendVerificationEmail(to, name, token) {
    const link = `${env_1.env.APP_URL}/api/v1/auth/verify-email?token=${token}`;
    await sendEmail(to, 'Verify your V.A.L.U.E account', `
    <h2>Hi ${name},</h2>
    <p>Click the link to verify your email:</p>
    <a href="${link}" style="background:#2D9B83;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;">Verify Email</a>
    <p>Link expires in 24 hours.</p>
  `);
}
async function sendPasswordResetEmail(to, name, token) {
    const link = `${env_1.env.FRONTEND_URL}/reset-password?token=${token}`;
    await sendEmail(to, 'Reset your V.A.L.U.E password', `
    <h2>Hi ${name},</h2>
    <p>You requested a password reset:</p>
    <a href="${link}" style="background:#2D9B83;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;">Reset Password</a>
    <p>Link expires in 1 hour. If you did not request this, ignore this email.</p>
  `);
}
//# sourceMappingURL=email.service.js.map