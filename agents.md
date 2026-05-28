# agents.md

AI coding agent reference for the **AI-Powered Personal Finance Automation System** — a self-hosted monorepo that ingests bank emails/PDFs, AI-categorizes transactions via Gemini, and presents analytics in a Vue.js dashboard.

Banks: BCA, Jenius, UOB, BRI · Payment types: Debit, Credit · Deployment: Docker on VPS

---

## Monorepo Layout

```
/
├── PRD.md
├── agents.md
├── docker-compose.yml
├── package.json          # pnpm workspace root
├── .nvmrc                # Node 20
├── backend/              # Express.js API
└── frontend/             # Vue 3 SPA
```

---

## Backend

**Stack:** Node 20 · Express 5 · TypeScript (strict) · Prisma 7 + `@prisma/adapter-pg` · PostgreSQL · Zod 4 · JWT · Google SSO (OAuth 2.0 via `google-auth-library`) · BullMQ · ioredis · Gemini (`gemini-1.5-flash`) · pdf-parse · helmet · cors · morgan

### Environment (`backend/.env`)

| Variable               | Required | Default / Notes                     |
| ---------------------- | -------- | ----------------------------------- |
| `NODE_ENV`             | yes      | `development` / `production`        |
| `PORT`                 | yes      | `3000`                              |
| `DATABASE_URL`         | yes      | PostgreSQL connection string        |
| `REDIS_URL`            | yes      | Redis connection string             |
| `JWT_SECRET`           | yes      | Random secret                       |
| `JWT_EXPIRES_IN`       | no       | `7d`                                |
| `GEMINI_API_KEY`       | yes*     | Required for AI categorization      |
| `GOOGLE_CLIENT_ID`     | yes      | Google OAuth client ID              |
| `GOOGLE_CLIENT_SECRET` | yes      | Google OAuth client secret          |
| `GOOGLE_REDIRECT_URI`  | no       | `http://localhost:3000/api/v1/auth/google/callback` |
| `FRONTEND_URL`         | no       | `http://localhost:5173`             |
| `STATEMENTS_DIR`       | no       | `./storage/statements`              |

### Commands

```bash
nvm use 20                                     # always use Node 20
cd backend && npm run dev                      # dev server (port 3000)
cd backend && npm run build                    # production build → dist/
cd backend && node_modules/.bin/tsc --noEmit   # type-check
cd backend && npm run db:migrate               # run migrations
cd backend && npm run db:generate              # regenerate Prisma client
cd backend && npm run db:studio                # Prisma GUI
```

### Architecture

```
Route → Middleware → Controller → Service → Repository → Database
```

- **Controller** — validates request, calls service, returns response. No logic.
- **Service** — all business logic.
- **Repository** — all Prisma/SQL access. Never called from controllers directly.

### File Map

```
backend/src/
├── config/env.ts                        # requireEnv() — throws on missing vars
├── infrastructure/
│   ├── database/prisma.ts               # PrismaClient singleton (PrismaPg adapter)
│   ├── redis/client.ts                  # ioredis singleton
│   └── queue/index.ts                   # BullMQ queues; enqueueAiCategorization(), enqueuePdfParsing()
├── shared/
│   ├── errors/index.ts                  # AppError, NotFoundError, UnauthorizedError, etc.
│   ├── logger/index.ts                  # logger.info/warn/error/debug
│   ├── middleware/
│   │   ├── auth.middleware.ts           # Bearer → req.user = { id, email }
│   │   ├── validate.middleware.ts       # validate(zodSchema, 'body'|'query'|'params')
│   │   └── error.middleware.ts          # Global error handler + notFoundMiddleware
│   └── utils/
│       ├── response.ts                  # sendSuccess / sendError / sendCreated / sendPaginated
│       ├── hash.ts                      # hashPassword / comparePassword
│       └── jwt.ts                       # signToken / verifyToken
├── modules/
│   ├── auth/                            # GET /auth/google, GET /auth/google/callback, GET /auth/me
│   ├── transactions/                    # GET /transactions, GET /transactions/:id
│   ├── statements/                      # GET/POST /statements; pdf.worker.ts (BullMQ)
│   ├── dashboard/                       # GET /dashboard/summary|monthly|daily|top-categories|banks|bank-payments|payment-types
│   ├── analytics/                       # GET /analytics/trend|categories|merchants|payment-types
│   └── ai/                              # GET /ai/summary; ai.worker.ts (BullMQ)
├── routes/index.ts                      # Mounts all modules under /api/v1
├── app.ts                               # Express setup: helmet, cors, morgan, routes, error handling
└── server.ts                            # Entry: connects DB, starts workers, listens on PORT
```

Each module follows: `*.schema.ts` · `*.repository.ts` · `*.service.ts` · `*.controller.ts` · `*.routes.ts`

### Background Workers

| Worker       | Queue                | Trigger          | Action                                              |
| ------------ | -------------------- | ---------------- | --------------------------------------------------- |
| `pdf.worker` | `pdf-parsing`        | Statement upload | Extracts PDF text, inserts transactions, enqueues AI |
| `ai.worker`  | `ai-categorization`  | Per transaction  | Calls Gemini, updates category in DB                |

### API Reference

Base: `/api/v1` · Auth required on all routes except `/auth/*` · Header: `Authorization: Bearer <token>`

| Method | Path                       | Input                                                              | Description                  |
| ------ | -------------------------- | ------------------------------------------------------------------ | ---------------------------- |
| GET    | /auth/google               |                                                                    | Redirect to Google OAuth consent screen |
| GET    | /auth/google/callback      | query: `code`                                                      | Exchange code → redirect to `{FRONTEND_URL}/auth-callback?token=<jwt>` (mounted at `/api/v1/auth/google/callback`) |
| GET    | /auth/me                   | header: Bearer token                                               | Return current user `{ id, email, name, avatarUrl }` |
| GET    | /transactions              | query: `page, limit, startDate, endDate, bankType, paymentType, category, merchant, sortBy, sortOrder` | Paginated list |
| GET    | /transactions/:id          |                                                                    | Single transaction            |
| GET    | /statements                | query: `page, limit, bankType`                                     | Paginated list                |
| GET    | /statements/:id            |                                                                    | Statement + transactions      |
| POST   | /statements                | form-data: `file, bankType, statementMonth (YYYY-MM)`              | Upload PDF → background parse |
| GET    | /dashboard/summary         | query: `year, bankType?`                                           | Aggregate totals              |
| GET    | /dashboard/monthly         | query: `year, bankType?`                                           | Monthly totals by bank        |
| GET    | /dashboard/daily           | query: `year, month?, bankType?`                                   | Day-of-month totals           |
| GET    | /dashboard/top-categories  | query: `year, bankType?`                                           | Top 10 categories             |
| GET    | /dashboard/banks           | query: `year, bankType?`                                           | Total per bank                |
| GET    | /dashboard/bank-payments   | query: `year, bankType?`                                           | Debit/credit split per bank   |
| GET    | /dashboard/payment-types   | query: `year, bankType?`                                           | Debit vs credit totals        |
| GET    | /analytics/trend           | query: `startDate, endDate, bankType?, groupBy`                    | Spending over time            |
| GET    | /analytics/categories      | query: `startDate, endDate, bankType?, groupBy`                    | Category breakdown            |
| GET    | /analytics/merchants       | query: `startDate, endDate, bankType?, groupBy`                    | Top 20 merchants              |
| GET    | /analytics/payment-types   | query: `startDate, endDate, bankType?, groupBy`                    | Payment type aggregation      |
| POST   | /email/webhook             | header: `X-Webhook-Secret`; body: `{ messageId, subject, from, body, bankType, receivedAt? }` | Parse email → create transaction + enqueue AI |
| GET    | /ai/summary                | query: `startDate?, endDate?`                                      | AI prose spending summary     |
| GET    | /health                    |                                                                    | `{ status: "ok" }`            |

**Response envelope:**

```json
{ "success": true, "data": {}, "message": "", "meta": { "total": 0, "page": 1, "limit": 20, "totalPages": 0 } }
{ "success": false, "error": "Human-readable message", "code": "VALIDATION_ERROR" }
```

### Database Schema

> Prisma 7: no `url` in `schema.prisma`. Use `backend/prisma.config.ts` with `@prisma/adapter-pg`.  
> Model fields are **camelCase**; DB columns are **snake_case** via `@map`.

```prisma
model Transaction {
  id              String    @id @default(uuid())
  bankType        String    @map("bank_type")
  paymentType     String    @map("payment_type")
  merchant        String
  amount          Decimal   @db.Decimal(15, 2)
  currency        String    @default("IDR")
  transactionDate DateTime  @map("transaction_date")
  category        String    @default("")
  subcategory     String    @default("")
  statementId     String?   @map("statement_id")
  createdAt       DateTime  @default(now()) @map("created_at")
  @@map("transactions")
}

model Statement {
  id             String
  bankType       String   @map("bank_type")
  statementMonth DateTime @db.Date @map("statement_month")
  pdfPath        String   @map("pdf_path")
  uploadedAt     DateTime @map("uploaded_at")
  @@map("statements")
}

model User {
  id        String
  email     String   @unique
  password  String
  createdAt DateTime @map("created_at")
  @@map("users")
}
```

---

## Frontend

**Stack:** Vue 3 (Composition API) · TypeScript (strict) · Vite 8 · Tailwind CSS v4 · @unovis/vue · Pinia · Vue Router 5 · native `fetch` · dayjs

### Commands

```bash
cd frontend && npm run dev                                          # dev server (port 5173, proxies /api → :3000)
cd frontend && npm run build                                        # production build
cd frontend && node node_modules/vue-tsc/bin/vue-tsc.js --noEmit   # type-check
```

### File Map

```
frontend/src/
├── app/
│   ├── layouts/           # AppLayout, AppSidebar, AppHeader, AppBottomNav
│   └── router/index.ts    # Routes + auth guard (requiresAuth meta)
├── modules/
│   ├── auth/LoginView.vue
│   ├── dashboard/DashboardView.vue
│   ├── transactions/TransactionsView.vue
│   ├── statements/StatementsView.vue + StatementCard.vue
│   └── analytics/AnalyticsView.vue
├── components/
│   ├── charts/            # BarChart, LineChart, DonutChart (@unovis)
│   ├── table/DataTable.vue
│   └── ui/                # AppCard, AppBadge, StatCard, LoadingSpinner, ErrorMessage
├── services/
│   ├── http.ts            # fetch wrapper; base /api/v1; returns ApiWrapper<T>; auto Bearer token
│   ├── auth.service.ts
│   ├── dashboard.service.ts   # fans out to 6 endpoints → DashboardData
│   ├── transaction.service.ts # maps camelCase API → snake_case types
│   └── statement.service.ts
├── stores/                # auth, dashboard, transaction, statement (Pinia)
├── types/index.ts         # snake_case interfaces matching HTTP JSON keys
└── styles/main.css        # Tailwind v4 entry + CSS custom properties (--color-primary, etc.)
```

---

## Rules

### Never
- Query Prisma from a controller — use the repository layer.
- Put business logic in a controller — services only.
- Use `any` in TypeScript.
- Hardcode category mappings — AI handles categorization.
- Add `DATABASE_URL` to `schema.prisma` (Prisma 7 — use `prisma.config.ts`).
- Use axios, lodash, moment.js, Vuetify, Element Plus, or PrimeVue.
- Commit `.env`.

### Always
- `nvm use 20` before running any command.
- Run `tsc --noEmit` (backend) and `vue-tsc --noEmit` (frontend) before committing.
- Run `npm run db:generate` after changing `schema.prisma`.
- Throw typed `AppError` subclasses — never plain strings.
- Use `sendSuccess` / `sendError` / `sendPaginated` in every controller.
- Raw SQL for dashboard/analytics aggregations; column names stay snake_case.
- Use `@/` path alias (maps to `src/`) in both backend and frontend.

---

## Local Setup

```bash
createdb ai_wallet_db
cp backend/.env.example backend/.env   # edit DATABASE_URL, JWT_SECRET, GEMINI_API_KEY

cd backend && npm install && npm run db:migrate && npm run db:generate && npm run dev
# in another terminal:
cd frontend && npm install && npm run dev
```

Visit `http://localhost:5173`.

---

## Docker

```bash
docker compose up -d              # start all services
docker compose down               # stop
docker compose logs -f backend    # tail logs
```

Services: `nginx` (80/443) · `frontend` · `backend` (3000) · `postgres` · `redis` · `n8n`

---

## Pending

| Feature                                           | Status  |
| ------------------------------------------------- | ------- |
| Gmail OAuth integration                           | Done    |
| n8n automation workflows                          | Done    |
| Email transaction parsing                         | Done    |
| Statement upload UI                               | Done    |
| AI summary widget in dashboard                    | Pending |
| Delete `frontend/src/services/mock-data.ts`       | Cleanup |
