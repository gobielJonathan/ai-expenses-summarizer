import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { ValidationError } from '../../shared/errors'
import { prisma } from '../../infrastructure/database/prisma'
import { enqueueAiCategorization } from '../../infrastructure/queue'
import { logger } from '../../shared/logger'
import { parseEmailWithLlm } from './llm-parser.service'
import { extractEmailFields } from './email-fields.extractor'
import type { EmailWebhookDto } from './email.schema'

dayjs.extend(customParseFormat)

// ── Shared types ───────────────────────────────────────────────────────────────

interface ParsedTransaction {
  merchant: string
  amount: number
  transactionDate: Date
  paymentType: 'DEBIT' | 'CREDIT'
  currency: string
  category: string
}

// ── Per-bank parsers ───────────────────────────────────────────────────────────

/**
 * BCA Debit notification — multiple email formats observed:
 *   Format A (new):
 *     Nilai Transaksi : Rp50.000
 *     Nama Merchant   : INDOMARET 0123
 *     Tanggal         : 27/05/2025 14:23:15 WIB
 *   Format B (old):
 *     Nominal         : Rp 50.000
 *     Keterangan      : INDOMARET 0123
 *     Tanggal         : 27/05/2025 14:23:15 WIB
 *   BCA Credit card:
 *     Jumlah Transaksi : Rp 150.000
 *     Merchant         : SHOPEE PAYMENT
 *     Tanggal          : 27 Mei 2025
 */
function parseBca(body: string, subject: string, from: string): ParsedTransaction {
  // Use sender address as the definitive signal — body may contain "credit card" in footers on debit emails
  const isCredit = /klikbca\.com/i.test(from)
    || /kartu kredit/i.test(subject)
    || /credit card/i.test(subject)

  // ── English myBCA format (QRIS / Internet Transaction Journal / Transfer / Top Up) ──
  // HTML table strips to: "LABEL\n\n\n: \n\n\nIDR X"
  // Amount labels seen: "Total Payment", "Total Amount", "Transfer Amount", "Top Up Amount", "Amount"
  const enAmountMatch = body.match(
    /(?:Total\s+(?:Payment|Amount)|Transfer\s+Amount|Top\s+Up\s+Amount|(?<![A-Za-z])Amount)\s+:\s+IDR\s+([\d,]+(?:\.\d+)?)/i,
  )
  if (enAmountMatch) {
    const amount = parseFloat(enAmountMatch[1].replace(/,/g, ''))
    const merchantMatch = body.match(/(?:Payment\s+to|Beneficiary\s+Name|Transfer\s+to\s+[^\n]+Account)\s+:\s+(.+?)(?:\r?\n|$)/i)
    const transferTypeMatch = body.match(/Transfer\s+Type\s+:\s+(.+?)(?:\r?\n|$)/i)
    const merchant = merchantMatch?.[1]?.trim() ?? transferTypeMatch?.[1]?.trim() ?? 'Unknown'
    const dateMatch = body.match(/Transaction\s+Date\s+:\s+(.+?)(?:\r?\n|$)/i)
    const transactionDate = parseIndonesianDate(dateMatch?.[1]?.trim() ?? '')
    return { merchant, amount, transactionDate, paymentType: isCredit ? 'CREDIT' : 'DEBIT', currency: 'IDR', category: 'Uncategorized' }
  }

  // ── Indonesian format ──
  // Labels: "Nama Merchant / Keterangan", "Nilai Transaksi / Nominal / Sejumlah", "Tanggal / Pada Tanggal"
  // Note: BCA credit card emails use multi-line format: LABEL\n:\nVALUE
  const merchantMatch = body.match(
    /(?:Nama Merchant|Keterangan|Merchant\s*\/\s*ATM|Merchant|Nama Toko)\s*:\s*(.+?)(?:\r?\n|$)/i,
  ) ?? body.match(
    /(?:Nama Merchant|Keterangan|Merchant\s*\/\s*ATM|Merchant|Nama Toko)\r?\n\s*:\s*\r?\n(.+?)(?:\r?\n|$)/i,
  )
  const merchant = merchantMatch?.[1]?.trim() ?? 'Unknown'

  const amountMatch = body.match(
    /(?:Nilai Transaksi|Jumlah Transaksi|Sejumlah|Nominal|Jumlah)\s*:\s*Rp\s*([\d.,]+)/i,
  ) ?? body.match(
    /(?:Nilai Transaksi|Jumlah Transaksi|Sejumlah|Nominal|Jumlah)\r?\n\s*:\s*\r?\nRp\s*([\d.,]+)/i,
  )
  if (!amountMatch) {
    logger.warn(`BCA parser — cannot parse amount. Subject: "${subject}" | body length: ${body.length} | body:\n${body.slice(0, 600)}`)
    throw new ValidationError('BCA: cannot parse amount')
  }
  const amount = parseRupiah(amountMatch[1])

  // Date: handles "Tanggal : DD/MM/YYYY", "Pada Tanggal\n:\nDD-MM-YYYY HH:mm:ss WIB", and "Tanggal : 27 Mei 2025"
  const datePattern = /([\d][\d/\-]+(?:\s+\w+\s+\d{4})?(?:\s[\d:]+(?:\s+WIB)?)?)/i
  const dateMatch = body.match(new RegExp(`(?:Pada\\s+)?Tanggal\\s*:\\s*${datePattern.source}`, 'i'))
    ?? body.match(new RegExp(`(?:Pada\\s+)?Tanggal\\r?\\n\\s*:\\s*\\r?\\n${datePattern.source}`, 'i'))
  const transactionDate = parseIndonesianDate(dateMatch?.[1]?.trim() ?? '')

  return { merchant, amount, transactionDate, paymentType: isCredit ? 'CREDIT' : 'DEBIT', currency: 'IDR', category: 'Uncategorized' }
}

/**
 * Jenius (BTPN) notification example:
 *   Merchant: GrabFood
 *   Jumlah: Rp 45.000
 *   Waktu: 27 May 2025 14:30
 *   Tipe: Debit
 */
function parseJenius(body: string): ParsedTransaction {
  const merchantMatch = body.match(/Merchant:\s*(.+?)(?:\r?\n|$)/i)
  const merchant = merchantMatch?.[1]?.trim() ?? 'Unknown'

  const amountMatch = body.match(/Jumlah:\s*Rp\s*([\d.,]+)/i)
  if (!amountMatch) throw new ValidationError('Jenius: cannot parse amount')
  const amount = parseRupiah(amountMatch[1])

  const dateMatch = body.match(/Waktu:\s*(.+?)(?:\r?\n|$)/i)
  const transactionDate = parseIndonesianDate(dateMatch?.[1]?.trim() ?? '')

  const isCredit = /kredit|credit/i.test(body)

  return { merchant, amount, transactionDate, paymentType: isCredit ? 'CREDIT' : 'DEBIT', currency: 'IDR', category: 'Uncategorized' }
}

/**
 * UOB notification example:
 *   Date: 27/05/2025
 *   Merchant: GRAB* TRANSPORT
 *   Amount: IDR 25,000
 *   Transaction Type: Purchase
 */
function parseUob(body: string): ParsedTransaction {
  const merchantMatch = body.match(/Merchant:\s*(.+?)(?:\r?\n|$)/i)
  const merchant = merchantMatch?.[1]?.trim() ?? 'Unknown'

  const amountMatch = body.match(/Amount:\s*IDR\s*([\d,]+)/i)
  if (!amountMatch) throw new ValidationError('UOB: cannot parse amount')
  const amount = parseFloat(amountMatch[1].replace(/,/g, ''))

  const dateMatch = body.match(/Date:\s*([\d/]+)/i)
  const transactionDate = parseIndonesianDate(dateMatch?.[1]?.trim() ?? '')

  const isCredit = /credit card|credit/i.test(body)

  return { merchant, amount, transactionDate, paymentType: isCredit ? 'CREDIT' : 'DEBIT', currency: 'IDR', category: 'Uncategorized' }
}

/**
 * BRI notification example:
 *   Tgl: 27-05-2025 14:25:30
 *   Berita: TRANSFER KE TOKO ALFAMART
 *   Nominal: Rp50.000,00
 */
function parseBri(body: string, subject: string): ParsedTransaction {
  const merchantMatch = body.match(/(?:Berita|Keterangan):\s*(.+?)(?:\r?\n|$)/i)
  const merchant = merchantMatch?.[1]?.trim() ?? 'Unknown'

  const amountMatch = body.match(/(?:Nominal|Jumlah):\s*Rp\s*([\d.,]+)/i)
  if (!amountMatch) throw new ValidationError('BRI: cannot parse amount')
  const amount = parseRupiah(amountMatch[1])

  const dateMatch = body.match(/Tgl:\s*([\d\-/]+(?:\s[\d:]+)?)/i)
  const transactionDate = parseIndonesianDate(dateMatch?.[1]?.trim() ?? '')

  const isCredit = /kredit|credit card/i.test(body) || /kredit|credit card/i.test(subject)

  return { merchant, amount, transactionDate, paymentType: isCredit ? 'CREDIT' : 'DEBIT', currency: 'IDR', category: 'Uncategorized' }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const ID_MONTHS: Record<string, string> = {
  januari: '01', februari: '02', maret: '03', april: '04',
  mei: '05', juni: '06', juli: '07', agustus: '08',
  september: '09', oktober: '10', november: '11', desember: '12',
  jan: '01', feb: '02', mar: '03', apr: '04',
  may: '05', jun: '06', jul: '07', aug: '08',
  sep: '09', oct: '10', nov: '11', dec: '12',
}

function parseIndonesianDate(raw: string): Date {
  if (!raw) return new Date()

  // Normalise Indonesian month names → numbers; strip timezone labels
  const normalised = raw.toLowerCase()
    .replace(/\s+(?:wib|wita|wit)\s*$/, '')
    .replace(
    /\b(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/g,
    (m) => ID_MONTHS[m] ?? m,
  )

  const formats = [
    'DD/MM/YYYY HH:mm:ss', 'DD/MM/YYYY HH:mm', 'DD/MM/YYYY',
    'DD-MM-YYYY HH:mm:ss', 'DD-MM-YYYY HH:mm', 'DD-MM-YYYY',
    'DD MM YYYY HH:mm:ss', 'DD MM YYYY HH:mm', 'DD MM YYYY',
    'YYYY-MM-DD',
  ]

  for (const fmt of formats) {
    const d = dayjs(normalised.trim(), fmt, true)
    if (d.isValid()) return d.toDate()
  }

  logger.warn(`Could not parse date: "${raw}" — falling back to now`)
  return new Date()
}

/** Convert "50.000,00" or "50,000.00" → number */
function parseRupiah(raw: string): number {
  // Indonesian format: dots as thousands, comma as decimal
  const cleaned = raw.replace(/\./g, '').replace(',', '.')
  const value = parseFloat(cleaned)
  if (isNaN(value) || value <= 0) throw new ValidationError(`Cannot parse amount: ${raw}`)
  return value
}

// ── Main service functions ─────────────────────────────────────────────────────

export function parseEmailTransaction(dto: EmailWebhookDto): ParsedTransaction {
  switch (dto.bankType) {
    case 'BCA':    return parseBca(dto.body, dto.subject, dto.from)
    case 'JENIUS': return parseJenius(dto.body)
    case 'UOB':    return parseUob(dto.body)
    case 'BRI':    return parseBri(dto.body, dto.subject)
  }
}

/** Determine CREDIT vs DEBIT from email metadata before body parsing */
function detectIsCredit(dto: EmailWebhookDto): boolean {
  if (dto.bankType === 'BCA') {
    return /klikbca\.com/i.test(dto.from)
      || /kartu kredit/i.test(dto.subject)
      || /credit card/i.test(dto.subject)
  }
  return false
}

export async function processEmailTransaction(dto: EmailWebhookDto) {
  // Dedup: skip if this message was already processed
  if (dto.messageId) {
    const existing = await prisma.transaction.findFirst({
      where: { sourceMessageId: dto.messageId },
      select: { id: true },
    })
    if (existing) {
      logger.debug(`Email transaction already exists for messageId ${dto.messageId} — skipping`)
      return existing
    }
  }

  // 1. Extract compact fields and try LLM parser — falls back to null if unavailable
  const isCredit = detectIsCredit(dto)
  const fields = extractEmailFields(dto)
  logger.debug(`Email fields extracted for ${dto.bankType}: ${JSON.stringify(fields)}`)
  const llmResult = await parseEmailWithLlm(fields, dto.bankType, isCredit)

  let parsed: ParsedTransaction
  if (llmResult) {
    parsed = {
      merchant: llmResult.merchant,
      amount: llmResult.amount,
      transactionDate: new Date(llmResult.transactionDate),
      paymentType: llmResult.paymentType,
      currency: llmResult.currency,
      category: llmResult.category,
    }
  } else {
    // 2. Fallback: per-bank regex parsers
    logger.debug(`LLM parser returned null for ${dto.bankType} — using regex fallback`)
    parsed = parseEmailTransaction(dto)
  }

  const transaction = await prisma.transaction.create({
    data: {
      bankType: dto.bankType,
      paymentType: parsed.paymentType,
      merchant: parsed.merchant,
      amount: parsed.amount,
      currency: parsed.currency,
      transactionDate: parsed.transactionDate,
      category: parsed.category,
      subcategory: '',
      statementId: null,
      sourceMessageId: dto.messageId ?? null,
    },
  })

  logger.info(`Email transaction created: ${transaction.id} (${transaction.merchant} – ${transaction.bankType})`)

  return transaction
}
