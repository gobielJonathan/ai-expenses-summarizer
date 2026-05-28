import { z } from 'zod'

export const createTransactionSchema = z.object({
  bankType: z.enum(['BCA', 'Jenius', 'UOB', 'BRI']),
  paymentType: z.enum(['debit', 'credit']),
  merchant: z.string().min(1).max(500),
  amount: z.number().positive(),
  currency: z.string().length(3).default('IDR'),
  transactionDate: z.string().datetime({ offset: true }),
  statementId: z.string().uuid().optional(),
})

export type CreateTransactionDto = z.infer<typeof createTransactionSchema>

export const listTransactionsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  bankType: z.string().optional(),
  paymentType: z.string().optional(),
  category: z.string().optional(),
  merchant: z.string().optional(),
  sortBy: z.enum(['transactionDate', 'amount', 'merchant']).default('transactionDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type ListTransactionsQuery = z.infer<typeof listTransactionsSchema>
