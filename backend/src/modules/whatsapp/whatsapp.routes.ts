import { Router, Request, Response, NextFunction } from 'express'
import { authMiddleware } from '../../shared/middleware/auth.middleware'
import { validate } from '../../shared/middleware/validate.middleware'
import { linkController, verifyController, statusController, unlinkController, lookupController } from './whatsapp.controller'
import { linkPhoneSchema, verifyOtpSchema } from './whatsapp.schema'
import { env } from '../../config/env'
import { UnauthorizedError } from '../../shared/errors'

function webhookSecretMiddleware(req: Request, _res: Response, next: NextFunction) {
  const secret = req.headers['x-webhook-secret']
  if (!env.N8N_WEBHOOK_SECRET || secret !== env.N8N_WEBHOOK_SECRET) {
    return next(new UnauthorizedError('Invalid or missing webhook secret'))
  }
  next()
}

const router = Router()

// n8n server-to-server: verify a phone number (secured by webhook secret, not JWT)
router.get('/lookup', webhookSecretMiddleware, lookupController)

// All remaining routes require user JWT
router.use(authMiddleware)

// GET  /whatsapp/status  — check if current user has a linked number
router.get('/status', statusController)

// POST /whatsapp/link    — initiate phone linking (sends OTP)
router.post('/link', validate(linkPhoneSchema, 'body'), linkController)

// POST /whatsapp/verify  — confirm OTP and mark number as verified
router.post('/verify', validate(verifyOtpSchema, 'body'), verifyController)

// DELETE /whatsapp/unlink — remove linked number
router.delete('/unlink', unlinkController)

export default router
