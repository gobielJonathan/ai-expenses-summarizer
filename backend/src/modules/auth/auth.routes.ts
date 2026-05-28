import { Router } from 'express'
import { googleAuthController, googleCallbackController, getMeController } from './auth.controller'
import { authMiddleware } from '../../shared/middleware/auth.middleware'

const router = Router()

router.get('/google', googleAuthController)
router.get('/google/callback', googleCallbackController)
router.get('/me', authMiddleware, getMeController)

export default router
