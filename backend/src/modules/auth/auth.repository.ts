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
  gmailRefreshToken?: string
}): Promise<UserRecord> {
  const updateData: Record<string, unknown> = {
    email: data.email,
    name: data.name,
    avatarUrl: data.avatarUrl,
  }
  if (data.gmailRefreshToken) {
    updateData.gmailRefreshToken = data.gmailRefreshToken
  }

  return prisma.user.upsert({
    where: { googleId: data.googleId },
    update: updateData,
    create: {
      googleId: data.googleId,
      email: data.email,
      name: data.name,
      avatarUrl: data.avatarUrl,
      gmailRefreshToken: data.gmailRefreshToken,
    },
  })
}
