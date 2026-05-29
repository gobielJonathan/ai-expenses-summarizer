<template>
  <div class="flex items-center justify-center py-16">
    <div class="flex flex-col items-center gap-3 text-center max-w-xs">
      <div class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style="background: rgba(239,68,68,0.1);">
        <svg class="w-5 h-5" style="color: #ef4444;" viewBox="0 0 24 24" fill="none">
          <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div>
        <p class="text-sm font-semibold text-white mb-1">Something went wrong</p>
        <p class="text-xs" style="color: #4a5568;">{{ message }}</p>
      </div>
      <button
        v-if="onRetry"
        class="btn btn-ghost text-xs mt-1"
        @click="onRetry"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
          <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Try again
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ message: string; onRetry?: () => void }>()
</script>
