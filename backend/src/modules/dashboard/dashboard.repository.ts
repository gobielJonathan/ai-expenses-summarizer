import { Prisma } from '@prisma/client'
import { prisma } from '../../infrastructure/database/prisma'
import type { DashboardQuery } from './dashboard.schema'

function yearWhere(query: DashboardQuery): Prisma.TransactionWhereInput {
  const start = new Date(`${query.year}-01-01`)
  const end = new Date(`${query.year}-12-31T23:59:59.999Z`)
  const where: Prisma.TransactionWhereInput = { transactionDate: { gte: start, lte: end } }
  if (query.bankType) where.bankType = query.bankType
  return where
}

export async function getMonthlyTotals(query: DashboardQuery) {
  const where = yearWhere(query)
  const rows = await prisma.$queryRaw<{ month: number; total: number; bank_type: string }[]>`
    SELECT EXTRACT(MONTH FROM transaction_date)::int AS month,
           bank_type,
           SUM(amount)::float AS total
    FROM transactions
    WHERE transaction_date >= ${new Date(`${query.year}-01-01`)}
      AND transaction_date <= ${new Date(`${query.year}-12-31T23:59:59.999Z`)}
      ${query.bankType ? Prisma.sql`AND bank_type = ${query.bankType}` : Prisma.sql``}
    GROUP BY month, bank_type
    ORDER BY month
  `
  return rows
}

export async function getDailyTotals(query: DashboardQuery) {
  const year = query.year
  const month = query.month ?? new Date().getMonth() + 1
  const start = new Date(`${year}-${String(month).padStart(2, '0')}-01`)
  const nextMonth = new Date(start)
  nextMonth.setMonth(nextMonth.getMonth() + 1)

  const rows = await prisma.$queryRaw<{ day: number; total: number }[]>`
    SELECT EXTRACT(DAY FROM transaction_date)::int AS day,
           SUM(amount)::float AS total
    FROM transactions
    WHERE transaction_date >= ${start}
      AND transaction_date < ${nextMonth}
      ${query.bankType ? Prisma.sql`AND bank_type = ${query.bankType}` : Prisma.sql``}
    GROUP BY day
    ORDER BY day
  `
  return rows
}

export async function getTopCategories(query: DashboardQuery) {
  const where = yearWhere(query)
  const rows = await prisma.$queryRaw<{ category: string; total: number }[]>`
    SELECT category,
           SUM(amount)::float AS total
    FROM transactions
    WHERE transaction_date >= ${new Date(`${query.year}-01-01`)}
      AND transaction_date <= ${new Date(`${query.year}-12-31T23:59:59.999Z`)}
      ${query.bankType ? Prisma.sql`AND bank_type = ${query.bankType}` : Prisma.sql``}
    GROUP BY category
    ORDER BY total DESC
    LIMIT 10
  `
  return rows
}

export async function getBankBreakdown(query: DashboardQuery) {
  const rows = await prisma.$queryRaw<{ bank_type: string; total: number }[]>`
    SELECT bank_type,
           SUM(amount)::float AS total
    FROM transactions
    WHERE transaction_date >= ${new Date(`${query.year}-01-01`)}
      AND transaction_date <= ${new Date(`${query.year}-12-31T23:59:59.999Z`)}
    GROUP BY bank_type
    ORDER BY total DESC
  `
  return rows
}

export async function getPaymentTypeBreakdown(query: DashboardQuery) {
  const rows = await prisma.$queryRaw<{ payment_type: string; total: number }[]>`
    SELECT payment_type,
           SUM(amount)::float AS total
    FROM transactions
    WHERE transaction_date >= ${new Date(`${query.year}-01-01`)}
      AND transaction_date <= ${new Date(`${query.year}-12-31T23:59:59.999Z`)}
      ${query.bankType ? Prisma.sql`AND bank_type = ${query.bankType}` : Prisma.sql``}
    GROUP BY payment_type
    ORDER BY total DESC
  `
  return rows
}

export async function getBankPaymentBreakdown(query: DashboardQuery) {
  const rows = await prisma.$queryRaw<{ bank_type: string; payment_type: string; total: number }[]>`
    SELECT bank_type,
           payment_type,
           SUM(amount)::float AS total
    FROM transactions
    WHERE transaction_date >= ${new Date(`${query.year}-01-01`)}
      AND transaction_date <= ${new Date(`${query.year}-12-31T23:59:59.999Z`)}
    GROUP BY bank_type, payment_type
    ORDER BY bank_type, payment_type
  `
  return rows
}

export async function getSummaryStats(query: DashboardQuery) {
  const where = yearWhere(query)
  const result = await prisma.transaction.aggregate({
    where,
    _sum: { amount: true },
    _count: { id: true },
    _avg: { amount: true },
    _max: { amount: true },
  })
  return result
}
