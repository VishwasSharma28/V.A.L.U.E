"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.coerce.number().default(5000),
    DATABASE_URL: zod_1.z.string().url(),
    REDIS_URL: zod_1.z.string().default('redis://localhost:6379'),
    // JWT
    JWT_ACCESS_SECRET: zod_1.z.string().min(32).default('dev-secret-key-min-32-chars-long!!!'),
    JWT_REFRESH_SECRET: zod_1.z.string().min(32).default('refresh-secret-key-min-32-chars!!!'),
    JWT_ACCESS_EXPIRY: zod_1.z.string().default('15m'),
    JWT_REFRESH_EXPIRY: zod_1.z.string().default('7d'),
    // Google OAuth
    GOOGLE_CLIENT_ID: zod_1.z.string().default('PLACEHOLDER_CLIENT_ID'),
    GOOGLE_CLIENT_SECRET: zod_1.z.string().default('PLACEHOLDER_CLIENT_SECRET'),
    GOOGLE_CALLBACK_URL: zod_1.z.string().url().default('http://localhost:5000/api/v1/auth/google/callback'),
    // Frontend
    FRONTEND_URL: zod_1.z.string().url().default('http://localhost:3000'),
    // OpenAI
    OPENAI_API_KEY: zod_1.z.string().optional(),
    OPENAI_MODEL: zod_1.z.string().default('gpt-4o-mini'),
    // Solana
    SOLANA_RPC_URL: zod_1.z.string().url().default('https://api.devnet.solana.com'),
    SOLANA_WALLET_KEY: zod_1.z.string().optional(),
    // Cloudinary
    CLOUDINARY_CLOUD_NAME: zod_1.z.string().optional(),
    CLOUDINARY_API_KEY: zod_1.z.string().optional(),
    CLOUDINARY_API_SECRET: zod_1.z.string().optional(),
    // Email
    SMTP_HOST: zod_1.z.string().optional(),
    SMTP_PORT: zod_1.z.coerce.number().optional(),
    SMTP_USER: zod_1.z.string().optional(),
    SMTP_PASS: zod_1.z.string().optional(),
    EMAIL_FROM: zod_1.z.string().email().optional(),
    // App
    APP_URL: zod_1.z.string().url().default('http://localhost:5000'),
});
const _env = envSchema.safeParse(process.env);
if (!_env.success) {
    console.error('❌ Invalid environment variables:', _env.error.flatten().fieldErrors);
    process.exit(1);
}
exports.env = _env.data;
//# sourceMappingURL=env.js.map