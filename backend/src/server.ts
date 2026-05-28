import app from './app'
import { env } from './config/env'
import { connectDatabase, disconnectDatabase } from './infrastructure/database/prisma'
import { logger } from './shared/logger'
import { startAiWorker } from './modules/ai/ai.worker'
import { startPdfWorker } from './modules/statements/pdf.worker'
import { startEmailWorker } from './modules/gmail/email.worker'

async function start(): Promise<void> {
  await connectDatabase()
  logger.info('Database connected')

  // Start background workers
  startAiWorker()
  startPdfWorker()
  startEmailWorker()
  logger.info('Background workers started')

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`)
  })

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`)
    server.close(async () => {
      await disconnectDatabase()
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
