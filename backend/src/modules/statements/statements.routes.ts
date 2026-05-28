import { Router } from 'express'
import multer from 'multer'
import { listController, getController, uploadController, downloadController, previewController } from './statements.controller'
import { validate } from '../../shared/middleware/validate.middleware'
import { uploadStatementSchema, listStatementsSchema } from './statements.schema'
import { authMiddleware } from '../../shared/middleware/auth.middleware'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true)
    else cb(new Error('Only PDF files are allowed'))
  },
})

const router = Router()

router.use(authMiddleware)
router.get('/', validate(listStatementsSchema, 'query'), listController)
router.get('/:id', getController)
router.get('/:id/download', downloadController)
router.get('/:id/preview', previewController)
router.post('/', upload.single('file'), validate(uploadStatementSchema), uploadController)

export default router
