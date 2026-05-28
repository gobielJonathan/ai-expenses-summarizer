import { Job } from 'bullmq'
import { createWorker, AiCategorizationJobData } from '../../infrastructure/queue'
import { categorizeTransaction } from './ai.service'
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
