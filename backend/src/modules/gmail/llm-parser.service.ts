import { logger } from '../../shared/logger'
import { callLlm } from './llm-router'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface LlmParsedTransaction {
  merchant: string
  amount: number
  transactionDate: string // ISO 8601: YYYY-MM-DDTHH:mm:ss
  paymentType: 'DEBIT' | 'CREDIT'
  currency: string
  category: string
}

// ── Prompt ─────────────────────────────────────────────────────────────────────

function buildPrompt(fields: Record<string, string>, bankHint: string, paymentTypeHint: 'DEBIT' | 'CREDIT'): string {
  return `Categorize this bank transaction.

Bank: ${bankHint}
Payment type: ${paymentTypeHint}
Fields: ${JSON.stringify(fields, null, 2)}

Return ONLY a JSON object with exactly these fields:
{
  "merchant": "<merchant or store name, or Unknown>",
  "amount": <positive number without formatting, e.g. 370000>,
  "transactionDate": "<ISO 8601: YYYY-MM-DDTHH:mm:ss>",
  "paymentType": "${paymentTypeHint}",
  "currency": "IDR",
  "category": "<one of: Food & Beverage, Transportation, Shopping, Entertainment, Health & Beauty, Bills & Utilities, Financial Services, Travel, Education, Other>"
}

Amount rules:
- Indonesian: "Rp370.000" = 370000, "Rp1.500.000,00" = 1500000
- English: "IDR 50,000" = 50000

Date rules:
- "01-05-2026 15:28:14 WIB" → "2026-05-01T15:28:14"
- "27 Mei 2025" → "2025-05-27T00:00:00"
- "27/05/2025 14:23:15" → "2025-05-27T14:23:15"
- If no date found use today's date in ISO format

Merchant rules:
- Use the value from "Payment to", "Merchant / ATM", "Merchant", "Beneficiary Name", or "Keterangan"
- If none found use "Unknown"

Category rules:
- Food & Beverage: restaurants, cafes, food delivery (GrabFood, GoFood, ShopeeFood), supermarkets (Indomaret, Alfamart)
- Transportation: ride-hailing (Grab, Gojek), fuel, parking, toll, airlines
- Shopping: e-commerce (Tokopedia, Shopee, Lazada), retail stores
- Entertainment: streaming (Netflix, Spotify), gaming, cinema
- Health & Beauty: pharmacy (Guardian, Watsons), clinic, hospital, salon
- Bills & Utilities: PLN, PDAM, internet, phone credit (Telkomsel, XL, Indosat)
- Financial Services: bank transfers, insurance, investment
- Travel: hotel, travel agency
- Education: courses, school fees
- Other: anything else`
}

// ── Main ───────────────────────────────────────────────────────────────────────

/**
 * Categorize a transaction using an LLM given pre-extracted email fields.
 * Returns null if the LLM is unavailable or produces invalid output —
 * callers should fall back to the regex parsers in that case.
 *
 * Serial execution is guaranteed by the BullMQ email worker (concurrency=1).
 */
export async function parseEmailWithLlm(
  fields: Record<string, string>,
  bankHint: string,
  isCredit: boolean,
): Promise<LlmParsedTransaction | null> {
  const paymentTypeHint: 'DEBIT' | 'CREDIT' = isCredit ? 'CREDIT' : 'DEBIT'
  const prompt = buildPrompt(fields, bankHint, paymentTypeHint)

  let responseText: string
  try {
    responseText = await callLlm(prompt)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    logger.debug(`LLM email parser: LLM unavailable (${msg}) — using regex fallback`)
    return null
  }

  // Extract JSON object from response (be defensive against extra text)
  const jsonMatch = responseText.trim().match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    logger.warn(`LLM email parser: no JSON in response: "${responseText.slice(0, 200)}" — using regex fallback`)
    return null
  }

  let parsed: Partial<LlmParsedTransaction>
  try {
    parsed = JSON.parse(jsonMatch[0]) as Partial<LlmParsedTransaction>
  } catch {
    logger.warn('LLM email parser: failed to parse JSON from response — using regex fallback')
    return null
  }

  // Validate amount
  const amount = Number(parsed.amount)
  if (!amount || !isFinite(amount) || amount <= 0) {
    logger.warn(`LLM email parser: invalid amount "${parsed.amount}" — using regex fallback`)
    return null
  }

  // Validate date
  const transactionDate = parsed.transactionDate?.trim() ?? ''
  if (!transactionDate || isNaN(Date.parse(transactionDate))) {
    logger.warn(`LLM email parser: invalid date "${transactionDate}" — using regex fallback`)
    return null
  }

  const result: LlmParsedTransaction = {
    merchant: parsed.merchant?.trim() || 'Unknown',
    amount,
    transactionDate,
    paymentType: paymentTypeHint, // always trust the caller's credit/debit signal
    currency: parsed.currency?.trim() || 'IDR',
    category: parsed.category?.trim() || 'Other',
  }

  logger.info(
    `LLM parsed ${bankHint}: merchant="${result.merchant}" amount=${result.amount} date=${result.transactionDate} category="${result.category}"`,
  )
  return result
}
