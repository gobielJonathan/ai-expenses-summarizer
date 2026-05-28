import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { ValidationError } from '../../shared/errors'
import { prisma } from '../../infrastructure/database/prisma'
import { enqueueAiCategorization } from '../../infrastructure/queue'
import { logger } from '../../shared/logger'
import type { EmailWebhookDto } from './email.schema'

dayjs.extend(customParseFormat)

// ── Shared types ───────────────────────────────────────────────────────────────

interface ParsedTransaction {
  merchant: string
  amount: number
  transactionDate: Date
  paymentType: 'DEBIT' | 'CREDIT'
  currency: string
}

// ── Per-bank parsers ───────────────────────────────────────────────────────────

/**
 * BCA Debit notification example:
 *   Jenis Transaksi : Pembayaran
 *   Keterangan      : INDOMARET 0123
 *   Nominal         : Rp 50.000
 *   Tanggal         : 27/05/2025 14:23:15 WIB
 *
 * BCA Credit card notification example:
 *   Merchant        : SHOPEE PAYMENT
 *   Jumlah          : Rp 150.000
 *   Tanggal         : 27 Mei 2025
 */
function parseBca(body: string, subject: string): ParsedTransaction {
  const isCredit = /kartu kredit/i.test(body) || /kartu kredit/i.test(subject)

  // Merchant / Keterangan
  const merchantMatch = body.match(/(?:Keterangan|Merchant)\s*:\s*(.+?)(?:\r?\n|$)/i)
  const merchant = merchantMatch?.[1]?.trim() ?? 'Unknown'

  // Amount — "Rp 50.000" or "Rp50.000,00"
  const amountMatch = body.match(/(?:Nominal|Jumlah)\s*:\s*Rp\s*([\d.,]+)/i)
  if (!amountMatch) throw new ValidationError('BCA: cannot parse amount')
  const amount = parseRupiah(amountMatch[1])

  // Date
  const dateMatch = body.match(/Tanggal\s*:\s*([\d/]+(?:\s+\w+\s+\d{4})?(?:\s[\d:]+(?:\s+WIB)?)?)/i)
  const transactionDate = parseIndonesianDate(dateMatch?.[1]?.trim() ?? '')

  return { merchant, amount, transactionDate, paymentType: isCredit ? 'CREDIT' : 'DEBIT', currency: 'IDR' }
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

  return { merchant, amount, transactionDate, paymentType: isCredit ? 'CREDIT' : 'DEBIT', currency: 'IDR' }
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

  return { merchant, amount, transactionDate, paymentType: isCredit ? 'CREDIT' : 'DEBIT', currency: 'IDR' }
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

  return { merchant, amount, transactionDate, paymentType: isCredit ? 'CREDIT' : 'DEBIT', currency: 'IDR' }
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

  // Normalise Indonesian month names → numbers
  const normalised = raw.toLowerCase().replace(
    /\b(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/g,
    (m) => ID_MONTHS[m] ?? m,
  )

  const formats = [
    'DD/MM/YYYY HH:mm:ss', 'DD/MM/YYYY HH:mm', 'DD/MM/YYYY',
    'DD-MM-YYYY HH:mm:ss', 'DD-MM-YYYY HH:mm', 'DD-MM-YYYY',
    'DD MM YYYY HH:mm', 'DD MM YYYY',
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
    case 'BCA':    return parseBca(dto.body, dto.subject)
    case 'JENIUS': return parseJenius(dto.body)
    case 'UOB':    return parseUob(dto.body)
    case 'BRI':    return parseBri(dto.body, dto.subject)
  }
}

export async function processEmailTransaction(dto: EmailWebhookDto) {
  const parsed = parseEmailTransaction(dto)

  const transaction = await prisma.transaction.create({
    data: {
      bankType: dto.bankType,
      paymentType: parsed.paymentType,
      merchant: parsed.merchant,
      amount: parsed.amount,
      currency: parsed.currency,
      transactionDate: parsed.transactionDate,
      category: 'Uncategorized',
      subcategory: '',
      statementId: null,
    },
  })

  await enqueueAiCategorization({
    transactionId: transaction.id,
    merchant: transaction.merchant,
    amount: Number(transaction.amount),
    bankType: transaction.bankType,
  })

  logger.info(`Email transaction created: ${transaction.id} (${transaction.merchant} – ${transaction.bankType})`)

  return transaction
}
