import app from './app'
import { env } from './config/env'
import { connectDatabase, disconnectDatabase } from './infrastructure/database/prisma'
import { connectRedis, disconnectRedis } from './infrastructure/redis/client'
import { logger } from './shared/logger'
import { startAiWorker, startAiBatchWorker } from './modules/ai/ai.worker'
import { startPdfWorker } from './modules/statements/pdf.worker'
import { startEmailWorker } from './modules/gmail/email.worker'
import { startGmailCron } from './modules/gmail/gmail.cron'

async function start(): Promise<void> {
  await connectDatabase()
  logger.info('Database connected')

  await connectRedis()
  logger.info('Redis connected')

  // Start background workers
  startAiWorker()
  startAiBatchWorker()
  startPdfWorker()
  startEmailWorker()
  startGmailCron()
  logger.info('Background workers started')

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`)
  })

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`)
    server.close(async () => {
      await disconnectDatabase()
      await disconnectRedis()
      logger.info('Server shut down cleanly')
      process.exit(0)
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
