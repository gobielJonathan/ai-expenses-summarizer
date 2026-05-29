# PRD.md

# AI-Powered Personal Finance Automation System

Version: 3.2
Status: Draft
Deployment: Self-hosted VPS
Architecture: Monorepo
Automation Engine: n8n

---

# 1. Executive Summary

Build an AI-powered personal finance automation platform that:

* Reads transaction notification emails automatically
* Reads credit card e-statement PDFs automatically
* Extracts structured transaction data
* Uses AI to categorize all expenses dynamically
* Generates financial analytics dashboards
* Stores monthly e-statements
* Sends daily and monthly summaries

Supported banks:

* BCA
* Jenius
* UOB
* BRI

Supported payment types:

* Debit
* Credit

---

# 2. Product Goals

# Main Goals

## Automation

Automatically process:

* transaction emails
* QRIS transactions
* debit notifications
* credit card notifications
* monthly statements

---

## AI Categorization

ALL categorization MUST use AI.

No hardcoded category mapping.

---

## Financial Analytics Dashboard

Analytics charts are embedded directly in the Dashboard page.

User can view:

* monthly expense chart
* daily expense chart
* top categories
* expense by bank
* expense by payment type
* transaction history
* e-statement PDFs

---

# 3. Technical Architecture

# High-Level Architecture

```text id="m9s0pa"
Gmail API
    ↓
n8n Automation
    ↓
Express.js Backend API
    ↓
PostgreSQL
    ↓
Vue.js Frontend Dashboard
```

---

# 4. Frontend Technical Requirements

# Framework

| Component                 | Requirement              |
| ------------------------- | ------------------------ |
| Framework                 | Vue.js 3                 |
| Build Tool                | Vite                     |
| Styling                   | Tailwind CSS v4          |
| Visualization             | @unovis/ts               |
| Vue Visualization Wrapper | @unovis/vue              |
| State Management          | Pinia                    |
| Router                    | Vue Router               |
| HTTP Client               | native fetch             |
| Table                     | lightweight custom table |

---

# Frontend Goals

## MUST prioritize:

* lightweight bundle size
* fast rendering
* minimal dependencies
* responsive UI
* clean architecture
* maintainability

---

# Frontend Performance Principles

## Use Native APIs Whenever Possible

Avoid:

* axios
* lodash
* moment.js

Use:

* native fetch
* dayjs
* modern JS APIs

---

# Avoid Heavy UI Libraries

DO NOT use:

* Vuetify
* Element Plus
* PrimeVue

Reason:

* large bundle size
* slower performance

---

# Visualization Library

## Required

```bash id="8rq0tq"
@unovis/ts
@unovis/vue
```

Reason:

* lightweight
* performant
* modern SVG rendering
* Vue optimized

---

# Frontend Folder Structure

```text id="w1qg2m"
/frontend
├── src
│   ├── app
│   │   ├── router
│   │   ├── providers
│   │   └── layouts
│   │
│   ├── modules
│   │   ├── dashboard
│   │   ├── transactions
│   │   ├── statements
│   │   └── auth
│   │
│   ├── components
│   │   ├── ui
│   │   ├── charts
│   │   ├── table
│   │   └── forms
│   │
│   ├── composables
│   ├── services
│   ├── stores
│   ├── utils
│   ├── styles
│   └── types
│
├── public
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

---

# Frontend Clean Code Principles

## Module-based architecture

Every feature isolated by domain.

---

## Shared Components

Reusable:

* charts
* cards
* table
* modal
* filters

---

## Avoid Global State Overuse

Use Pinia only when necessary.

---

## Strong Typing

Use TypeScript everywhere.

---

# Dashboard Features

# A. Monthly Expense Chart

## Visualization

* line chart
* bar chart

## Data

January → December

---

# B. Daily Expense Chart

## Visualization

* weekday spending
* Monday → Sunday

---

# C. Top 5 Categories

## Visualization

* donut chart
* horizontal bar chart

---

# D. Expense by Bank

## Visualization

* stacked bar chart
* pie chart

Supported:

* UOB
* BCA
* Jenius
* BRI

---

# E. Expense by Payment Type

## Visualization

* debit vs credit
* donut chart

---

# F. Transaction Table

## Features

* filtering
* pagination
* sorting
* search

---

# G. Statement Management

## Features

* PDF preview
* PDF download
* grouped by month
* grouped by bank
* manual upload of bank e-statement PDF from the UI
  * select bank (BCA, Jenius, UOB, BRI)
  * select statement month (YYYY-MM)
  * drag-and-drop or file picker (PDF only)
  * upload progress feedback
  * refresh statement list on success

---

# 5. Backend Technical Requirements

# Backend Stack

| Component      | Requirement   |
| -------------- | ------------- |
| Runtime        | Node.js       |
| Framework      | Express.js    |
| ORM            | Prisma        |
| Database       | PostgreSQL    |
| Validation     | Zod           |
| Auth           | Google SSO (OAuth 2.0) + JWT |
| AI Integration | Ollama (local LLM) |
| Queue          | BullMQ        |
| Cache          | Redis         |

---

# Backend Goals

## MUST prioritize:

* clean architecture
* modularity
* scalability
* low memory usage
* maintainability

---

# Backend Clean Architecture

## Layers

```text id="wn9kl9"
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Database
```

---

# Backend Folder Structure

```text id="exm4e7"
/backend
├── src
│   ├── config
│   │
│   ├── modules
│   │   ├── auth
│   │   ├── transactions
│   │   ├── statements
│   │   ├── analytics
│   │   ├── dashboard
│   │   ├── ai
│   │   └── gmail
│   │
│   ├── shared
│   │   ├── middleware
│   │   ├── utils
│   │   ├── constants
│   │   ├── logger
│   │   └── errors
│   │
│   ├── infrastructure
│   │   ├── database
│   │   ├── redis
│   │   ├── queue
│   │   └── external
│   │
│   ├── routes
│   ├── app.ts
│   └── server.ts
│
├── prisma
├── package.json
└── tsconfig.json
```

---

# Backend Principles

# Use TypeScript

Mandatory.

---

# Keep Controllers Thin

Controllers only:

* validate request
* call service
* return response

---

# Business Logic Only in Services

All:

* AI categorization
* analytics
* statement parsing
* aggregation

must live in services.

---

# Database Access via Repository Layer

Never query database directly from controllers.

---

# Avoid Heavy Dependencies

DO NOT use:

* Sequelize
* TypeORM
* massive utility libraries

Reason:

* performance
* memory usage
* complexity

---

# Recommended Lightweight Dependencies

## Backend

```bash id="kwm9a1"
express
prisma
zod
jsonwebtokengoogleapisbullmq
ioredis
dayjs
pdf-parse
```

---

# Frontend

```bash id="83pq6l"
vue
vue-router
pinia
tailwindcss
@unovis/ts
@unovis/vue
dayjs
```

---

# 5b. Authentication

# Method

Google SSO (OAuth 2.0) only.

No email/password registration or login.

---

# Google OAuth Flow

```text
User clicks "Sign in with Google"
    ↓
Backend redirects to Google OAuth consent screen
    ↓
Google redirects to /auth-callback?code=...
    ↓
Frontend exchanges code via backend
    ↓
Backend verifies token, upserts User by googleId
    ↓
Backend issues JWT
    ↓
Frontend stores JWT, redirects to /dashboard
```

---

# Auth Endpoints

| Method | Path                  | Description                              |
| ------ | --------------------- | ---------------------------------------- |
| GET    | /auth/google          | Redirect to Google OAuth consent screen  |
| GET    | /auth/google/callback | Exchange code → JWT (server-side)        |
| GET    | /auth/me              | Return current user from JWT             |

---

# OAuth Config

| Parameter              | Value                         |
| ---------------------- | ----------------------------- |
| Provider               | Google                        |
| Scopes                 | openid, email, profile        |
| Authorised Redirect URI | `{BACKEND_URL}/auth/google/callback` |
| Frontend callback path | `/auth-callback`              |

After server-side token exchange, backend redirects to:

```
{FRONTEND_URL}/auth-callback?token=<jwt>
```

Frontend reads the token from the URL and stores it.

---

# User Schema (updated)

| Column        | Type      | Notes                    |
| ------------- | --------- | ------------------------ |
| id            | UUID      | Primary key              |
| email         | text      | Unique, from Google      |
| name          | text      | Display name from Google |
| avatar_url    | text      | Profile picture URL      |
| google_id     | text      | Unique Google sub claim  |
| created_at    | timestamp |                          |

Password field removed — authentication is Google SSO only.

---

# 6. AI Architecture

# AI Responsibilities

AI MUST handle:

* categorization
* subcategorization
* merchant understanding
* transaction context

---

# AI SHOULD NOT HANDLE

Avoid AI for:

* regex extraction
* email detection
* deterministic parsing

---

# AI Pipeline

```text id="vkj2lh"
Transaction Extracted
    ↓
Send Merchant + Context to AI
    ↓
Return Category + Subcategory
    ↓
Save to Database
```

---

# 7. Statement Parsing

# Flow

```text id="rwj0tr"
Statement Email
    ↓
PDF Download
    ↓
PDF Text Extraction
    ↓
AI Structured Parsing
    ↓
Transaction Insert
```

---

# 8. Dashboard APIs

# Required APIs

| Endpoint                      | Purpose           |
| ----------------------------- | ----------------- |
| GET /dashboard/monthly        | monthly chart     |
| GET /dashboard/daily          | weekday chart     |
| GET /dashboard/top-categories | top categories    |
| GET /dashboard/banks          | expense per bank  |
| GET /dashboard/payment-types  | debit vs credit   |
| GET /transactions             | transaction table |
| GET /statements               | e-statement list  |

---

# 9. Database Schema

# Transactions Table

| Column           | Type      |
| ---------------- | --------- |
| id               | UUID      |
| bank_type        | text      |
| payment_type     | text      |
| merchant         | text      |
| amount           | decimal   |
| currency         | text      |
| transaction_date | timestamp |
| category         | text      |
| subcategory      | text      |
| statement_id     | UUID      |
| created_at       | timestamp |

---

# Statements Table

| Column          | Type      |
| --------------- | --------- |
| id              | UUID      |
| bank_type       | text      |
| statement_month | date      |
| pdf_path        | text      |
| uploaded_at     | timestamp |

---

# 10. Deployment Architecture

```text id="w0m2rh"
Docker
 ├── frontend (Vue)
 ├── backend (Express)
 ├── n8n
 ├── postgres
 ├── redis
 └── nginx
```

---

# 11. VPS Requirements

# MVP

| Resource | Minimum   |
| -------- | --------- |
| CPU      | 2 vCPU    |
| RAM      | 4 GB      |
| Storage  | 40 GB SSD |

---

# Production

| Resource | Recommended |
| -------- | ----------- |
| CPU      | 4 vCPU      |
| RAM      | 8 GB        |
| Storage  | 80 GB SSD   |

---

# 12. Development Principles

# MUST FOLLOW

## Clean Code

* modular architecture
* separation of concerns
* domain-driven modules

---

## Performance First

* lightweight dependencies
* optimized bundle
* lazy loading
* pagination

---

## Scalability

* queue-based jobs
* stateless backend
* modular APIs

---

# 13. Final Recommended Stack

```text id="8i8h25"
Frontend:
Vue.js
Tailwind CSS v4
Unovis Charts

Backend:
Express.js
Prisma
PostgreSQL

Automation:
n8n
Gmail API

AI:
Ollama / Llama 3.2 3B
```

---

# 14. Final Architecture Recommendation

```text id="pljlwm"
Gmail API
    ↓
n8n
    ↓
Express API
    ↓
AI Categorization
    ↓
PostgreSQL
    ↓
Vue Dashboard
```

This architecture is:

* lightweight
* scalable
* clean-code oriented
* VPS friendly
* production ready
* low operational cost

---

# 15. PRD Update v3.2 — WhatsApp Conversational Assistant via n8n

---

# WhatsApp Integration

## Goal

Allow users to interact with the finance system using WhatsApp.

Users can send messages to a WhatsApp Business number and receive personalized expense information generated from their own financial data.

---

# Architecture Decision

## Core Processing

The following remain inside Express.js:

* Authentication
* User Management
* Gmail Synchronization
* Transaction Parsing
* Statement Parsing
* AI Categorization
* Dashboard APIs
* Analytics Engine

---

## Conversational Layer

The following are handled by n8n:

* WhatsApp Cloud API webhook
* Incoming message processing
* Intent routing
* Calling backend APIs
* Formatting responses
* Sending WhatsApp replies

---

# Updated High-Level Architecture

```text
WhatsApp User
        ↓
Meta WhatsApp Cloud API
        ↓
n8n Workflow
        ↓
Express API
        ↓
PostgreSQL
        ↓
Analytics Engine
        ↓
Response
        ↓
n8n
        ↓
WhatsApp Reply
```

---

# User Linking

## Requirement

Each WhatsApp number must be linked to a system account.

---

## Data Isolation

Each user can only access their own expense data.

The following rules MUST be enforced:

* A WhatsApp number can only be linked to ONE user account
* Only verified numbers can query expense data
* n8n MUST verify the sender phone number before calling any `/chat/*` endpoint
* If the number is not linked or not verified → send a rejection message back to the user
* Under no circumstances should one user's data be returned to another user's WhatsApp number

n8n verification flow:

```text
WhatsApp Message arrives
        ↓
n8n calls GET /whatsapp/lookup?phoneNumber=+628xx
        ↓
Backend checks whatsapp_accounts for verified match
        ↓
If NOT found or NOT verified → n8n replies "Please link your number at {FRONTEND_URL}/settings"
        ↓
If verified → n8n calls /chat/* with X-Phone-Number header
        ↓
Backend re-validates X-Phone-Number on every /chat/* request
        ↓
Returns data only for the verified owner
```

The `/whatsapp/lookup` endpoint is protected by `X-Webhook-Secret` (not JWT) so n8n can call it server-to-server.

The `/chat/*` endpoints accept two auth methods:
* `Authorization: Bearer <jwt>` — for frontend (dashboard)
* `X-Phone-Number` + `X-Webhook-Secret` headers — for n8n WhatsApp calls

---

## whatsapp_accounts

| Column       | Type      |
| ------------ | --------- |
| id           | UUID      |
| user_id      | UUID      |
| phone_number | varchar   |
| is_verified  | boolean   |
| created_at   | timestamp |

---

# WhatsApp Account Linking Flow

```text
User Login
    ↓
Profile Settings
    ↓
Link WhatsApp Number
    ↓
OTP Verification
    ↓
Store WhatsApp Number
```

---

# Conversational Use Cases

## Expense Summary

User:

```text
summary
```

Response:

```text
Today's Expenses

Total:
Rp 285,000

Top Categories:
1. Food Rp 120,000
2. Transportation Rp 90,000
3. Shopping Rp 75,000
```

---

## Monthly Summary

User:

```text
monthly summary
```

Response:

```text
May 2026

Total Spending:
Rp 8,520,000

Top Categories:
1. Shopping
2. Food
3. Transportation

Payment Type:
Credit 70%
Debit 30%
```

---

## Category Breakdown

User:

```text
food expenses this month
```

Response:

```text
Food Expenses

Total:
Rp 1,250,000

Top Merchants:
- Starbucks
- McDonald's
- Sushi Tei
```

---

## Expense by Bank

User:

```text
expenses by bank
```

Response:

```text
BCA:
Rp 3,500,000

Jenius:
Rp 2,100,000

UOB:
Rp 1,800,000

BRI:
Rp 900,000
```

---

## Expense by Payment Type

User:

```text
credit card expenses
```

Response:

```text
Credit Card Spending

Total:
Rp 5,600,000

Top Categories:
- Shopping
- Travel
- Food
```

---

## Statement Lookup

User:

```text
show my May 2026 BCA statement
```

Response:

```text
Statement Found

Bank:
BCA

Month:
May 2026

Download:
https://...
```

---

# AI Chat Assistant

## Goal

Allow natural language financial questions.

Examples:

```text
How much did I spend on fuel this month?
```

```text
Which bank do I use the most?
```

```text
What was my largest expense last month?
```

```text
Compare April and May spending.
```

---

# AI Query Flow

```text
WhatsApp Message
      ↓
n8n
      ↓
Intent Detection
      ↓
Backend Query
      ↓
Analytics Service
      ↓
LLM Response Generation
      ↓
WhatsApp Reply
```

---

# Required Backend APIs

## GET /chat/summary

Returns:

```json
{
  "total": 285000,
  "categories": [...]
}
```

---

## GET /chat/monthly-summary

Returns monthly analytics.

---

## GET /chat/category-summary

Returns category breakdown.

---

## GET /chat/bank-summary

Returns spending grouped by bank.

---

## GET /chat/payment-summary

Returns spending grouped by payment type.

---

## GET /chat/statement

Returns statement metadata and PDF URL.

---

# n8n Responsibilities

## Incoming

* Receive WhatsApp webhooks
* Parse user messages
* Authenticate sender
* Call backend APIs

---

## Outgoing

* Format responses
* Send WhatsApp messages
* Handle errors
* Handle retries

---

# Meta WhatsApp Cloud API

## Integration Method

Use:

```text
Meta WhatsApp Cloud API
```

connected to:

```text
n8n WhatsApp Node
```

---

# MVP Commands

Supported commands:

```text
summary
```

```text
monthly summary
```

```text
top categories
```

```text
expenses by bank
```

```text
credit expenses
```

```text
debit expenses
```

```text
show statements
```

---

# Future Features

## AI Financial Advisor

Examples:

```text
How can I reduce my expenses?
```

```text
Why is my spending increasing?
```

```text
What category should I optimize?
```

---

# Final Architecture Recommendation (v3.2)

```text
Vue Dashboard
        ↓
Google SSO
        ↓
Express API
        ↓
PostgreSQL
        ↓
Cron Gmail Sync
        ↓
AI Categorization

WhatsApp Layer
        ↓
Meta WhatsApp Cloud API
        ↓
n8n
        ↓
Express Analytics APIs
```

n8n is approved only for:

* WhatsApp integration
* conversational workflows
* notification delivery

Core business logic remains inside Express.js.

---

# 16. PRD Update v3.3 — Local LLM Email Parsing via Ollama

---

## Goal

Replace fragile, hand-maintained bank-specific regex parsers with a local LLM that
understands natural language email bodies and extracts structured transaction data
without any code changes when email formats change.

---

## Problem with Regex Parsers

* Breaks silently when banks change email templates
* One parser per bank — grows linearly with new banks
* Multi-line, table-based HTML bodies require complex strip/regex chains
* WIB/WITA timezone suffixes, Indonesian month names, mixed Rp / IDR formats
  all require separate normalisation layers

---

## Solution: Local LLM via Ollama

Use **Llama 3.2 3B** running locally via **Ollama** to parse email bodies.
The model runs inside Docker on the VPS — no external API, no cost, no quota.

---

## What LLM Extracts

| Field             | Type                    | Example                    |
| ----------------- | ----------------------- | -------------------------- |
| merchant          | string                  | `NANO HEALTHY FAMILY`      |
| amount            | number                  | `370000`                   |
| transactionDate   | ISO 8601 string         | `2026-05-01T15:28:14`      |
| paymentType       | `DEBIT` \| `CREDIT`     | `CREDIT`                   |
| currency          | string                  | `IDR`                      |

---

## Fallback Strategy

```text
Email Body
      ↓
LLM Parser (Ollama / Llama 3.2 3B)   ← primary
      ↓ if unavailable or invalid JSON
Regex Fallback (per-bank parsers)     ← secondary
      ↓
ParsedTransaction
```

The existing per-bank regex parsers (`parseBca`, `parseJenius`, `parseUob`, `parseBri`)
are kept as fallback. If Ollama is down, parsing continues without interruption.

---

## Infrastructure

### Ollama Docker Service

```yaml
ollama:
  image: ollama/ollama
  volumes:
    - ollama-data:/root/.ollama
  restart: unless-stopped
```

### Model Pull (one-shot init container)

```yaml
ollama-init:
  image: ollama/ollama
  depends_on:
    ollama:
      condition: service_healthy
  entrypoint: ["ollama", "pull", "llama3.2:3b"]
  environment:
    OLLAMA_HOST: http://ollama:11434
```

### Manual Setup (outside Docker)

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull model
ollama pull llama3.2:3b

# Start server
ollama serve
```

---

## Backend Changes

### New env vars

| Variable      | Default                    | Description                     |
| ------------- | -------------------------- | ------------------------------- |
| OLLAMA_URL    | `http://ollama:11434`      | Ollama server base URL          |
| OLLAMA_MODEL  | `llama3.2:3b`              | Model name to use for parsing   |

### New file: `backend/src/modules/gmail/llm-parser.service.ts`

* Calls `POST {OLLAMA_URL}/api/generate` with `format: "json"` and `stream: false`
* Prompt instructs the model to return a JSON object with the 5 fields above
* Timeout: 45 s (3B model on CPU)
* Returns `LlmParsedTransaction | null` — null on any error, timeout, or invalid output

### Updated: `backend/src/modules/gmail/email.service.ts`

* `processEmailTransaction()` now tries LLM parser first
* Falls back to existing `parseEmailTransaction()` regex dispatcher if LLM returns null

---

## VPS Requirements (updated)

Running Llama 3.2 3B on CPU requires additional RAM.

| Resource | Previous MVP | With Ollama  |
| -------- | ------------ | ------------ |
| CPU      | 2 vCPU       | 4 vCPU       |
| RAM      | 4 GB         | 8 GB         |
| Storage  | 40 GB SSD    | 60 GB SSD    |

Llama 3.2 3B model size: ~2 GB. Inference on CPU: 2–10 s per email.

---

## Updated Final Stack

```text
Frontend:
Vue.js
Tailwind CSS v4
Unovis Charts

Backend:
Express.js
Prisma
PostgreSQL

Email Parsing:
Ollama (local LLM)
Llama 3.2 3B
↓ fallback ↓
Per-bank regex parsers

Automation:
n8n
Gmail API

AI Categorization:
Ollama / Llama 3.2 3B
```
