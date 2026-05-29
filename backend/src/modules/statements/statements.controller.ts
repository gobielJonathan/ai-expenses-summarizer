import { Request, Response, NextFunction } from 'express'
import { listStatements, getStatement, uploadStatement, serveStatementFile, removeStatement } from './statements.service'
import { sendPaginated, sendSuccess, sendCreated } from '../../shared/utils/response'
import { ValidationError } from '../../shared/errors'
import type { UploadStatementDto, ListStatementsQuery } from './statements.schema'

export async function listController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = req.query as unknown as ListStatementsQuery
    const { data, total } = await listStatements(query)
    sendPaginated(res, data, total, query.page, query.limit)
  } catch (err) {
    next(err)
  }
}

export async function getController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const stmt = await getStatement(String(req.params.id))
    sendSuccess(res, stmt)
  } catch (err) {
    next(err)
  }
}

export async function downloadController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { filePath, fileName } = await serveStatementFile(String(req.params.id))
    res.download(filePath, fileName)
  } catch (err) {
    next(err)
  }
}

export async function previewController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { filePath } = await serveStatementFile(String(req.params.id))
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'inline')
    res.sendFile(filePath)
  } catch (err) {
    next(err)
  }
}

export async function deleteController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await removeStatement(String(req.params.id))
    sendSuccess(res, null, 'Statement deleted')
  } catch (err) {
    next(err)
  }
}

export async function uploadController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const file = (req as Request & { file?: Express.Multer.File }).file
    if (!file) throw new ValidationError('PDF file is required')

    const dto = req.body as UploadStatementDto
    const statement = await uploadStatement(dto, file.buffer, file.originalname)
    sendCreated(res, statement, 'Statement uploaded and queued for processing')
  } catch (err) {
    next(err)
  }
}
