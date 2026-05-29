import { prisma } from '../../infrastructure/database/prisma'
import type { ListStatementsQuery } from './statements.schema'

export async function findStatements(query: ListStatementsQuery) {
  const { page, limit, bankType } = query
  const skip = (page - 1) * limit
  const where = bankType ? { bankType } : {}

  const [data, total] = await prisma.$transaction([
    prisma.statement.findMany({
      where,
      skip,
      take: limit,
      orderBy: { statementMonth: 'desc' },
      include: { _count: { select: { transactions: true } } },
    }),
    prisma.statement.count({ where }),
  ])

  return { data, total }
}

export async function findStatementById(id: string) {
  return prisma.statement.findUnique({
    where: { id },
    include: { transactions: true },
  })
}

export async function createStatement(data: {
  bankType: string
  statementMonth: Date
  pdfPath: string
}) {
  // Dedup: return existing statement if same bank + month already present
  const existing = await prisma.statement.findUnique({
    where: { bankType_statementMonth: { bankType: data.bankType, statementMonth: data.statementMonth } },
  })
  if (existing) return existing
  return prisma.statement.create({ data })
}

export async function deleteStatement(id: string) {
  // Delete associated transactions first (no cascade set), then the statement
  await prisma.transaction.deleteMany({ where: { statementId: id } })
  return prisma.statement.delete({ where: { id } })
}
