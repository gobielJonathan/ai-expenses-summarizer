import { Router } from 'express'
import {
  monthlyController,
  dailyController,
  topCategoriesController,
  banksController,
  bankPaymentsController,
  paymentTypesController,
  summaryController,
} from './dashboard.controller'
import { validate } from '../../shared/middleware/validate.middleware'
import { dashboardQuerySchema } from './dashboard.schema'
import { authMiddleware } from '../../shared/middleware/auth.middleware'

const router = Router()
const q = validate(dashboardQuerySchema, 'query')

router.use(authMiddleware)
router.get('/summary', q, summaryController)
router.get('/monthly', q, monthlyController)
router.get('/daily', q, dailyController)
router.get('/top-categories', q, topCategoriesController)
router.get('/banks', q, banksController)
router.get('/bank-payments', q, bankPaymentsController)
router.get('/payment-types', q, paymentTypesController)

export default router
