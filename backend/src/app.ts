import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env'
import routes from './routes'
import { errorMiddleware, notFoundMiddleware } from './shared/middleware/error.middleware'

const app = express()

// ── Security & parsing ─────────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: env.isDev() ? '*' : process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
}))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Logging ────────────────────────────────────────────────────────────────────
if (!process.env.SILENCE_LOGS) {
  app.use(morgan(env.isDev() ? 'dev' : 'combined'))
}

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))
// ── API routes ─────────────────────────────────────────────────────────────────
app.use('/api/v1', routes)

// ── Error handling ─────────────────────────────────────────────────────────────
app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app
