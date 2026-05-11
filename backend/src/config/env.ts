import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV:             z.enum(['development','production','test']).default('development'),
  PORT:                 z.coerce.number().default(5000),
  DATABASE_URL:         z.string().url(),
  REDIS_URL:            z.string().default('redis://localhost:6379'),

  // JWT
  JWT_ACCESS_SECRET:    z.string().min(32).default('dev-secret-key-min-32-chars-long!!!'),
  JWT_REFRESH_SECRET:   z.string().min(32).default('refresh-secret-key-min-32-chars!!!'),
  JWT_ACCESS_EXPIRY:    z.string().default('15m'),
  JWT_REFRESH_EXPIRY:   z.string().default('7d'),

  // Google OAuth
  GOOGLE_CLIENT_ID:     z.string().default('PLACEHOLDER_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: z.string().default('PLACEHOLDER_CLIENT_SECRET'),
  GOOGLE_CALLBACK_URL:  z.string().url().default('http://localhost:5000/api/v1/auth/google/callback'),

  // Frontend
  FRONTEND_URL:         z.string().url().default('http://localhost:3000'),

  // OpenAI
  OPENAI_API_KEY:       z.string().optional(),
  OPENAI_MODEL:         z.string().default('gpt-4o-mini'),

  // Solana
  SOLANA_RPC_URL:       z.string().url().default('https://api.devnet.solana.com'),
  SOLANA_WALLET_KEY:    z.string().optional(),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY:    z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // Email
  SMTP_HOST:            z.string().optional(),
  SMTP_PORT:            z.coerce.number().optional(),
  SMTP_USER:            z.string().optional(),
  SMTP_PASS:            z.string().optional(),
  EMAIL_FROM:           z.string().email().optional(),

  // App
  APP_URL:              z.string().url().default('http://localhost:5000'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = _env.data;
