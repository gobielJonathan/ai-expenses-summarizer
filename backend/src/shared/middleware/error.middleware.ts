import { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors'
import { logger } from '../logger'
import { env } from '../../config/env'

export function errorMiddleware(
  err: Error | AppError | { statusCode?: number; message: string; code?: string },
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = (err as AppError).statusCode ?? 500
  const message = err.message ?? 'Internal Server Error'
  const code = (err as AppError).code ?? 'INTERNAL_ERROR'

  if (statusCode >= 500) {
    logger.error(message, err)
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    code,
    ...(env.isDev() && statusCode >= 500 ? { stack: (err as Error).stack } : {}),
  })
}

export function notFoundMiddleware(_req: Request, res: Response): void {
  res.status(404).json({ success: false, error: 'Route not found', code: 'NOT_FOUND' })
}
