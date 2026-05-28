import { z } from 'zod'

export const emailWebhookSchema = z.object({
  messageId: z.string().min(1),
  subject: z.string().min(1),
  from: z.string().min(1),
  body: z.string().min(1),
  bankType: z.enum(['BCA', 'JENIUS', 'UOB', 'BRI']),
  receivedAt: z.string().optional(), // ISO 8601 from n8n, falls back to now()
})

export type EmailWebhookDto = z.infer<typeof emailWebhookSchema>
