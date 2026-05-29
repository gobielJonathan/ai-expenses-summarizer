import { Request, Response, NextFunction } from 'express'
import { summarizeSpending } from './ai.service'
import { prisma } from '../../infrastructure/database/prisma'
import { sendSuccess } from '../../shared/utils/response'

export async function summaryController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { startDate, endDate } = req.query as { startDate?: string; endDate?: string }
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1)
    const end = endDate ? new Date(endDate) : new Date()

    const transactions = await prisma.transaction.findMany({
      where: { transactionDate: { gte: start, lte: end } },
      select: { merchant: true, amount: true, category: true, transactionDate: true },
      orderBy: { transactionDate: 'desc' },
      take: 100,
    })

    const txs = transactions.map((t: { merchant: string; amount: unknown; category: string; transactionDate: Date }) => ({
      ...t,
      amount: Number(t.amount),
    }))

    const summary = await summarizeSpending(txs)
    sendSuccess(res, { summary })
  } catch (err) {
    next(err)
  }
}
