import { z } from 'zod'

export const uploadStatementSchema = z.object({
  bankType: z.string().min(1),
  statementMonth: z.string().regex(/^\d{4}-\d{2}$/, 'Format must be YYYY-MM'),
})

export const listStatementsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  bankType: z.string().optional(),
})

export type UploadStatementDto = z.infer<typeof uploadStatementSchema>
export type ListStatementsQuery = z.infer<typeof listStatementsSchema>
