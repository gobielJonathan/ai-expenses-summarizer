<template>
  <div class="card card-glow relative overflow-hidden group animate-fade-up" :style="animDelay">
    <!-- Gradient accent bar -->
    <div class="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" :style="`background: ${accentGradient};`"></div>

    <!-- Glow blob -->
    <div class="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none"
      :style="`background: ${accentColor}; opacity: 0;`"></div>

    <div class="p-4">
      <!-- Label + icon -->
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-semibold uppercase tracking-wider" style="color: #4a5568; letter-spacing: 0.06em;">{{ label }}</span>
        <div v-if="icon" class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          :style="`background: ${accentColor}22;`">
          <svg class="w-3.5 h-3.5" :style="`color: ${accentColor};`" viewBox="0 0 24 24" fill="none" v-html="iconPath"></svg>
        </div>
      </div>

      <!-- Value -->
      <div class="text-xl sm:text-2xl font-bold text-white truncate animate-counter" :key="displayValue">
        {{ displayValue }}
      </div>

      <!-- Subtitle / trend -->
      <div v-if="subtitle" class="mt-1.5 flex items-center gap-1.5">
        <span class="text-xs" style="color: #4a5568;">{{ subtitle }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  value: number
  format?: 'currency' | 'number'
  subtitle?: string
  icon?: 'wallet' | 'tx' | 'category' | 'avg'
  accentIndex?: number
  delay?: number
}>()

const accentPalette = [
  { color: '#6366f1', gradient: 'linear-gradient(90deg, #6366f1, #818cf8)' },
  { color: '#10b981', gradient: 'linear-gradient(90deg, #10b981, #34d399)' },
  { color: '#f59e0b', gradient: 'linear-gradient(90deg, #f59e0b, #fbbf24)' },
  { color: '#22d3ee', gradient: 'linear-gradient(90deg, #22d3ee, #67e8f9)' },
]

const accent = computed(() => accentPalette[(props.accentIndex ?? 0) % accentPalette.length])
const accentColor    = computed(() => accent.value.color)
const accentGradient = computed(() => accent.value.gradient)

const animDelay = computed(() => props.delay ? `animation-delay: ${props.delay}ms` : '')

const iconPaths: Record<string, string> = {
  wallet:   '<path d="M3 10h18M3 6h18M3 14h7m7 0h1m1 4a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12z" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>',
  tx:       '<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>',
  category: '<path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>',
  avg:      '<path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>',
}

const iconPath = computed(() => iconPaths[props.icon ?? 'wallet'] ?? '')

const displayValue = computed(() => {
  if (props.value === 0 && !props.format) return props.subtitle ?? '-'
  if (props.format === 'currency') {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(props.value)
  }
  return new Intl.NumberFormat('id-ID').format(props.value)
})
</script>
