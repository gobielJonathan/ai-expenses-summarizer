import { Request, Response, NextFunction } from 'express'
import { enqueueEmailParse } from '../../infrastructure/queue'
import { sendSuccess } from '../../shared/utils/response'
import type { EmailWebhookDto } from './email.schema'

export async function webhookController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = req.body as EmailWebhookDto
    await enqueueEmailParse(dto)
    sendSuccess(res, { status: 'queued' }, 'Email queued for processing', 202)
  } catch (err) {
    next(err)
  }
}
