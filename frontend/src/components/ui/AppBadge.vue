<template>
  <span
    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
    :style="badgeStyle"
  >
    <span v-if="dot" class="w-1.5 h-1.5 rounded-full" :style="`background: ${dotColor};`"></span>
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary'
  dot?: boolean
}>()

const palette: Record<string, { bg: string; color: string; dotColor: string }> = {
  success: { bg: 'rgba(16,185,129,0.12)', color: '#34d399', dotColor: '#10b981' },
  warning: { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', dotColor: '#f59e0b' },
  danger:  { bg: 'rgba(239,68,68,0.12)',  color: '#f87171', dotColor: '#ef4444' },
  info:    { bg: 'rgba(34,211,238,0.12)', color: '#67e8f9', dotColor: '#22d3ee' },
  primary: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8', dotColor: '#6366f1' },
  default: { bg: 'rgba(255,255,255,0.07)', color: '#7c8fa8', dotColor: '#4a5568' },
}

const style = computed(() => palette[props.variant ?? 'default'])
const badgeStyle = computed(() => `background: ${style.value.bg}; color: ${style.value.color};`)
const dotColor   = computed(() => style.value.dotColor)
</script>
