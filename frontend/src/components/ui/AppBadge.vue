<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
    :class="colorClass"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ label: string; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' }>()

const colorClass = computed(() => {
  const map: Record<string, string> = {
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    danger: 'bg-red-500/20 text-red-400',
    info: 'bg-blue-500/20 text-blue-400',
    default: 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]',
  }
  return map[props.variant ?? 'default']
})
</script>
