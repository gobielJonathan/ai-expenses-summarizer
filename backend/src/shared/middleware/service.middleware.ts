import { Request, Response, NextFunction } from 'express'
import { env } from '../../config/env'
import { UnauthorizedError } from '../errors'

/**
 * Service-to-service authentication middleware for n8n automation workflows.
 * Validates the X-API-Key header against the configured N8N_API_KEY.
 */
export function serviceMiddleware(req: Request, _res: Response, next: NextFunction): void {
  if (!env.N8N_API_KEY) {
    return next(new UnauthorizedError('Service API key not configured on this server'))
  }

  const apiKey = req.headers['x-api-key']
  if (!apiKey || apiKey !== env.N8N_API_KEY) {
    return next(new UnauthorizedError('Invalid or missing X-API-Key header'))
  }

  next()
}
