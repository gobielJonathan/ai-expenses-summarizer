import { z } from 'zod'

export const chatDateRangeSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  bankType: z.enum(['BCA', 'JENIUS', 'UOB', 'BRI']).optional(),
})

export const chatCategorySchema = z.object({
  category: z.string().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  bankType: z.enum(['BCA', 'JENIUS', 'UOB', 'BRI']).optional(),
})

export const chatStatementSchema = z.object({
  bankType: z.enum(['BCA', 'JENIUS', 'UOB', 'BRI']),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'month must be YYYY-MM'),
})

export type ChatDateRangeQuery = z.infer<typeof chatDateRangeSchema>
export type ChatCategoryQuery = z.infer<typeof chatCategorySchema>
export type ChatStatementQuery = z.infer<typeof chatStatementSchema>
