# PRD.md

# AI-Powered Personal Finance Automation System

Version: 3.1
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

User can view:

* monthly expense chart
* daily expense chart
* top 5 expense categories
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
│   │   ├── analytics
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
| AI Integration | Gemini API    |
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
Gemini Flash
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
