import { Router } from 'express'
import authRoutes from '../modules/auth/auth.routes'
import transactionsRoutes from '../modules/transactions/transactions.routes'
import statementsRoutes from '../modules/statements/statements.routes'
import dashboardRoutes from '../modules/dashboard/dashboard.routes'
import analyticsRoutes from '../modules/analytics/analytics.routes'
import aiRoutes from '../modules/ai/ai.routes'
import emailRoutes from '../modules/gmail/email.routes'
import gmailRoutes from '../modules/gmail/gmail.routes'
import chatRoutes from '../modules/chat/chat.routes'
import whatsappRoutes from '../modules/whatsapp/whatsapp.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/transactions', transactionsRoutes)
router.use('/statements', statementsRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/analytics', analyticsRoutes)
router.use('/ai', aiRoutes)
router.use('/email', emailRoutes)
router.use('/gmail', gmailRoutes)
router.use('/chat', chatRoutes)
router.use('/whatsapp', whatsappRoutes)

export default router
