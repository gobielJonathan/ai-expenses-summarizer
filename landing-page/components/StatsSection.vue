<script setup lang="ts">
import { onMounted } from 'vue'

const { initCounters } = useCounter()

onMounted(() => {
  initCounters()
})

const stats = [
  {
    value: 4,
    suffix: '+',
    label: 'Banks Supported',
    sublabel: 'BCA · Jenius · UOB · BRI',
    iconColor: 'text-primary-400',
    glowClass: 'from-primary-600/20',
    icon: `<path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  {
    value: 100,
    suffix: '%',
    label: 'AI Categorization',
    sublabel: 'Zero manual tagging',
    iconColor: 'text-accent-400',
    glowClass: 'from-accent-500/20',
    icon: `<path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  {
    value: 90,
    suffix: '%',
    label: 'Less Manual Work',
    sublabel: 'More time for life',
    iconColor: 'text-success-400',
    glowClass: 'from-success-500/20',
    icon: `<path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  {
    value: 0,
    suffix: '',
    prefix: '$',
    label: 'Monthly Fee',
    sublabel: 'Self-hosted forever',
    iconColor: 'text-danger-400',
    glowClass: 'from-danger-500/20',
    icon: `<path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
]
</script>

<template>
  <section class="relative py-16 lg:py-20 overflow-hidden">
    <!-- Divider top -->
    <div class="divider-gradient mb-16"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div
          v-for="(stat, i) in stats"
          :key="stat.label"
          :class="['js-reveal', `stagger-${i + 1}`, 'card-animated-border p-6 lg:p-8 text-center group cursor-default']"
        >
          <!-- Icon -->
          <div :class="['relative w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center bg-gradient-to-br', stat.glowClass, 'to-transparent border border-white/8']">
            <svg :class="['w-6 h-6', stat.iconColor]" viewBox="0 0 24 24" fill="none" v-html="stat.icon"></svg>
          </div>

          <!-- Counter -->
          <div class="text-3xl lg:text-4xl font-black text-white mb-1">
            <span
              :data-counter="stat.value"
              :data-prefix="stat.prefix ?? ''"
              :data-suffix="stat.suffix"
            >{{ (stat.prefix ?? '') + stat.value + stat.suffix }}</span>
          </div>

          <!-- Label -->
          <div class="text-sm lg:text-base font-semibold text-white mb-1">{{ stat.label }}</div>
          <div class="text-xs text-muted">{{ stat.sublabel }}</div>
        </div>
      </div>
    </div>

    <!-- Divider bottom -->
    <div class="divider-gradient mt-16"></div>
  </section>
</template>
