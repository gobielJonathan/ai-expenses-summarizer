import { Request, Response, NextFunction } from 'express'
import { getGoogleAuthUrl, handleGoogleCallback } from './auth.service'
import { sendSuccess } from '../../shared/utils/response'
import { env } from '../../config/env'

export function googleAuthController(_req: Request, res: Response): void {
  const url = getGoogleAuthUrl()
  res.redirect(url)
}

export async function googleCallbackController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const code = req.query.code as string
    const result = await handleGoogleCallback(code)
    const redirectUrl = `${env.FRONTEND_URL}/auth-callback?token=${result.token}`
    res.redirect(redirectUrl)
  } catch (err) {
    next(err)
  }
}

export async function getMeController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    sendSuccess(res, req.user, 'OK')
  } catch (err) {
    next(err)
  }
}
