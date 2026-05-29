import { Request, Response, NextFunction } from 'express'
import { sendSuccess } from '../../shared/utils/response'
import {
  getSummaryData,
  getMonthlySummaryData,
  getCategorySummaryData,
  getBankSummaryData,
  getPaymentSummaryData,
  getStatementData,
} from './chat.service'
import type { ChatDateRangeQuery, ChatCategoryQuery, ChatStatementQuery } from './chat.schema'

export async function summaryController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getSummaryData(req.query as ChatDateRangeQuery)
    return sendSuccess(res, data)
  } catch (err) {
    next(err)
  }
}

export async function monthlySummaryController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getMonthlySummaryData(req.query as ChatDateRangeQuery)
    return sendSuccess(res, data)
  } catch (err) {
    next(err)
  }
}

export async function categorySummaryController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getCategorySummaryData(req.query as ChatCategoryQuery)
    return sendSuccess(res, data)
  } catch (err) {
    next(err)
  }
}

export async function bankSummaryController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getBankSummaryData(req.query as ChatDateRangeQuery)
    return sendSuccess(res, data)
  } catch (err) {
    next(err)
  }
}

export async function paymentSummaryController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getPaymentSummaryData(req.query as ChatDateRangeQuery)
    return sendSuccess(res, data)
  } catch (err) {
    next(err)
  }
}

export async function statementController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getStatementData(req.query as ChatStatementQuery)
    return sendSuccess(res, data)
  } catch (err) {
    next(err)
  }
}
