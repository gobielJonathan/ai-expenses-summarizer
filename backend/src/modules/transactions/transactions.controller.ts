import { Request, Response, NextFunction } from 'express'
import { listTransactions, getTransaction, ingestTransaction } from './transactions.service'
import { sendPaginated, sendSuccess, sendCreated } from '../../shared/utils/response'
import type { ListTransactionsQuery, CreateTransactionDto } from './transactions.schema'

export async function listController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = req.query as unknown as ListTransactionsQuery
    const { data, total } = await listTransactions(query)
    sendPaginated(res, data, total, query.page, query.limit)
  } catch (err) {
    next(err)
  }
}

export async function getController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tx = await getTransaction(String(req.params.id))
    sendSuccess(res, tx)
  } catch (err) {
    next(err)
  }
}

export async function ingestController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = req.body as CreateTransactionDto
    const tx = await ingestTransaction(dto)
    sendCreated(res, tx, 'Transaction ingested and queued for AI categorization')
  } catch (err) {
    next(err)
  }
}
