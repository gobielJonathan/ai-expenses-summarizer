import { Job } from 'bullmq'
import { createWorker, EmailJobData, enqueueAiCategorization } from '../../infrastructure/queue'
import { parseEmailTransaction } from './email.service'
import { prisma } from '../../infrastructure/database/prisma'
import { logger } from '../../shared/logger'

export function startEmailWorker() {
  return createWorker<EmailJobData>(
    'email-processing',
    async (job: Job<EmailJobData>) => {
      const { messageId, subject, from, body } = job.data

      // Detect bank from sender address
      const bankType = detectBankFromSender(from, subject)
      if (!bankType) {
        logger.warn(`Email worker: unrecognised sender "${from}", skipping job ${job.id}`)
        return
      }

      logger.info(`Processing email ${messageId} from ${bankType}`)

      const parsed = parseEmailTransaction({ messageId, subject, from, body, bankType })

      const transaction = await prisma.transaction.create({
        data: {
          bankType,
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

      logger.info(`Email worker: created transaction ${transaction.id} from ${bankType}`)
    },
  )
}

function detectBankFromSender(from: string, subject: string): 'BCA' | 'JENIUS' | 'UOB' | 'BRI' | null {
  const s = `${from} ${subject}`.toLowerCase()
  if (s.includes('bca') || s.includes('klikbca')) return 'BCA'
  if (s.includes('jenius') || s.includes('btpn')) return 'JENIUS'
  if (s.includes('uob')) return 'UOB'
  if (s.includes('bri') || s.includes('brimo')) return 'BRI'
  return null
}
