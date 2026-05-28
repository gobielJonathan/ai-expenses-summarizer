import { Router } from 'express'
import { summaryController } from './ai.controller'
import { authMiddleware } from '../../shared/middleware/auth.middleware'

const router = Router()

router.use(authMiddleware)
router.get('/summary', summaryController)

export default router
