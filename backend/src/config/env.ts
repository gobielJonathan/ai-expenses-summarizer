import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

function requireEnv(key: string): string {
  const val = process.env[key]
  if (!val) throw new Error(`Missing required environment variable: ${key}`)
  return val
}

export const env = {
  NODE_ENV: (process.env.NODE_ENV ?? 'development') as 'development' | 'production' | 'test',
  PORT: parseInt(process.env.PORT ?? '3000', 10),
  DATABASE_URL: requireEnv('DATABASE_URL'),
  REDIS_URL: process.env.REDIS_URL ?? 'redis://localhost:6379',
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
  GOOGLE_CLIENT_ID: requireEnv('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: requireEnv('GOOGLE_CLIENT_SECRET'),
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI ?? 'http://localhost:3000/api/v1/auth/google/callback',
  FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  STATEMENTS_DIR: process.env.STATEMENTS_DIR ?? './storage/statements',
  N8N_API_KEY: process.env.N8N_API_KEY ?? '',
  N8N_WEBHOOK_SECRET: process.env.N8N_WEBHOOK_SECRET ?? '',
  GMAIL_DAILY_SCHEDULE: process.env.GMAIL_DAILY_SCHEDULE ?? '*/5 * * * *',
  GMAIL_MONTHLY_SCHEDULE: process.env.GMAIL_MONTHLY_SCHEDULE ?? '0 8 * * *',
  OLLAMA_URL: process.env.OLLAMA_URL ?? 'http://localhost:11434',
  OLLAMA_MODEL: process.env.OLLAMA_MODEL ?? 'llama3.2:3b',
  OPEN_ROUTER_API_KEY: process.env.OPEN_ROUTER_API_KEY ?? '',
  isDev: () => env.NODE_ENV === 'development',
  isProd: () => env.NODE_ENV === 'production',
}
