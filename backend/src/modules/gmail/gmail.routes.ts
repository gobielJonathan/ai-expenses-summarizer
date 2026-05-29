import { Router, Request, Response, NextFunction } from 'express'
import { authMiddleware } from '../../shared/middleware/auth.middleware'
import { triggerDailySyncController, triggerMonthlyTransactionSyncController, triggerEstatementSyncController } from './gmail.controller'
import { env } from '../../config/env'

// Accepts either a valid JWT (frontend) or the shared webhook secret (internal cron)
function gmailSyncAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const webhookSecret = req.headers['x-webhook-secret']
  if (webhookSecret && webhookSecret === env.N8N_WEBHOOK_SECRET) {
    next()
    return
  }
  authMiddleware(req, _res, next)
}

const router = Router()

// POST /gmail/sync/daily               — today's transaction notification sync
// POST /gmail/sync/monthly-transaction — this month's transaction notification sync
// POST /gmail/sync/e-statement         — this month's bank e-statement (PDF) sync
router.post('/sync/daily', gmailSyncAuthMiddleware, triggerDailySyncController)
router.post('/sync/monthly-transaction', gmailSyncAuthMiddleware, triggerMonthlyTransactionSyncController)
router.post('/sync/e-statement', gmailSyncAuthMiddleware, triggerEstatementSyncController)

export default router
