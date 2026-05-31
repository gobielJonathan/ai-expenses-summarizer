import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import type { AuthUser } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const user = ref<AuthUser | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('auth_token', newToken)
  }

  async function fetchUser() {
    if (!token.value) return
    try {
      user.value = await authService.getMe()
    } catch (err) {
      // Only clear the session on 401 (invalid/expired token).
      // Network errors or 5xx should preserve the token so the user
      // isn't logged out on a hard refresh while the backend is slow.
      if ((err as { status?: number }).status === 401) {
        logout()
      }
    }
  }

  function logout() {
    authService.logout()
    token.value = null
    user.value = null
  }

  return { token, user, isAuthenticated, setToken, fetchUser, logout }
})
