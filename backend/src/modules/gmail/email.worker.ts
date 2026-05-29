import { Job, Worker } from 'bullmq'
import { emailQueue, EmailParseJobData } from '../../infrastructure/queue'
import { processEmailTransaction } from './email.service'
import { logger } from '../../shared/logger'

const connection = emailQueue.opts.connection as { url: string }

export function startEmailWorker(): Worker {
  const worker = new Worker<EmailParseJobData>(
    'email-processing',
    async (job: Job<EmailParseJobData>) => {
      logger.info(`Email worker: processing ${job.data.messageId} (${job.data.bankType})`)
      await processEmailTransaction(job.data)
    },
    // concurrency=1 serialises Ollama calls — replaces the in-process semaphore
    { connection, concurrency: 1 },
  )

  worker.on('completed', (job) => logger.info(`Email job ${job.id} completed`))
  worker.on('failed', (job, err) => logger.error(`Email job ${job?.id} failed`, err))

  return worker
}
