import { z } from 'zod'

export const analyticsQuerySchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  bankType: z.string().optional(),
  groupBy: z.enum(['day', 'week', 'month']).default('month'),
})

export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>
