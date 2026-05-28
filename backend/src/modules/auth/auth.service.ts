import { OAuth2Client } from 'google-auth-library'
import { signToken } from '../../shared/utils/jwt'
import { UnauthorizedError } from '../../shared/errors'
import { upsertGoogleUser } from './auth.repository'
import { env } from '../../config/env'

export interface AuthTokenResponse {
  token: string
  user: { id: string; email: string; name: string; avatarUrl: string }
}

function getOAuthClient(): OAuth2Client {
  return new OAuth2Client(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URI,
  )
}

export function getGoogleAuthUrl(): string {
  const client = getOAuthClient()
  return client.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'email', 'profile'],
    prompt: 'select_account',
  })
}

export async function handleGoogleCallback(code: string): Promise<AuthTokenResponse> {
  const client = getOAuthClient()

  const { tokens } = await client.getToken(code)
  if (!tokens.id_token) throw new UnauthorizedError('No ID token from Google')

  client.setCredentials(tokens)
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: env.GOOGLE_CLIENT_ID,
  })

  const payload = ticket.getPayload()
  if (!payload?.sub || !payload.email) throw new UnauthorizedError('Invalid Google token payload')

  const user = await upsertGoogleUser({
    googleId: payload.sub,
    email: payload.email,
    name: payload.name ?? '',
    avatarUrl: payload.picture ?? '',
  })

  const token = signToken({ sub: user.id, email: user.email })
  return { token, user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl } }
}
