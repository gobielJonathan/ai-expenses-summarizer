import { Request, Response, NextFunction } from 'express'
import { processEmailTransaction } from './email.service'
import { sendCreated } from '../../shared/utils/response'
import type { EmailWebhookDto } from './email.schema'

export async function webhookController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = req.body as EmailWebhookDto
    const transaction = await processEmailTransaction(dto)
    sendCreated(res, transaction, 'Email transaction processed')
  } catch (err) {
    next(err)
  }
}
