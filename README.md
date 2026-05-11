# V.A.L.U.E — Value Assessment & Ledger for Usage Efficiency

> **Bloomberg Terminal × Apple × Cyberpunk Fintech** — A premium AI-powered financial intelligence platform for tracking, analyzing, and optimizing subscription value. Blockchain-verified. Real-time. Investor-demo ready.

---

## ✨ Features

| Feature | Status |
|---------|--------|
| 🔐 JWT Auth + Google OAuth | ✅ |
| 📊 Analytics Dashboard | ✅ |
| 🤖 AI Recommendations (OpenAI) | ✅ |
| ⛓️ Solana Blockchain Ledger | ✅ |
| 📡 Real-time via Socket.IO | ✅ |
| 📬 Notification System | ✅ |
| 👥 Shared Plans | ✅ |
| ⚡ Redis Caching | ✅ |
| 🐳 Docker Support | ✅ |
| 🌱 Seed Data | ✅ |

---

## 🏗️ Architecture

```
V.A.L.U.E/
├── frontend/          # Next.js 15 + TailwindCSS + Framer Motion
│   ├── app/           # App Router pages
│   ├── components/    # Glass cards, navbar, effects
│   ├── lib/           # API client (Axios + React Query)
│   └── store/         # Zustand auth store
└── backend/           # Express + TypeScript
    ├── src/
    │   ├── ai/        # OpenAI abstraction layer
    │   ├── analytics/ # Analytics engine
    │   ├── blockchain/# Solana abstraction layer
    │   ├── controllers/
    │   ├── jobs/      # Cron jobs
    │   ├── middlewares/
    │   ├── notifications/
    │   ├── recommendations/
    │   ├── routes/
    │   ├── services/
    │   ├── socket/    # Socket.IO handlers
    │   ├── types/
    │   ├── utils/
    │   └── validators/
    └── prisma/        # PostgreSQL schema
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- (Optional) OpenAI API key
- (Optional) Solana wallet

---

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### 2. Environment Setup

**Backend** — Copy and fill:

```bash
cd backend
copy .env.example .env
```

Minimum required variables:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/value_db
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=your_super_secret_at_least_32_chars
JWT_REFRESH_SECRET=your_other_super_secret_32_chars
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

**Frontend** — Already configured in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

### 3. Database Setup

```bash
cd backend

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with demo data
npm run db:seed
```

> **Demo credentials after seeding:**
> - Email: `vishwas@value.app`
> - Password: `Demo@1234`

---

### 4. Redis Setup

**Local:**
```bash
# Windows (WSL or Docker)
docker run -d -p 6379:6379 redis:7-alpine

# Or if Redis is installed natively:
redis-server
```

---

### 5. Run Development Servers

**Backend:**
```bash
cd backend
npm run dev
# API available at http://localhost:5000
# Health check: http://localhost:5000/health
```

**Frontend:**
```bash
cd frontend
npm run dev
# UI available at http://localhost:3000
```

---

### 6. Optional: OpenAI Setup

```env
# In backend/.env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

> Without this key, the system falls back to rule-based recommendations automatically.

---

### 7. Optional: Solana Setup

```env
# In backend/.env
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_WALLET_KEY=your_hex_encoded_private_key
```

> Without this, billing records are stored with local SHA-256 hashes only.

---

## 🐳 Docker Setup (Recommended)

Runs everything (API + PostgreSQL + Redis) with one command:

```bash
cd backend

# Copy env
copy .env.example .env
# Fill required values in .env

# Start all services
docker compose up -d

# Run migrations + seed inside container
docker compose exec api npx prisma migrate dev
docker compose exec api npm run db:seed

# Check logs
docker compose logs -f api
```

**Services:**

| Service   | Port |
|-----------|------|
| API       | 5000 |
| PostgreSQL| 5432 |
| Redis     | 6379 |

---

## 📡 API Reference

Base URL: `http://localhost:5000/api/v1`

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login |
| POST | `/auth/logout` | Logout |
| POST | `/auth/refresh` | Refresh tokens |
| POST | `/auth/forgot-password` | Send reset email |
| POST | `/auth/reset-password` | Reset password |
| GET  | `/auth/me` | Get current user |
| PATCH| `/auth/me` | Update profile |
| GET  | `/auth/google` | Google OAuth |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/summary` | Spend + waste totals |
| GET | `/dashboard/score` | Overall V.A.L.U.E score |
| GET | `/dashboard/subscriptions` | Active subscriptions |
| GET | `/dashboard/chart/spend` | 7-month spend trend |
| GET | `/dashboard/chart/efficiency` | Efficiency trend |
| GET | `/dashboard/recommendations` | AI recommendations |
| GET | `/dashboard/blockchain` | Latest ledger records |

### Subscriptions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/subscriptions` | List (paginated, filterable) |
| POST   | `/subscriptions` | Create |
| PATCH  | `/subscriptions/:id` | Update |
| DELETE | `/subscriptions/:id` | Delete |
| GET    | `/subscriptions/:id/score` | Get V.A.L.U.E score |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/summary` | Full analytics summary |
| GET | `/analytics/trend?granularity=monthly` | Spend trend |
| GET | `/analytics/categories` | Category breakdown |
| GET | `/analytics/efficiency` | Efficiency trend |

### Ledger

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ledger` | Paginated ledger records |
| GET | `/ledger/verify/:hash` | Verify a hash |

---

## ⚙️ Background Jobs

| Job | Schedule | Description |
|-----|----------|-------------|
| Value Score Recalculation | Every 6 hours | Recalculates scores for all users |
| AI Recommendations | Daily 2am | Generates fresh AI insights |
| Idle Detection | Every hour | Detects unused subscriptions |
| Analytics Snapshots | Daily midnight | Stores monthly aggregates |
| Billing Reminders | Daily 9am | Sends renewal notifications |

---

## 🎨 Design System

- **Background**: `#050505` — deep cinematic black
- **Cards**: Glassmorphism with `rgba(255,255,255,0.02)` + blur
- **Accent**: `#2D9B83` — premium teal with glow
- **Typography**: Satoshi (headings) + Manrope (body) + JetBrains Mono (data)
- **Cards**: 20-24px border-radius with `overflow:hidden` + 28-40px top safe-zone

---

## 🧪 Test Credentials

After running `npm run db:seed`:

```
Email:    vishwas@value.app
Password: Demo@1234
```

The seeded data includes:
- 8 subscriptions across all categories
- Value scores for each subscription
- 3 AI recommendations
- 5 blockchain ledger records
- 4 notifications
- Monthly analytics snapshot

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TailwindCSS, Framer Motion, Recharts |
| State | Zustand + TanStack React Query |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Cache | Redis (ioredis) |
| Auth | JWT + bcrypt + Google OAuth |
| AI | OpenAI GPT-4o-mini |
| Blockchain | Solana Web3.js |
| Realtime | Socket.IO |
| Jobs | node-cron |
| Email | Nodemailer |
| Uploads | Multer + Cloudinary |
| Validation | Zod |
| Security | Helmet, rate-limit, CORS |
| Containers | Docker + Docker Compose |

---

*V.A.L.U.E — Know exactly what every rupee is worth.*
