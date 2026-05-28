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
    } catch {
      logout()
    }
  }

  function logout() {
    authService.logout()
    token.value = null
    user.value = null
  }

  return { token, user, isAuthenticated, setToken, fetchUser, logout }
})
