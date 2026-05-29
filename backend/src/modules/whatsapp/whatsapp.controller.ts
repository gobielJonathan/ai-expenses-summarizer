import { Request, Response, NextFunction } from 'express'
import { sendSuccess } from '../../shared/utils/response'
import { UnauthorizedError } from '../../shared/errors'
import { linkPhoneNumber, verifyOtp, getLinkedAccount, unlinkAccount, lookupByPhone } from './whatsapp.service'
import type { LinkPhoneDto, VerifyOtpDto } from './whatsapp.schema'

function getUserId(req: Request): string {
  if (!req.user?.id) throw new UnauthorizedError()
  return req.user.id
}

export async function linkController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await linkPhoneNumber(getUserId(req), req.body as LinkPhoneDto)
    return sendSuccess(res, result, result.message, 200)
  } catch (err) {
    next(err)
  }
}

export async function verifyController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await verifyOtp(getUserId(req), req.body as VerifyOtpDto)
    return sendSuccess(res, result, result.message, 200)
  } catch (err) {
    next(err)
  }
}

export async function statusController(req: Request, res: Response, next: NextFunction) {
  try {
    const account = await getLinkedAccount(getUserId(req))
    return sendSuccess(res, { linked: account !== null, account })
  } catch (err) {
    next(err)
  }
}

export async function unlinkController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await unlinkAccount(getUserId(req))
    return sendSuccess(res, result, result.message)
  } catch (err) {
    next(err)
  }
}

export async function lookupController(req: Request, res: Response, next: NextFunction) {
  try {
    const phoneNumber = String(req.query.phoneNumber ?? '')
    const result = await lookupByPhone(phoneNumber)
    return sendSuccess(res, result)
  } catch (err) {
    next(err)
  }
}
