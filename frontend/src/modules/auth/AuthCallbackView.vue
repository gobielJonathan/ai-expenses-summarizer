<template>
  <div class="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
    <div class="text-center space-y-3">
      <span class="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin inline-block" />
      <p class="text-sm text-[var(--color-text-muted)]">Completing sign-in…</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

onMounted(async () => {
  const token = route.query.token as string | undefined

  if (!token) {
    router.replace({ name: 'login', query: { error: 'oauth_failed' } })
    return
  }

  auth.setToken(token)
  await auth.fetchUser()

  const redirect = (route.query.redirect as string | undefined) ?? '/dashboard'
  router.replace(redirect)
})
</script>
