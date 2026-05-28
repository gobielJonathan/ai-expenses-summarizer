import { Request, Response, NextFunction } from 'express'
import {
  getMonthlyData,
  getDailyData,
  getTopCategoriesData,
  getBanksData,
  getBankPaymentsData,
  getPaymentTypesData,
  getSummaryData,
} from './dashboard.service'
import { sendSuccess } from '../../shared/utils/response'
import type { DashboardQuery } from './dashboard.schema'

export async function monthlyController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getMonthlyData(req.query as unknown as DashboardQuery)
    sendSuccess(res, data)
  } catch (err) { next(err) }
}

export async function dailyController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getDailyData(req.query as unknown as DashboardQuery)
    sendSuccess(res, data)
  } catch (err) { next(err) }
}

export async function topCategoriesController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getTopCategoriesData(req.query as unknown as DashboardQuery)
    sendSuccess(res, data)
  } catch (err) { next(err) }
}

export async function banksController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getBanksData(req.query as unknown as DashboardQuery)
    sendSuccess(res, data)
  } catch (err) { next(err) }
}

export async function bankPaymentsController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getBankPaymentsData(req.query as unknown as DashboardQuery)
    sendSuccess(res, data)
  } catch (err) { next(err) }
}

export async function paymentTypesController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getPaymentTypesData(req.query as unknown as DashboardQuery)
    sendSuccess(res, data)
  } catch (err) { next(err) }
}

export async function summaryController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getSummaryData(req.query as unknown as DashboardQuery)
    sendSuccess(res, data)
  } catch (err) { next(err) }
}
