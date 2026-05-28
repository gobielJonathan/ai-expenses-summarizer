import { Prisma } from '@prisma/client'
import { prisma } from '../../infrastructure/database/prisma'
import type { AnalyticsQuery } from './analytics.schema'

function baseWhere(query: AnalyticsQuery): Prisma.TransactionWhereInput {
  const where: Prisma.TransactionWhereInput = {
    transactionDate: { gte: new Date(query.startDate), lte: new Date(query.endDate) },
  }
  if (query.bankType) where.bankType = query.bankType
  return where
}

export async function getSpendingTrend(query: AnalyticsQuery) {
  const groupExpr =
    query.groupBy === 'day'
      ? Prisma.sql`DATE_TRUNC('day', transaction_date)`
      : query.groupBy === 'week'
        ? Prisma.sql`DATE_TRUNC('week', transaction_date)`
        : Prisma.sql`DATE_TRUNC('month', transaction_date)`

  const rows = await prisma.$queryRaw<{ period: Date; total: number }[]>`
    SELECT ${groupExpr} AS period,
           SUM(amount)::float AS total
    FROM transactions
    WHERE transaction_date >= ${new Date(query.startDate)}
      AND transaction_date <= ${new Date(query.endDate)}
      ${query.bankType ? Prisma.sql`AND bank_type = ${query.bankType}` : Prisma.sql``}
    GROUP BY period
    ORDER BY period
  `
  return rows
}

export async function getCategoryBreakdown(query: AnalyticsQuery) {
  const rows = await prisma.$queryRaw<{ category: string; total: number; count: number }[]>`
    SELECT category,
           SUM(amount)::float AS total,
           COUNT(*)::int AS count
    FROM transactions
    WHERE transaction_date >= ${new Date(query.startDate)}
      AND transaction_date <= ${new Date(query.endDate)}
      ${query.bankType ? Prisma.sql`AND bank_type = ${query.bankType}` : Prisma.sql``}
    GROUP BY category
    ORDER BY total DESC
  `
  return rows
}

export async function getMerchantRanking(query: AnalyticsQuery) {
  const rows = await prisma.$queryRaw<{ merchant: string; total: number; count: number }[]>`
    SELECT merchant,
           SUM(amount)::float AS total,
           COUNT(*)::int AS count
    FROM transactions
    WHERE transaction_date >= ${new Date(query.startDate)}
      AND transaction_date <= ${new Date(query.endDate)}
      ${query.bankType ? Prisma.sql`AND bank_type = ${query.bankType}` : Prisma.sql``}
    GROUP BY merchant
    ORDER BY total DESC
    LIMIT 20
  `
  return rows
}

export async function getPaymentTypeStats(query: AnalyticsQuery) {
  const where = baseWhere(query)
  const rows = await prisma.transaction.groupBy({
    by: ['paymentType'],
    where,
    _sum: { amount: true },
    _count: { id: true },
    orderBy: { _sum: { amount: 'desc' } },
  })
  return rows
}
