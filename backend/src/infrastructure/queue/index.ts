import { Queue, Worker, Job } from 'bullmq'
import { env } from '../../config/env'
import { logger } from '../../shared/logger'

const connection = { url: env.REDIS_URL }

// ── Queue names ────────────────────────────────────────────────────────────────
export const QUEUE_NAMES = {
  EMAIL_PROCESSING: 'email-processing',
  AI_CATEGORIZATION: 'ai-categorization',
  PDF_PARSING: 'pdf-parsing',
} as const

// ── Queue instances ────────────────────────────────────────────────────────────
export const emailQueue = new Queue(QUEUE_NAMES.EMAIL_PROCESSING, { connection })
export const aiQueue = new Queue(QUEUE_NAMES.AI_CATEGORIZATION, { connection })
export const pdfQueue = new Queue(QUEUE_NAMES.PDF_PARSING, { connection })

// ── Job types ──────────────────────────────────────────────────────────────────
export interface EmailJobData {
  messageId: string
  subject: string
  from: string
  body: string
  attachments?: string[]
}

export interface AiCategorizationJobData {
  transactionId: string
  merchant: string
  amount: number
  bankType: string
}

export interface PdfParsingJobData {
  statementId: string
  pdfPath: string
  bankType: string
}

// ── Helper to add jobs ─────────────────────────────────────────────────────────
export async function enqueueEmail(data: EmailJobData): Promise<void> {
  await emailQueue.add('process-email', data, { attempts: 3, backoff: { type: 'exponential', delay: 2000 } })
}

export async function enqueueAiCategorization(data: AiCategorizationJobData): Promise<void> {
  await aiQueue.add('categorize', data, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } })
}

export async function enqueuePdfParsing(data: PdfParsingJobData): Promise<void> {
  await pdfQueue.add('parse-pdf', data, { attempts: 3, backoff: { type: 'exponential', delay: 2000 } })
}

// ── Generic worker factory ─────────────────────────────────────────────────────
export function createWorker<T>(
  queueName: string,
  processor: (job: Job<T>) => Promise<void>,
): Worker<T> {
  const worker = new Worker<T>(queueName, processor, { connection })
  worker.on('completed', (job) => logger.info(`Job ${job.id} completed [${queueName}]`))
  worker.on('failed', (job, err) => logger.error(`Job ${job?.id} failed [${queueName}]`, err))
  return worker
}
