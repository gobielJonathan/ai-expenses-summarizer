import { Prisma } from '@prisma/client'
import { prisma } from '../../infrastructure/database/prisma'

function todayRange(): { start: Date; end: Date } {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

function currentMonthRange(): { start: Date; end: Date } {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
  return { start, end }
}

function dateRange(startDate?: string, endDate?: string): { start: Date; end: Date } {
  if (startDate && endDate) {
    return { start: new Date(startDate), end: new Date(endDate) }
  }
  return todayRange()
}

export async function getTodaySummary(startDate?: string, endDate?: string, bankType?: string) {
  const { start, end } = dateRange(startDate, endDate)

  const rows = await prisma.$queryRaw<{ total: number; count: number }[]>`
    SELECT SUM(amount)::float AS total, COUNT(*)::int AS count
    FROM transactions
    WHERE transaction_date >= ${start}
      AND transaction_date <= ${end}
      ${bankType ? Prisma.sql`AND bank_type = ${bankType}` : Prisma.sql``}
  `

  const categories = await prisma.$queryRaw<{ category: string; total: number }[]>`
    SELECT category, SUM(amount)::float AS total
    FROM transactions
    WHERE transaction_date >= ${start}
      AND transaction_date <= ${end}
      ${bankType ? Prisma.sql`AND bank_type = ${bankType}` : Prisma.sql``}
    GROUP BY category
    ORDER BY total DESC
    LIMIT 5
  `

  return {
    total: rows[0]?.total ?? 0,
    transactionCount: rows[0]?.count ?? 0,
    categories,
  }
}

export async function getMonthlySummary(startDate?: string, endDate?: string, bankType?: string) {
  const { start, end } = startDate && endDate ? { start: new Date(startDate), end: new Date(endDate) } : currentMonthRange()

  const totals = await prisma.$queryRaw<{ total: number; count: number }[]>`
    SELECT SUM(amount)::float AS total, COUNT(*)::int AS count
    FROM transactions
    WHERE transaction_date >= ${start}
      AND transaction_date <= ${end}
      ${bankType ? Prisma.sql`AND bank_type = ${bankType}` : Prisma.sql``}
  `

  const categories = await prisma.$queryRaw<{ category: string; total: number }[]>`
    SELECT category, SUM(amount)::float AS total
    FROM transactions
    WHERE transaction_date >= ${start}
      AND transaction_date <= ${end}
      ${bankType ? Prisma.sql`AND bank_type = ${bankType}` : Prisma.sql``}
    GROUP BY category
    ORDER BY total DESC
    LIMIT 5
  `

  const paymentTypes = await prisma.$queryRaw<{ payment_type: string; total: number }[]>`
    SELECT payment_type, SUM(amount)::float AS total
    FROM transactions
    WHERE transaction_date >= ${start}
      AND transaction_date <= ${end}
      ${bankType ? Prisma.sql`AND bank_type = ${bankType}` : Prisma.sql``}
    GROUP BY payment_type
    ORDER BY total DESC
  `

  const grandTotal = totals[0]?.total ?? 0
  const paymentBreakdown = paymentTypes.map((r) => ({
    paymentType: r.payment_type,
    total: r.total,
    percentage: grandTotal > 0 ? Math.round((r.total / grandTotal) * 100) : 0,
  }))

  return {
    total: grandTotal,
    transactionCount: totals[0]?.count ?? 0,
    period: { start: start.toISOString(), end: end.toISOString() },
    categories,
    paymentBreakdown,
  }
}

export async function getCategorySummary(category: string, startDate?: string, endDate?: string, bankType?: string) {
  const { start, end } = startDate && endDate ? { start: new Date(startDate), end: new Date(endDate) } : currentMonthRange()

  const totals = await prisma.$queryRaw<{ total: number; count: number }[]>`
    SELECT SUM(amount)::float AS total, COUNT(*)::int AS count
    FROM transactions
    WHERE transaction_date >= ${start}
      AND transaction_date <= ${end}
      AND LOWER(category) = LOWER(${category})
      ${bankType ? Prisma.sql`AND bank_type = ${bankType}` : Prisma.sql``}
  `

  const merchants = await prisma.$queryRaw<{ merchant: string; total: number }[]>`
    SELECT merchant, SUM(amount)::float AS total
    FROM transactions
    WHERE transaction_date >= ${start}
      AND transaction_date <= ${end}
      AND LOWER(category) = LOWER(${category})
      ${bankType ? Prisma.sql`AND bank_type = ${bankType}` : Prisma.sql``}
    GROUP BY merchant
    ORDER BY total DESC
    LIMIT 10
  `

  return {
    category,
    total: totals[0]?.total ?? 0,
    transactionCount: totals[0]?.count ?? 0,
    period: { start: start.toISOString(), end: end.toISOString() },
    merchants,
  }
}

export async function getBankSummary(startDate?: string, endDate?: string) {
  const { start, end } = startDate && endDate ? { start: new Date(startDate), end: new Date(endDate) } : currentMonthRange()

  const rows = await prisma.$queryRaw<{ bank_type: string; total: number; count: number }[]>`
    SELECT bank_type, SUM(amount)::float AS total, COUNT(*)::int AS count
    FROM transactions
    WHERE transaction_date >= ${start}
      AND transaction_date <= ${end}
    GROUP BY bank_type
    ORDER BY total DESC
  `

  return {
    period: { start: start.toISOString(), end: end.toISOString() },
    banks: rows.map((r) => ({ bankType: r.bank_type, total: r.total, transactionCount: r.count })),
  }
}

export async function getPaymentSummary(startDate?: string, endDate?: string, bankType?: string) {
  const { start, end } = startDate && endDate ? { start: new Date(startDate), end: new Date(endDate) } : currentMonthRange()

  const rows = await prisma.$queryRaw<{ payment_type: string; total: number; count: number }[]>`
    SELECT payment_type, SUM(amount)::float AS total, COUNT(*)::int AS count
    FROM transactions
    WHERE transaction_date >= ${start}
      AND transaction_date <= ${end}
      ${bankType ? Prisma.sql`AND bank_type = ${bankType}` : Prisma.sql``}
    GROUP BY payment_type
    ORDER BY total DESC
  `

  const grandTotal = rows.reduce((sum, r) => sum + r.total, 0)

  return {
    period: { start: start.toISOString(), end: end.toISOString() },
    paymentTypes: rows.map((r) => ({
      paymentType: r.payment_type,
      total: r.total,
      transactionCount: r.count,
      percentage: grandTotal > 0 ? Math.round((r.total / grandTotal) * 100) : 0,
    })),
  }
}

export async function getStatementByBankAndMonth(bankType: string, month: string) {
  const [year, monthNum] = month.split('-').map(Number)
  const statementMonth = new Date(year, monthNum - 1, 1)

  const statement = await prisma.statement.findFirst({
    where: { bankType, statementMonth },
    include: { transactions: false },
  })

  return statement
}
