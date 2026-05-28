import { Router } from 'express'
import { trendController, categoriesController, merchantsController, paymentTypesController } from './analytics.controller'
import { validate } from '../../shared/middleware/validate.middleware'
import { analyticsQuerySchema } from './analytics.schema'
import { authMiddleware } from '../../shared/middleware/auth.middleware'

const router = Router()
const q = validate(analyticsQuerySchema, 'query')

router.use(authMiddleware)
router.get('/trend', q, trendController)
router.get('/categories', q, categoriesController)
router.get('/merchants', q, merchantsController)
router.get('/payment-types', q, paymentTypesController)

export default router
