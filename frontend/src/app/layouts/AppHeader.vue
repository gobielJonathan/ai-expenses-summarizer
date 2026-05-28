<template>
  <header class="h-14 flex items-center justify-between px-4 md:px-6 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex-shrink-0">
    <h1 class="text-sm font-semibold text-[var(--color-text-muted)] capitalize">
      {{ currentRouteName }}
    </h1>
    <div class="flex items-center gap-3">
      <span class="hidden sm:block text-sm text-[var(--color-text-muted)]">{{ currentDate }}</span>
      <!-- Mobile logout -->
      <button
        class="md:hidden p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors"
        title="Logout"
        @click="handleLogout"
      >
        🚪
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const currentRouteName = computed(() => String(route.name ?? 'Dashboard'))
const currentDate = computed(() => dayjs().format('dddd, MMM D YYYY'))

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>
