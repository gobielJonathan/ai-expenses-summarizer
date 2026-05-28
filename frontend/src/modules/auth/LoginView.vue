<template>
  <div class="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <span class="text-4xl">💳</span>
        <h1 class="text-2xl font-bold mt-3">WalletAI</h1>
        <p class="text-sm text-[var(--color-text-muted)] mt-1">Sign in to your dashboard</p>
      </div>

      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
        <div v-if="error" class="text-sm text-[var(--color-danger)] bg-red-500/10 rounded-lg px-3 py-2">
          {{ error }}
        </div>

        <button
          :disabled="loading"
          class="w-full py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] hover:bg-[var(--color-surface)] text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          @click="handleGoogleLogin"
        >
          <span v-if="loading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <svg v-else viewBox="0 0 24 24" class="w-4 h-4 shrink-0" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {{ loading ? 'Redirecting...' : 'Continue with Google' }}
        </button>

        <p class="text-center text-xs text-[var(--color-text-muted)] pt-1">
          Only authorised Google accounts can access this dashboard.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { authService } from '@/services/auth.service'

const route = useRoute()
const loading = ref(false)
const error = ref<string | null>(null)

// Show error if redirected back from a failed OAuth attempt
const queryError = route.query.error as string | undefined
if (queryError) error.value = queryError === 'oauth_failed' ? 'Google sign-in failed. Please try again.' : queryError

function handleGoogleLogin() {
  loading.value = true
  error.value = null
  authService.redirectToGoogle()
}
</script>
