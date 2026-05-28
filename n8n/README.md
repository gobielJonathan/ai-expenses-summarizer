# n8n Automation Workflows

This directory contains n8n workflow JSON files for the AI-Powered Personal Finance Automation System.

---

## Workflows

| File | Description | Trigger |
|------|-------------|---------|
| `gmail-bank-notifications.json` | Polls Gmail for bank transaction emails, parses them, and ingests to the backend | Every 5 minutes |
| `gmail-statements.json` | Polls Gmail for e-statement emails with PDF attachments and uploads them | Every 6 hours |
| `daily-summary.json` | Fetches dashboard + AI summary and sends an HTML email report | Daily at 20:00 WIB |
| `monthly-summary.json` | Fetches previous month's full report and sends it | 1st of each month at 09:00 WIB |

---

## Prerequisites

1. n8n running via Docker (port 5678) — included in `docker-compose.yml`
2. A Gmail account with OAuth2 enabled for the Google Cloud project
3. The backend `N8N_API_KEY` environment variable set

---

## Setup Steps

### 1. Generate an API key

Add `N8N_API_KEY` to your root `.env` file with a strong random secret:

```bash
# Generate a secure key
openssl rand -hex 32
```

Add to `.env`:
```
N8N_API_KEY=<generated-key>
```

### 2. Configure n8n credentials

Open n8n at `http://localhost:5678` and create the following two credentials:

#### Gmail OAuth2 Account
- **Name:** `Gmail OAuth2 Account`
- **Type:** Gmail OAuth2
- Use your Google Cloud OAuth 2.0 credentials (same `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` from the backend `.env`)
- Scopes required: `https://www.googleapis.com/auth/gmail.readonly`, `https://www.googleapis.com/auth/gmail.send`, `https://www.googleapis.com/auth/gmail.modify`

#### Finance Backend API
- **Name:** `Finance Backend API`
- **Type:** Header Auth
- **Name:** `X-API-Key`
- **Value:** `<your N8N_API_KEY>`

### 3. Set the n8n variable `SUMMARY_EMAIL_TO`

In n8n → Settings → Variables, add:

| Key | Value |
|-----|-------|
| `SUMMARY_EMAIL_TO` | `your@email.com` |

This is the email address that daily and monthly reports are sent to.

### 4. Import the workflows

In n8n UI:
1. Go to **Workflows** → **Import from File**
2. Import each JSON file from `n8n/workflows/` one at a time

Or use the n8n CLI (if available):
```bash
n8n import:workflow --input=n8n/workflows/gmail-bank-notifications.json
n8n import:workflow --input=n8n/workflows/gmail-statements.json
n8n import:workflow --input=n8n/workflows/daily-summary.json
n8n import:workflow --input=n8n/workflows/monthly-summary.json
```

### 5. Activate the workflows

After importing, open each workflow in the n8n editor and click **Activate**. They will not run until activated.

---

## Workflow Details

### gmail-bank-notifications

Polls Gmail every 5 minutes for unread emails from known bank notification senders:
- BCA: `notifikasi@bca.co.id`, `hibca@bca.co.id`, `no-reply@klikbca.com`
- Jenius: `hello@jenius.com`, `notification@jenius.com`
- UOB: `alerts@uob.co.id`, `uob.alerts@uob.com`
- BRI: `info@bri.co.id`

For each email, a Code node:
1. Detects the bank from the sender/subject
2. Extracts: merchant name, amount, transaction date, payment type (debit/credit)
3. Skips if not a recognised bank notification

Valid transactions are POSTed to `POST /api/v1/transactions`, which enqueues them for AI categorization via Gemini.

**To extend bank support:** Edit the Code node `Detect Bank & Parse Email` and add new sender patterns and regex extractors.

---

### gmail-statements

Polls Gmail every 6 hours for unread emails with PDF attachments matching e-statement keywords (e.g., "e-statement", "laporan rekening", "tagihan").

For each match:
1. Extracts `bankType` (BCA/Jenius/UOB/BRI) from sender/subject
2. Extracts `statementMonth` in `YYYY-MM` format from subject/body (falls back to previous month)
3. POSTs the PDF to `POST /api/v1/statements` as multipart form-data

The backend then parses the PDF in a background worker and creates transactions.

---

### daily-summary

Runs every day at 20:00 (Asia/Jakarta). Fetches in parallel:
- `GET /api/v1/dashboard/summary?year=<current>`
- `GET /api/v1/ai/summary?startDate=<today>&endDate=<today>`

Formats an HTML email with year-to-date totals and AI spending insights, then sends it via Gmail.

---

### monthly-summary

Runs on the 1st of each month at 09:00 (Asia/Jakarta). Fetches in parallel for the previous month:
- `GET /api/v1/dashboard/summary`
- `GET /api/v1/dashboard/top-categories`
- `GET /api/v1/dashboard/banks`
- `GET /api/v1/ai/summary`

Formats a comprehensive HTML email report with tables for categories and bank breakdown, then sends it via Gmail.

---

## Backend API Changes (added for n8n)

### `POST /api/v1/transactions`

New endpoint for service-to-service transaction ingestion from n8n. Authenticated via `X-API-Key` header.

**Request body:**
```json
{
  "bankType": "BCA",
  "paymentType": "debit",
  "merchant": "Indomaret Sudirman",
  "amount": 45000,
  "currency": "IDR",
  "transactionDate": "2025-01-15T14:30:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": { "id": "uuid", ... },
  "message": "Transaction ingested and queued for AI categorization"
}
```

The transaction is immediately enqueued for AI categorization via the `ai-categorization` BullMQ queue.
