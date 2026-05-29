import { env } from '../../config/env'
import { logger } from '../../shared/logger'

// ── Ollama client ──────────────────────────────────────────────────────────────

interface OllamaGenerateResponse {
  model: string
  response: string
  done: boolean
}

/**
 * Call Ollama /api/generate and return the response text.
 * @param prompt  The prompt string to send
 * @param json    If true, sends format:"json" so the model returns valid JSON
 */
async function callOllama(prompt: string, json: boolean): Promise<string> {
  const res = await fetch(`${env.OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: env.OLLAMA_MODEL,
      prompt,
      stream: false,
      ...(json ? { format: 'json' } : {}),
      options: { temperature: 0, num_predict: 512 },
    }),
    signal: AbortSignal.timeout(45_000),
  })

  if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`)
  const data = await res.json() as OllamaGenerateResponse
  if (!data.done || !data.response) throw new Error('Incomplete Ollama response')
  return data.response.trim()
}

// ── Types ──────────────────────────────────────────────────────────────────────

export interface CategoryResult {
  category: string
  subcategory: string
  confidence: number
}

export interface BatchTransactionInput {
  merchant: string
  bankType: string
  amount: number
}

// ── Prompts ────────────────────────────────────────────────────────────────────

const CATEGORIES = 'Food & Beverage, Transportation, Shopping, Entertainment, Health & Beauty, Bills & Utilities, Financial Services, Travel, Education, Other'

const CATEGORY_PROMPT = `You are a financial transaction categorizer. Given a merchant name and transaction details, return a JSON object with "category", "subcategory", and "confidence" (0-1).

Categories: ${CATEGORIES}

Merchant: {merchant}
Bank: {bankType}
Amount: {amount}

Return only valid JSON like: {"category": "Food & Beverage", "subcategory": "Restaurant", "confidence": 0.9}`

const BATCH_CATEGORY_PROMPT = `You are a financial transaction categorizer. Given a list of transactions, return a JSON array where each element has "category", "subcategory", and "confidence" (0-1).

Categories: ${CATEGORIES}

Transactions:
{transactions}

Return ONLY a valid JSON array with exactly {count} objects in the same order as the input, like:
[{"category": "Food & Beverage", "subcategory": "Restaurant", "confidence": 0.9}, ...]`

// ── Exported functions ─────────────────────────────────────────────────────────

export async function categorizeTransaction(
  merchant: string,
  bankType: string,
  amount: number,
): Promise<CategoryResult> {
  try {
    const prompt = CATEGORY_PROMPT
      .replace('{merchant}', merchant)
      .replace('{bankType}', bankType)
      .replace('{amount}', String(amount))

    const text = await callOllama(prompt, true)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON object in response')

    return JSON.parse(jsonMatch[0]) as CategoryResult
  } catch (err) {
    logger.warn(`AI categorization failed for merchant "${merchant}"`, err)
    return { category: 'Other', subcategory: 'Uncategorized', confidence: 0 }
  }
}

export async function categorizeBatch(
  transactions: BatchTransactionInput[],
): Promise<CategoryResult[]> {
  if (transactions.length === 0) return []
  try {
    const txList = transactions
      .map((t, i) => `${i + 1}. Merchant: ${t.merchant}, Bank: ${t.bankType}, Amount: ${t.amount}`)
      .join('\n')

    const prompt = BATCH_CATEGORY_PROMPT
      .replace('{transactions}', txList)
      .replace('{count}', String(transactions.length))

    const text = await callOllama(prompt, true)
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) throw new Error('No JSON array in response')

    const results = JSON.parse(jsonMatch[0]) as CategoryResult[]
    if (!Array.isArray(results) || results.length !== transactions.length) {
      throw new Error(`Expected ${transactions.length} results, got ${results.length}`)
    }
    return results
  } catch (err) {
    logger.warn(`AI batch categorization failed for ${transactions.length} transactions`, err)
    return transactions.map(() => ({ category: 'Other', subcategory: 'Uncategorized', confidence: 0 }))
  }
}

export async function summarizeSpending(
  transactions: { merchant: string; amount: number; category: string; transactionDate: Date }[],
): Promise<string> {
  try {
    const summary = transactions
      .map((t) => `${t.transactionDate.toISOString().split('T')[0]}: ${t.merchant} - ${t.amount} (${t.category})`)
      .join('\n')

    const prompt = `Analyze these financial transactions and provide a brief, actionable spending summary in 2-3 sentences. Focus on patterns, top spending categories, and any notable insights.

Transactions:
${summary}`

    return await callOllama(prompt, false)
  } catch (err) {
    logger.warn('AI spending summary failed', err)
    return 'Unable to generate AI summary at this time.'
  }
}
