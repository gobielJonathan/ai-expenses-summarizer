import cron from 'node-cron'
import { google } from 'googleapis'
import fs from 'fs/promises'
import path from 'path'
import dayjs from 'dayjs'
import { env } from '../../config/env'
import { redis } from '../../infrastructure/redis/client'
import { prisma } from '../../infrastructure/database/prisma'
import { enqueueEmailParse, enqueuePdfParsing } from '../../infrastructure/queue'
import { createStatement } from '../statements/statements.repository'
import { logger } from '../../shared/logger'
import { AppError } from '../../shared/errors'

// ── Gmail sender filters ───────────────────────────────────────────────────────

// Daily: bank debit/credit transaction notification senders + required subject
const DAILY_FILTERS = [
  { from: 'bca@bca.co.id',              subject: 'Internet Transaction Journal' },
  { from: 'KartuKreditBCA@klikbca.com', subject: 'Credit Card Transaction Notification' },
  { from: 'jenius_noreply@btpn.com',    subject: 'Credit Card Transaction Notification' },
]

// Monthly: bank e-statement senders + required subject
const MONTHLY_FILTERS = [
  { from: 'eStatement@klikbca.com',           subject: 'Electronic Statement Kartu Kredit BCA' },
  { from: 'estatement@kartukredit.bri.co.id', subject: 'Billing Statement Tokopedia Card' },
  { from: 'jenius_noreply@smbci.com',         subject: 'Billing Statement of Jenius Credit Card' },
  { from: 'uobicard@e-statement.id',          subject: 'Lembar Tagihan Kartu Kredit UOB' },
]

// ── Gmail query builders ───────────────────────────────────────────────────────

// date: optional YYYY-MM-DD; defaults to today
function buildDailyTransactionQuery(date?: string): string {
  const base = date ? dayjs(date, 'YYYY-MM-DD') : dayjs()
  const after = base.format('YYYY/MM/DD')
  const before = base.add(1, 'day').format('YYYY/MM/DD')
  const filters = DAILY_FILTERS.map((f) => `(from:${f.from} subject:"${f.subject}")`).join(' OR ')
  return `{${filters}} after:${after} before:${before}`
}

// month: optional YYYY-MM; defaults to current month
function buildMonthlyTransactionQuery(month?: string): string {
  const base = month ? dayjs(month, 'YYYY-MM').startOf('month') : dayjs().startOf('month')
  const start = base.format('YYYY/MM/DD')
  const end = base.add(1, 'month').format('YYYY/MM/DD')
  const filters = DAILY_FILTERS.map((f) => `(from:${f.from} subject:"${f.subject}")`).join(' OR ')
  return `{${filters}} after:${start} before:${end}`
}

function buildEstatementQuery(): string {
  const start = dayjs().startOf('month').format('YYYY/MM/DD')
  const end = dayjs().add(1, 'month').startOf('month').format('YYYY/MM/DD')
  const filters = MONTHLY_FILTERS.map((f) => `(from:${f.from} subject:"${f.subject}")`).join(' OR ')
  return `{${filters}} after:${start} before:${end}`
}

// ── Bank detection ─────────────────────────────────────────────────────────────

function detectNotificationBank(from: string): 'BCA' | 'JENIUS' | null {
  const f = from.toLowerCase()
  if (f.includes('bca.co.id') || f.includes('klikbca.com')) return 'BCA'
  if (f.includes('btpn.com')) return 'JENIUS'
  return null
}

function detectStatementBank(from: string): 'BCA' | 'JENIUS' | 'UOB' | 'BRI' | null {
  const f = from.toLowerCase()
  if (f.includes('klikbca.com')) return 'BCA'
  if (f.includes('smbci.com')) return 'JENIUS'
  if (f.includes('uobicard')) return 'UOB'
  if (f.includes('kartukredit.bri')) return 'BRI'
  return null
}

// ── Gmail helpers ──────────────────────────────────────────────────────────────

function getOAuthClient(refreshToken: string) {
  const client = new google.auth.OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET)
  client.setCredentials({ refresh_token: refreshToken })
  return client
}

function decodeBase64Url(encoded: string): string {
  return Buffer.from(encoded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
}

type GmailPart = {
  mimeType?: string | null
  filename?: string | null
  body?: { data?: string | null; attachmentId?: string | null } | null
  parts?: GmailPart[] | null
}

function extractBody(payload: GmailPart): string {
  // Only use text/plain if it has meaningful content (>20 chars); otherwise fall through to HTML.
  // Some BCA credit card emails have a single "-" as their text/plain part.
  const plain = findPartByMime(payload, 'text/plain')
  if (plain && plain.trim().length > 20) return plain
  const html = findPartByMime(payload, 'text/html')
  if (html) return stripHtml(html)
  if (plain) return plain  // short plain is better than nothing
  if (payload.body?.data) return decodeBase64Url(payload.body.data)
  return ''
}

function findPartByMime(part: GmailPart, mimeType: string): string | null {
  if (part.mimeType === mimeType && part.body?.data) return decodeBase64Url(part.body.data)
  for (const sub of part.parts ?? []) {
    const found = findPartByMime(sub, mimeType)
    if (found) return found
  }
  return null
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(p|div|td|tr|th|li|h[1-6])[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/ {2,}/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function findPdfPart(payload: GmailPart): { filename: string; attachmentId: string } | null {
  if (
    payload.mimeType === 'application/pdf' &&
    payload.body?.attachmentId &&
    payload.filename
  ) {
    return { filename: payload.filename, attachmentId: payload.body.attachmentId }
  }
  for (const part of payload.parts ?? []) {
    const found = findPdfPart(part)
    if (found) return found
  }
  return null
}

// ── Per-message processors ─────────────────────────────────────────────────────

async function processNotificationMessage(
  gmail: ReturnType<typeof google.gmail>,
  userId: string,
  msgId: string,
  processedKey = `gmail:daily:processed:${userId}`,
): Promise<void> {
  if (await redis.sismember(processedKey, msgId)) {
    logger.debug(`Gmail [${userId}]: ${msgId} already processed — skipping`)
    return
  }

  const full = await gmail.users.messages.get({ userId: 'me', id: msgId, format: 'full' })
  const payload = full.data.payload
  if (!payload) {
    await redis.sadd(processedKey, msgId)
    return
  }

  const headers = payload.headers ?? []
  const subject = headers.find((h) => h.name === 'Subject')?.value ?? ''
  const from = headers.find((h) => h.name === 'From')?.value ?? ''
  const body = extractBody(payload as GmailPart)

  const bankType = detectNotificationBank(from)
  if (!bankType) {
    logger.debug(`Gmail daily [${userId}]: no bank match for "${from}" — skipping ${msgId}`)
    await redis.sadd(processedKey, msgId)
    return
  }

  await enqueueEmailParse({ messageId: msgId, subject, from, body, bankType })
  await redis.sadd(processedKey, msgId)
  logger.info(`Gmail daily [${userId}]: enqueued ${bankType} email (${msgId})`)
}

async function processStatementMessage(
  gmail: ReturnType<typeof google.gmail>,
  userId: string,
  msgId: string,
): Promise<void> {
  const processedKey = `gmail:monthly:processed:${userId}`
  if (await redis.sismember(processedKey, msgId)) return

  const full = await gmail.users.messages.get({ userId: 'me', id: msgId, format: 'full' })
  const payload = full.data.payload
  if (!payload) {
    await redis.sadd(processedKey, msgId)
    return
  }

  const headers = payload.headers ?? []
  const from = headers.find((h) => h.name === 'From')?.value ?? ''
  const internalDate = full.data.internalDate ? parseInt(full.data.internalDate, 10) : Date.now()
  const emailDate = new Date(internalDate)

  const bankType = detectStatementBank(from)
  if (!bankType) {
    logger.debug(`Gmail monthly [${userId}]: no bank match for "${from}" — skipping ${msgId}`)
    await redis.sadd(processedKey, msgId)
    return
  }

  const pdfPart = findPdfPart(payload as GmailPart)
  if (!pdfPart) {
    logger.warn(`Gmail monthly [${userId}]: no PDF attachment in ${msgId} (${bankType})`)
    await redis.sadd(processedKey, msgId)
    return
  }

  const attachRes = await gmail.users.messages.attachments.get({
    userId: 'me',
    messageId: msgId,
    id: pdfPart.attachmentId,
  })
  const data = attachRes.data.data
  if (!data) {
    logger.warn(`Gmail monthly [${userId}]: empty attachment in ${msgId}`)
    await redis.sadd(processedKey, msgId)
    return
  }

  const pdfBuffer = Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64')

  const dir = path.resolve(env.STATEMENTS_DIR)
  await fs.mkdir(dir, { recursive: true })
  const statementMonth = dayjs(emailDate).startOf('month')
  const fileName = `${bankType}_${statementMonth.format('YYYY-MM')}_${msgId}.pdf`
  const filePath = path.join(dir, fileName)
  await fs.writeFile(filePath, pdfBuffer)

  const statement = await createStatement({
    bankType,
    statementMonth: statementMonth.toDate(),
    pdfPath: filePath,
  })

  await enqueuePdfParsing({ statementId: statement.id, pdfPath: filePath, bankType })
  await redis.sadd(processedKey, msgId)
  logger.info(`Gmail monthly [${userId}]: queued ${bankType} statement ${statement.id} (${msgId})`)
}

// ── Per-user sync ──────────────────────────────────────────────────────────────

async function syncUserDailyTransactions(userId: string, refreshToken: string, date?: string): Promise<void> {
  const auth = getOAuthClient(refreshToken)
  const gmail = google.gmail({ version: 'v1', auth })

  const listRes = await gmail.users.messages.list({
    userId: 'me',
    q: buildDailyTransactionQuery(date),
    maxResults: 500
  })

  for (const msg of listRes.data.messages ?? []) {
    try {
      await processNotificationMessage(gmail, userId, msg.id!)
    } catch (err) {
      if (err instanceof AppError) {
        logger.warn(`Gmail daily [${userId}]: skipping ${msg.id} — ${err.message}`)
      } else {
        logger.error(`Gmail daily [${userId}]: error on ${msg.id} — ${err}`)
      }
    }
  }
}

async function syncUserMonthlyTransactions(userId: string, refreshToken: string, month?: string): Promise<void> {
  const auth = getOAuthClient(refreshToken)
  const gmail = google.gmail({ version: 'v1', auth })

  const listRes = await gmail.users.messages.list({
    userId: 'me',
    q: buildMonthlyTransactionQuery(month),
    maxResults: 500,
  })

  const messages = listRes.data.messages ?? []
  logger.info(`Gmail monthly-transactions [${userId}]: found ${messages.length} message(s)`)

  // Use a separate key so daily-processed emails don't block monthly re-sync.
  // Duplicate transactions are prevented at DB level via sourceMessageId dedup.
  const processedKey = `gmail:monthly-tx:processed:${userId}`

  for (const msg of messages) {
    try {
      await processNotificationMessage(gmail, userId, msg.id!, processedKey)
    } catch (err) {
      if (err instanceof AppError) {
        logger.warn(`Gmail monthly-transactions [${userId}]: skipping ${msg.id} — ${err.message}`)
      } else {
        logger.error(`Gmail monthly-transactions [${userId}]: error on ${msg.id} — ${err}`)
      }
    }
  }
}

async function syncUserEstatement(userId: string, refreshToken: string): Promise<void> {
  const auth = getOAuthClient(refreshToken)
  const gmail = google.gmail({ version: 'v1', auth })

  const listRes = await gmail.users.messages.list({
    userId: 'me',
    q: buildEstatementQuery(),
    maxResults: 500
  })

  for (const msg of listRes.data.messages ?? []) {
    try {
      await processStatementMessage(gmail, userId, msg.id!)
    } catch (err) {
      logger.error(`Gmail e-statement [${userId}]: error on ${msg.id} — ${err}`)
    }
  }
}

// ── Cron runners (also exported for manual API trigger) ──────────────────────

// date: optional YYYY-MM-DD; defaults to today
export async function runDailyCronTransaction(date?: string): Promise<void> {
  const users = await prisma.user.findMany({
    where: { gmailRefreshToken: { not: null } },
    select: { id: true, email: true, gmailRefreshToken: true },
  })

  if (users.length === 0) {
    logger.debug('Gmail daily cron: no users with Gmail tokens')
    return
  }

  logger.info(`Gmail daily cron: syncing ${users.length} user(s) — query: ${buildDailyTransactionQuery(date)}`)

  for (const user of users) {
    try {
      await syncUserDailyTransactions(user.id, user.gmailRefreshToken!, date)
    } catch (err) {
      logger.error(`Gmail daily cron: error for ${user.email} — ${err}`)
    }
  }
}

// month: optional YYYY-MM; defaults to current month
export async function runMonthlyTransactionCron(month?: string): Promise<void> {
  const users = await prisma.user.findMany({
    where: { gmailRefreshToken: { not: null } },
    select: { id: true, email: true, gmailRefreshToken: true },
  })

  if (users.length === 0) {
    logger.debug('Gmail monthly-transactions cron: no users with Gmail tokens')
    return
  }

  logger.info(`Gmail monthly-transactions cron: syncing ${users.length} user(s) — query: ${buildMonthlyTransactionQuery(month)}`)

  for (const user of users) {
    try {
      await syncUserMonthlyTransactions(user.id, user.gmailRefreshToken!, month)
    } catch (err) {
      logger.error(`Gmail monthly-transactions cron: error for ${user.email} — ${err}`)
    }
  }
}

export async function runEstatementCron(): Promise<void> {
  const users = await prisma.user.findMany({
    where: { gmailRefreshToken: { not: null } },
    select: { id: true, email: true, gmailRefreshToken: true },
  })

  if (users.length === 0) {
    logger.debug('Gmail e-statement cron: no users with Gmail tokens')
    return
  }

  logger.info(`Gmail e-statement cron: syncing ${users.length} user(s) — query: ${buildEstatementQuery()}`)

  for (const user of users) {
    try {
      await syncUserEstatement(user.id, user.gmailRefreshToken!)
    } catch (err) {
      logger.error(`Gmail e-statement cron: error for ${user.email} — ${err}`)
    }
  }
}

// ── Entry point ────────────────────────────────────────────────────────────────

export function startGmailCron(): void {
  const daily = env.GMAIL_DAILY_SCHEDULE
  const monthly = env.GMAIL_MONTHLY_SCHEDULE

  if (!cron.validate(daily)) {
    logger.error(`Gmail cron: invalid GMAIL_DAILY_SCHEDULE "${daily}" — daily cron disabled`)
    return
  }
  if (!cron.validate(monthly)) {
    logger.error(`Gmail cron: invalid GMAIL_MONTHLY_SCHEDULE "${monthly}" — monthly cron disabled`)
    return
  }

  cron.schedule(daily, () => {
    const url = `http://localhost:${env.PORT}/api/v1/gmail/sync/daily`
    fetch(url, { method: 'POST', headers: { 'x-webhook-secret': env.N8N_WEBHOOK_SECRET } })
      .then((r) => { if (!r.ok) logger.error(`Gmail daily cron: API responded ${r.status}`) })
      .catch((err) => logger.error(`Gmail daily cron: fetch error — ${err}`))
  })

  cron.schedule(monthly, () => {
    const url = `http://localhost:${env.PORT}/api/v1/gmail/sync/monthly`
    fetch(url, { method: 'POST', headers: { 'x-webhook-secret': env.N8N_WEBHOOK_SECRET } })
      .then((r) => { if (!r.ok) logger.error(`Gmail monthly cron: API responded ${r.status}`) })
      .catch((err) => logger.error(`Gmail monthly cron: fetch error — ${err}`))
  })

  logger.info(`Gmail cron started — daily: ${daily} | monthly: ${monthly}`)
}
