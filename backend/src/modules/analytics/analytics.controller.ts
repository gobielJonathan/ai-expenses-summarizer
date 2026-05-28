import { Request, Response, NextFunction } from 'express'
import { getTrend, getCategories, getMerchants, getPaymentTypes } from './analytics.service'
import { sendSuccess } from '../../shared/utils/response'
import type { AnalyticsQuery } from './analytics.schema'

export async function trendController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    sendSuccess(res, await getTrend(req.query as unknown as AnalyticsQuery))
  } catch (err) { next(err) }
}

export async function categoriesController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    sendSuccess(res, await getCategories(req.query as unknown as AnalyticsQuery))
  } catch (err) { next(err) }
}

export async function merchantsController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    sendSuccess(res, await getMerchants(req.query as unknown as AnalyticsQuery))
  } catch (err) { next(err) }
}

export async function paymentTypesController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    sendSuccess(res, await getPaymentTypes(req.query as unknown as AnalyticsQuery))
  } catch (err) { next(err) }
}
