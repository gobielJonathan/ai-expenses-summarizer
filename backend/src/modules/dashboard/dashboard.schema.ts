import { z } from 'zod'

export const dashboardQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100).default(new Date().getFullYear()),
  month: z.coerce.number().int().min(1).max(12).optional(),
  bankType: z.string().optional(),
})

export type DashboardQuery = z.infer<typeof dashboardQuerySchema>
