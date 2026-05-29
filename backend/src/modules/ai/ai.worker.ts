import { Job } from 'bullmq'
import { createWorker, AiCategorizationJobData, AiBatchCategorizationJobData } from '../../infrastructure/queue'
import { categorizeTransaction, categorizeBatch } from './ai.service'
import { prisma } from '../../infrastructure/database/prisma'
import { logger } from '../../shared/logger'

export function startAiWorker() {
  return createWorker<AiCategorizationJobData>(
    'ai-categorization',
    async (job: Job<AiCategorizationJobData>) => {
      const { transactionId, merchant, amount, bankType } = job.data
      logger.info(`Categorizing transaction ${transactionId}`)

      const result = await categorizeTransaction(merchant, bankType, amount)

      await prisma.transaction.update({
        where: { id: transactionId },
        data: { category: result.category, subcategory: result.subcategory },
      })

      logger.info(`Transaction ${transactionId} categorized as ${result.category}/${result.subcategory}`)
    },
  )
}

export function startAiBatchWorker() {
  return createWorker<AiBatchCategorizationJobData>(
    'ai-batch-categorization',
    async (job: Job<AiBatchCategorizationJobData>) => {
      const { transactions } = job.data
      logger.info(`Batch categorizing ${transactions.length} transactions`)

      const inputs = transactions.map((t) => ({ merchant: t.merchant, bankType: t.bankType, amount: t.amount }))
      const results = await categorizeBatch(inputs)

      await prisma.$transaction(
        transactions.map((t, i) =>
          prisma.transaction.update({
            where: { id: t.transactionId },
            data: { category: results[i].category, subcategory: results[i].subcategory },
          }),
        ),
      )

      logger.info(`Batch categorization complete: ${transactions.length} transactions updated`)
    },
  )
}
