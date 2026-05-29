import { z } from 'zod'

export const linkPhoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(8)
    .max(20)
    .regex(/^\+?[0-9]+$/, 'Invalid phone number format'),
})

export const verifyOtpSchema = z.object({
  phoneNumber: z.string().min(8).max(20),
  otp: z.string().length(6).regex(/^\d{6}$/, 'OTP must be 6 digits'),
})

export type LinkPhoneDto = z.infer<typeof linkPhoneSchema>
export type VerifyOtpDto = z.infer<typeof verifyOtpSchema>
