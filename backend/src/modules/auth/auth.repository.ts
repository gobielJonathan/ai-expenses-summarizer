import { prisma } from '../../infrastructure/database/prisma'

export interface UserRecord {
  id: string
  email: string
  name: string
  avatarUrl: string
  googleId: string
  createdAt: Date
}

export async function findUserByGoogleId(googleId: string): Promise<UserRecord | null> {
  return prisma.user.findUnique({ where: { googleId } })
}

export async function upsertGoogleUser(data: {
  googleId: string
  email: string
  name: string
  avatarUrl: string
}): Promise<UserRecord> {
  return prisma.user.upsert({
    where: { googleId: data.googleId },
    update: { email: data.email, name: data.name, avatarUrl: data.avatarUrl },
    create: data,
  })
}
