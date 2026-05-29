import { Router, Request, Response, NextFunction } from 'express'
import { authMiddleware } from '../../shared/middleware/auth.middleware'
import { validate } from '../../shared/middleware/validate.middleware'
import {
  summaryController,
  monthlySummaryController,
  categorySummaryController,
  bankSummaryController,
  paymentSummaryController,
  statementController,
} from './chat.controller'
import {
  chatDateRangeSchema,
  chatCategorySchema,
  chatStatementSchema,
} from './chat.schema'
import { env } from '../../config/env'
import { UnauthorizedError } from '../../shared/errors'
import { findAccountByPhone } from '../whatsapp/whatsapp.repository'

/**
 * Dual-auth middleware: accepts either:
 *   1. Bearer JWT (frontend dashboard)
 *   2. X-Webhook-Secret + X-Phone-Number headers (n8n WhatsApp calls)
 *
 * For option 2, the phone number MUST be a verified whatsapp_accounts entry.
 * This ensures one user can never receive another user's data.
 */
async function chatAuthMiddleware(req: Request, _res: Response, next: NextFunction) {
  const secret = req.headers['x-webhook-secret']
  const phone = req.headers['x-phone-number'] as string | undefined

  if (secret && phone) {
    // n8n path — validate webhook secret and verified phone
    if (!env.N8N_WEBHOOK_SECRET || secret !== env.N8N_WEBHOOK_SECRET) {
      return next(new UnauthorizedError('Invalid webhook secret'))
    }
    const account = await findAccountByPhone(phone)
    if (!account || !account.isVerified) {
      return next(new UnauthorizedError('Phone number not linked or not verified'))
    }
    // Attach userId so controllers/services can scope data if needed
    req.user = { id: account.userId, email: '' }
    return next()
  }

  // Frontend path — standard JWT
  return authMiddleware(req, _res, next)
}

const router = Router()

router.use(chatAuthMiddleware)

router.get('/summary', validate(chatDateRangeSchema, 'query'), summaryController)
router.get('/monthly-summary', validate(chatDateRangeSchema, 'query'), monthlySummaryController)
router.get('/category-summary', validate(chatCategorySchema, 'query'), categorySummaryController)
router.get('/bank-summary', validate(chatDateRangeSchema, 'query'), bankSummaryController)
router.get('/payment-summary', validate(chatDateRangeSchema, 'query'), paymentSummaryController)
router.get('/statement', validate(chatStatementSchema, 'query'), statementController)

export default router
