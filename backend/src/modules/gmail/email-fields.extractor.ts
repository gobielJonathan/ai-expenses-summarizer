import type { EmailWebhookDto } from './email.schema'

/**
 * Extracts only the fields relevant for LLM categorization from an email body.
 * Returns a compact Record<string, string> instead of the full raw body,
 * reducing token usage and improving LLM accuracy.
 */

function pick(body: string, patterns: Array<[string, RegExp]>): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, re] of patterns) {
    const m = body.match(re)
    if (m?.[1]?.trim()) result[key] = m[1].trim()
  }
  return result
}

/** BCA Debit — myBCA English format or Indonesian format */
function extractBcaDebit(body: string): Record<string, string> {
  // English myBCA format
  const enFields = pick(body, [
    ['Transaction Type', /Transaction\s+Type\s+:\s+(.+?)(?:\r?\n|$)/i],
    ['Payment to', /(?:Payment\s+to|Beneficiary\s+Name)\s+:\s+(.+?)(?:\r?\n|$)/i],
    ['Acquirer', /Acquirer\s+:\s+(.+?)(?:\r?\n|$)/i],
    ['Total Payment', /(?:Total\s+(?:Payment|Amount)|Transfer\s+Amount)\s+:\s+(IDR\s*[\d,]+(?:\.\d+)?)/i],
    ['Top Up Amount', /Top\s+Up\s+Amount\s+:\s+(IDR\s*[\d,]+(?:\.\d+)?)/i],
    ['Transaction Date', /Transaction\s+Date\s+:\s+(.+?)(?:\r?\n|$)/i],
  ])
  if (Object.keys(enFields).length > 0) return enFields

  // Indonesian format
  return pick(body, [
    ['Transaction Type', /(?:Jenis\s+Transaksi|Transaction\s+Type)\s*:\s*(.+?)(?:\r?\n|$)/i],
    ['Merchant', /(?:Nama Merchant|Keterangan|Nama Toko)\s*:\s*(.+?)(?:\r?\n|$)/i],
    ['Amount', /(?:Nilai Transaksi|Nominal|Jumlah)\s*:\s*(Rp\s*[\d.,]+)/i],
    ['Date', /(?:Pada\s+)?Tanggal\s*:\s*([\d][\d/\-]+(?:\s+\w+\s+\d{4})?(?:\s[\d:]+(?:\s+WIB)?)?)/i],
  ])
}

/** BCA Credit — klikbca.com format */
function extractBcaCredit(body: string): Record<string, string> {
  return pick(body, [
    ['Merchant / ATM', /(?:Merchant\s*\/\s*ATM|Merchant|Nama Merchant)\s*:?\s*\r?\n?\s*(.+?)(?:\r?\n|$)/i],
    ['Sejumlah', /(?:Sejumlah|Jumlah Transaksi)\s*:?\s*\r?\n?\s*(Rp\s*[\d.,]+)/i],
    ['Date', /(?:Tanggal|Transaction Date)\s*:?\s*\r?\n?\s*([\d][\d/\-]+(?:\s+\w+\s+\d{4})?)/i],
  ])
}

/** BRI — body structure is too variable; pass the full body */
function extractBri(body: string): Record<string, string> {
  return { body }
}

/** Jenius (BTPN) */
function extractJenius(body: string): Record<string, string> {
  return pick(body, [
    ['Merchant', /Merchant:\s*(.+?)(?:\r?\n|$)/i],
    ['Total', /(?:Jumlah|Total):\s*(Rp\s*[\d.,]+)/i],
    ['Date', /Waktu:\s*(.+?)(?:\r?\n|$)/i],
  ])
}

/** UOB */
function extractUob(body: string): Record<string, string> {
  return pick(body, [
    ['Merchant', /Merchant:\s*(.+?)(?:\r?\n|$)/i],
    ['Amount', /Amount:\s*(IDR\s*[\d,]+)/i],
    ['Transaction Type', /Transaction\s+Type:\s*(.+?)(?:\r?\n|$)/i],
    ['Date', /Date:\s*([\d/]+)/i],
  ])
}

/**
 * Route to the correct extractor based on bankType and sender.
 * Falls back to a 500-char body slice for unknown formats.
 */
export function extractEmailFields(dto: EmailWebhookDto): Record<string, string> {
  switch (dto.bankType) {
    case 'BCA': {
      const isBcaCredit = /klikbca\.com/i.test(dto.from)
        || /kartu kredit/i.test(dto.subject)
        || /credit card/i.test(dto.subject)
      return isBcaCredit ? extractBcaCredit(dto.body) : extractBcaDebit(dto.body)
    }
    case 'JENIUS':
      return extractJenius(dto.body)
    case 'UOB':
      return extractUob(dto.body)
    case 'BRI':
      return extractBri(dto.body)
    default:
      return { body: dto.body.slice(0, 500) }
  }
}
