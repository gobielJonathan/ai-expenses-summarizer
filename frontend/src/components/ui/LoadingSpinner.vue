<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="flex flex-col items-center gap-3">
      <!-- Dual ring -->
      <div class="relative" :style="ringSize">
        <div class="absolute inset-0 rounded-full animate-spin" :style="outerRing"></div>
        <div class="absolute inset-1 rounded-full animate-spin" :style="innerRing"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="rounded-full" :style="dotStyle"></div>
        </div>
      </div>
      <span v-if="label" class="text-xs font-medium" style="color: #4a5568;">{{ label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label?: string
  size?: 'sm' | 'md' | 'lg'
}>(), { label: 'Loading...', size: 'md' })

const sizeMap = { sm: 24, md: 36, lg: 48 }
const sz = computed(() => sizeMap[props.size])

const containerClass = computed(() => props.size === 'sm' ? 'py-8' : 'py-16')
const ringSize = computed(() => `width: ${sz.value}px; height: ${sz.value}px;`)
const outerRing = computed(() =>
  `width: ${sz.value}px; height: ${sz.value}px; border: 2px solid transparent;
   background: conic-gradient(from 0deg, #6366f1 0deg, transparent 240deg);
   -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px));
   mask: radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px));
   animation: spin 0.85s linear infinite;`
)
const innerRing = computed(() =>
  `background: conic-gradient(from 180deg, #818cf8 0deg, transparent 200deg);
   -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px));
   mask: radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px));
   animation: spin 0.55s linear infinite reverse;`
)
const dotStyle = computed(() => `width: ${sz.value * 0.15}px; height: ${sz.value * 0.15}px; background: #6366f1; border-radius: 99px;`)
</script>
