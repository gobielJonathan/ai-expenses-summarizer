import { Router, Request, Response, NextFunction } from 'express'
import { webhookController } from './email.controller'
import { validate } from '../../shared/middleware/validate.middleware'
import { emailWebhookSchema } from './email.schema'
import { UnauthorizedError } from '../../shared/errors'
import { env } from '../../config/env'

const router = Router()

/** Verify shared secret sent by n8n in X-Webhook-Secret header */
function webhookSecretMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const secret = env.N8N_WEBHOOK_SECRET
  if (!secret) {
    // Secret not configured — reject all requests in production, allow in dev
    if (env.isProd()) {
      next(new UnauthorizedError('Webhook secret not configured'))
      return
    }
    next()
    return
  }
  if (req.headers['x-webhook-secret'] !== secret) {
    next(new UnauthorizedError('Invalid webhook secret'))
    return
  }
  next()
}

router.post('/webhook', webhookSecretMiddleware, validate(emailWebhookSchema, 'body'), webhookController)

export default router
