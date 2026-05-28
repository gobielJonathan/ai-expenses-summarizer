import { Router } from 'express'
import authRoutes from '../modules/auth/auth.routes'
import transactionsRoutes from '../modules/transactions/transactions.routes'
import statementsRoutes from '../modules/statements/statements.routes'
import dashboardRoutes from '../modules/dashboard/dashboard.routes'
import analyticsRoutes from '../modules/analytics/analytics.routes'
import aiRoutes from '../modules/ai/ai.routes'
import emailRoutes from '../modules/gmail/email.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/transactions', transactionsRoutes)
router.use('/statements', statementsRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/analytics', analyticsRoutes)
router.use('/ai', aiRoutes)
router.use('/email', emailRoutes)

export default router
