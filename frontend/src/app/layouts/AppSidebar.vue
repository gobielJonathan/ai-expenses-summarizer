<template>
  <aside class="w-60 flex-shrink-0 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col">
    <div class="px-6 py-5 border-b border-[var(--color-border)]">
      <span class="text-lg font-bold text-[var(--color-primary)]">💳 WalletAI</span>
    </div>
    <nav class="flex-1 p-4 space-y-1">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]"
        active-class="!text-[var(--color-text)] bg-[var(--color-surface-2)] !text-[var(--color-primary)]"
      >
        <span class="text-base">{{ item.icon }}</span>
        {{ item.label }}
      </RouterLink>
    </nav>
    <div class="p-4 border-t border-[var(--color-border)]">
      <button
        class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors"
        @click="handleLogout"
      >
        <span>🚪</span> Logout
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const auth = useAuthStore()

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/transactions', label: 'Transactions', icon: '💳' },
  { to: '/statements', label: 'Statements', icon: '📄' },
  { to: '/analytics', label: 'Analytics', icon: '📈' },
]

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>
