import fs from 'fs/promises'
import path from 'path'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse') as (buf: Buffer) => Promise<{ text: string }>
import dayjs from 'dayjs'
import { Job } from 'bullmq'
import { createWorker, PdfParsingJobData, enqueueAiCategorization } from '../../infrastructure/queue'
import { prisma } from '../../infrastructure/database/prisma'
import { logger } from '../../shared/logger'

interface ParsedTransaction {
  merchant: string
  amount: number
  transactionDate: Date
  paymentType: string
  currency: string
}

// Basic BCA-style parser — extend per-bank as needed
function parseTransactionsFromText(text: string, bankType: string): ParsedTransaction[] {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  const transactions: ParsedTransaction[] = []

  // Pattern: date  description  debit/credit  balance
  const lineRegex = /(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+([\d.,]+)\s*(?:DB|CR)?/

  for (const line of lines) {
    const match = line.match(lineRegex)
    if (!match) continue

    const [, dateStr, description, amountStr] = match
    const date = dayjs(dateStr, 'DD/MM/YYYY')
    if (!date.isValid()) continue

    const amount = parseFloat(amountStr.replace(/\./g, '').replace(',', '.'))
    if (isNaN(amount) || amount <= 0) continue

    transactions.push({
      merchant: description.trim().slice(0, 255),
      amount,
      transactionDate: date.toDate(),
      paymentType: bankType.toLowerCase().includes('credit') ? 'credit_card' : 'debit',
      currency: 'IDR',
    })
  }

  return transactions
}

export function startPdfWorker() {
  return createWorker<PdfParsingJobData>(
    'pdf-parsing',
    async (job: Job<PdfParsingJobData>) => {
      const { statementId, pdfPath, bankType } = job.data
      logger.info(`Parsing PDF for statement ${statementId}`)

      const buffer = await fs.readFile(pdfPath)
      const parsed = await pdfParse(buffer)
      const txs = parseTransactionsFromText(parsed.text, bankType)

      logger.info(`Extracted ${txs.length} transactions from statement ${statementId}`)

      for (const tx of txs) {
        const created = await prisma.transaction.create({
          data: {
            bankType,
            paymentType: tx.paymentType,
            merchant: tx.merchant,
            amount: tx.amount,
            currency: tx.currency,
            transactionDate: tx.transactionDate,
            category: 'Uncategorized',
            subcategory: '',
            statementId,
          },
        })

        await enqueueAiCategorization({
          transactionId: created.id,
          merchant: created.merchant,
          amount: Number(created.amount),
          bankType,
        })
      }

      logger.info(`Statement ${statementId} processing complete`)
    },
  )
}
