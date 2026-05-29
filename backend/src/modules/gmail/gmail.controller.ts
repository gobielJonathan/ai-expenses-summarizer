import { Request, Response, NextFunction } from 'express'
import { runDailyCronTransaction, runMonthlyTransactionCron, runEstatementCron } from './gmail.cron'
import { sendSuccess } from '../../shared/utils/response'

export async function triggerDailySyncController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // optional body: { date: "YYYY-MM-DD" }
    const date = typeof req.body?.date === 'string' ? req.body.date : undefined
    await runDailyCronTransaction(date)
    sendSuccess(res, null, 'Daily transaction sync triggered')
  } catch (err) {
    next(err)
  }
}

export async function triggerMonthlyTransactionSyncController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // optional body: { month: "YYYY-MM" }
    const month = typeof req.body?.month === 'string' ? req.body.month : undefined
    await runMonthlyTransactionCron(month)
    sendSuccess(res, null, 'Monthly transaction sync triggered')
  } catch (err) {
    next(err)
  }
}

export async function triggerEstatementSyncController(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await runEstatementCron()
    sendSuccess(res, null, 'Bank e-statement sync triggered')
  } catch (err) {
    next(err)
  }
}
