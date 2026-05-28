<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-surface)] border-t border-[var(--color-border)] flex items-stretch safe-area-pb">
    <RouterLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="flex-1 flex flex-col items-center justify-center gap-1 py-2 text-xs text-[var(--color-text-muted)] transition-colors"
      active-class="!text-[var(--color-primary)]"
    >
      <span class="text-xl leading-none">{{ item.icon }}</span>
      <span class="font-medium">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/transactions', label: 'Txns', icon: '💳' },
  { to: '/statements', label: 'Statements', icon: '📄' },
  { to: '/analytics', label: 'Analytics', icon: '📈' },
]
</script>
