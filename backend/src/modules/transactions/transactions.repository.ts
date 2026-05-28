import { Prisma } from '@prisma/client'
import { prisma } from '../../infrastructure/database/prisma'
import type { ListTransactionsQuery, CreateTransactionDto } from './transactions.schema'

export async function findTransactions(query: ListTransactionsQuery): Promise<{
  data: Prisma.TransactionGetPayload<object>[]
  total: number
}> {
  const { page, limit, startDate, endDate, bankType, paymentType, category, merchant, sortBy, sortOrder } = query
  const skip = (page - 1) * limit

  const where: Prisma.TransactionWhereInput = {}
  if (startDate || endDate) {
    where.transactionDate = {
      ...(startDate ? { gte: new Date(startDate) } : {}),
      ...(endDate ? { lte: new Date(endDate) } : {}),
    }
  }
  if (bankType) where.bankType = bankType
  if (paymentType) where.paymentType = paymentType
  if (category) where.category = category
  if (merchant) where.merchant = { contains: merchant, mode: 'insensitive' }

  const [data, total] = await prisma.$transaction([
    prisma.transaction.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.transaction.count({ where }),
  ])

  return { data, total }
}

export async function findTransactionById(id: string) {
  return prisma.transaction.findUnique({ where: { id } })
}

export async function createTransaction(dto: CreateTransactionDto) {
  return prisma.transaction.create({
    data: {
      bankType: dto.bankType,
      paymentType: dto.paymentType,
      merchant: dto.merchant,
      amount: dto.amount,
      currency: dto.currency ?? 'IDR',
      transactionDate: new Date(dto.transactionDate),
      statementId: dto.statementId ?? null,
    },
  })
}
