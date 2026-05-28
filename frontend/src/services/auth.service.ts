import { http } from './http'
import type { AuthUser } from '@/types'

const GOOGLE_AUTH_URL = '/api/v1/auth/google'

export const authService = {
  redirectToGoogle(): void {
    window.location.href = GOOGLE_AUTH_URL
  },

  async getMe(): Promise<AuthUser> {
    const res = await http.get<AuthUser>('/auth/me')
    return res.data
  },

  logout(): void {
    localStorage.removeItem('auth_token')
  },
}
