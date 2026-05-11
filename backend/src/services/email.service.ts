import nodemailer from 'nodemailer';
import { env }    from '../config/env';
import { logger } from '../utils/logger';

function createTransporter() {
  if (!env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT ?? 587,
    secure: (env.SMTP_PORT ?? 587) === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
}

const transporter = createTransporter();

async function sendEmail(to: string, subject: string, html: string) {
  if (!transporter) { logger.warn('SMTP not configured — email skipped'); return; }
  await transporter.sendMail({ from: env.EMAIL_FROM, to, subject, html });
}

export async function sendVerificationEmail(to: string, name: string, token: string) {
  const link = `${env.APP_URL}/api/v1/auth/verify-email?token=${token}`;
  await sendEmail(to, 'Verify your V.A.L.U.E account', `
    <h2>Hi ${name},</h2>
    <p>Click the link to verify your email:</p>
    <a href="${link}" style="background:#2D9B83;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;">Verify Email</a>
    <p>Link expires in 24 hours.</p>
  `);
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  const link = `${env.FRONTEND_URL}/reset-password?token=${token}`;
  await sendEmail(to, 'Reset your V.A.L.U.E password', `
    <h2>Hi ${name},</h2>
    <p>You requested a password reset:</p>
    <a href="${link}" style="background:#2D9B83;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;">Reset Password</a>
    <p>Link expires in 1 hour. If you did not request this, ignore this email.</p>
  `);
}
