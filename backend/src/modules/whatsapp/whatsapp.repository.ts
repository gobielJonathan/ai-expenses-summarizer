import { prisma } from '../../infrastructure/database/prisma'

export async function findAccountByUserId(userId: string) {
  return prisma.whatsappAccount.findUnique({ where: { userId } })
}

export async function findAccountByPhone(phoneNumber: string) {
  return prisma.whatsappAccount.findFirst({ where: { phoneNumber } })
}

export async function upsertAccount(userId: string, phoneNumber: string, isVerified: boolean) {
  return prisma.whatsappAccount.upsert({
    where: { userId },
    create: { userId, phoneNumber, isVerified },
    update: { phoneNumber, isVerified },
  })
}

export async function markVerified(userId: string) {
  return prisma.whatsappAccount.update({
    where: { userId },
    data: { isVerified: true },
  })
}

export async function deleteAccount(userId: string) {
  return prisma.whatsappAccount.delete({ where: { userId } })
}
