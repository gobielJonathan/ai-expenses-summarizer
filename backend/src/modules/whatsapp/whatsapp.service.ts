import { redis } from '../../infrastructure/redis/client'
import { ConflictError, NotFoundError, ValidationError } from '../../shared/errors'
import { logger } from '../../shared/logger'
import {
  findAccountByUserId,
  findAccountByPhone,
  upsertAccount,
  markVerified,
  deleteAccount,
} from './whatsapp.repository'
import type { LinkPhoneDto, VerifyOtpDto } from './whatsapp.schema'

const OTP_TTL_SECONDS = 300 // 5 minutes
const OTP_KEY_PREFIX = 'whatsapp:otp:'

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function otpKey(userId: string): string {
  return `${OTP_KEY_PREFIX}${userId}`
}

export async function linkPhoneNumber(userId: string, dto: LinkPhoneDto) {
  const existing = await findAccountByPhone(dto.phoneNumber)
  if (existing && existing.userId !== userId) {
    throw new ConflictError('Phone number already linked to another account')
  }

  // Persist phone (unverified) and generate OTP
  await upsertAccount(userId, dto.phoneNumber, false)

  const otp = generateOtp()
  await redis.set(otpKey(userId), otp, 'EX', OTP_TTL_SECONDS)

  // In production this OTP would be sent via the WhatsApp Business API.
  // For now, log it so developers can test locally.
  logger.info(`[WhatsApp OTP] userId=${userId} phone=${dto.phoneNumber} otp=${otp}`)

  return { message: 'OTP sent to WhatsApp number', phoneNumber: dto.phoneNumber }
}

export async function verifyOtp(userId: string, dto: VerifyOtpDto) {
  const account = await findAccountByUserId(userId)
  if (!account) throw new NotFoundError('WhatsApp account')
  if (account.phoneNumber !== dto.phoneNumber) {
    throw new ValidationError('Phone number does not match the pending link request')
  }

  const stored = await redis.get(otpKey(userId))
  if (!stored || stored !== dto.otp) {
    throw new ValidationError('Invalid or expired OTP')
  }

  await redis.del(otpKey(userId))
  await markVerified(userId)

  return { message: 'WhatsApp number verified successfully', phoneNumber: dto.phoneNumber }
}

export async function getLinkedAccount(userId: string) {
  const account = await findAccountByUserId(userId)
  if (!account) return null
  return {
    phoneNumber: account.phoneNumber,
    isVerified: account.isVerified,
    createdAt: account.createdAt,
  }
}

export async function unlinkAccount(userId: string) {
  const account = await findAccountByUserId(userId)
  if (!account) throw new NotFoundError('WhatsApp account')
  await redis.del(otpKey(userId))
  await deleteAccount(userId)
  return { message: 'WhatsApp number unlinked successfully' }
}

export async function lookupByPhone(phoneNumber: string) {
  const account = await findAccountByPhone(phoneNumber)
  if (!account) return { authorized: false, reason: 'not_linked' }
  if (!account.isVerified) return { authorized: false, reason: 'not_verified' }
  return { authorized: true, userId: account.userId }
}
