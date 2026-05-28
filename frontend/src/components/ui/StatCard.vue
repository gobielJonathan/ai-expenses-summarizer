<template>
  <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 flex flex-col gap-1.5">
    <span class="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide leading-tight">{{ label }}</span>
    <span class="text-xl sm:text-2xl font-bold text-[var(--color-text)] truncate">{{ displayValue }}</span>
    <span v-if="subtitle && !(value === 0 && !format)" class="text-xs text-[var(--color-text-muted)] truncate">{{ subtitle }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  value: number
  format?: 'currency' | 'number'
  subtitle?: string
}>()

const displayValue = computed(() => {
  if (props.value === 0 && !props.format) return props.subtitle ?? '-'
  if (props.format === 'currency') {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(props.value)
  }
  return new Intl.NumberFormat('id-ID').format(props.value)
})
</script>
