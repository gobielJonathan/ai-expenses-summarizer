import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../../config/env'
import { logger } from '../../shared/logger'

let genAI: GoogleGenerativeAI | null = null

function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    if (!env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured')
    genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
  }
  return genAI
}

export interface CategoryResult {
  category: string
  subcategory: string
  confidence: number
}

const CATEGORY_PROMPT = `You are a financial transaction categorizer. Given a merchant name and transaction details, 
return a JSON object with "category", "subcategory", and "confidence" (0-1).

Categories: Food & Beverage, Transportation, Shopping, Entertainment, Health & Beauty, 
Bills & Utilities, Financial Services, Travel, Education, Other

Merchant: {merchant}
Bank: {bankType}
Amount: {amount}

Return only valid JSON like: {"category": "Food & Beverage", "subcategory": "Restaurant", "confidence": 0.9}`

export async function categorizeTransaction(
  merchant: string,
  bankType: string,
  amount: number,
): Promise<CategoryResult> {
  try {
    const client = getClient()
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = CATEGORY_PROMPT
      .replace('{merchant}', merchant)
      .replace('{bankType}', bankType)
      .replace('{amount}', String(amount))

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in AI response')

    return JSON.parse(jsonMatch[0]) as CategoryResult
  } catch (err) {
    logger.warn(`AI categorization failed for merchant "${merchant}"`, err)
    return { category: 'Other', subcategory: 'Uncategorized', confidence: 0 }
  }
}

export async function summarizeSpending(
  transactions: { merchant: string; amount: number; category: string; transactionDate: Date }[],
): Promise<string> {
  try {
    const client = getClient()
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const summary = transactions
      .map((t) => `${t.transactionDate.toISOString().split('T')[0]}: ${t.merchant} - ${t.amount} (${t.category})`)
      .join('\n')

    const prompt = `Analyze these financial transactions and provide a brief, actionable spending summary in 2-3 sentences. 
Focus on patterns, top spending categories, and any notable insights.

Transactions:
${summary}`

    const result = await model.generateContent(prompt)
    return result.response.text().trim()
  } catch (err) {
    logger.warn('AI spending summary failed', err)
    return 'Unable to generate AI summary at this time.'
  }
}
