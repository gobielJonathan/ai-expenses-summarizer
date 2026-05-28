import { Router } from 'express'
import { listController, getController, ingestController } from './transactions.controller'
import { validate } from '../../shared/middleware/validate.middleware'
import { listTransactionsSchema, createTransactionSchema } from './transactions.schema'
import { authMiddleware } from '../../shared/middleware/auth.middleware'
import { serviceMiddleware } from '../../shared/middleware/service.middleware'

const router = Router()

// Service route — authenticated via X-API-Key (n8n automation)
router.post('/', serviceMiddleware, validate(createTransactionSchema, 'body'), ingestController)

// User routes — authenticated via Bearer JWT
router.use(authMiddleware)
router.get('/', validate(listTransactionsSchema, 'query'), listController)
router.get('/:id', getController)

export default router
