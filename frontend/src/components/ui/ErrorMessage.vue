<template>
  <div class="flex items-center justify-center py-16">
    <div class="flex flex-col items-center gap-2 text-center">
      <span class="text-3xl">⚠️</span>
      <p class="text-sm text-[var(--color-danger)]">{{ message }}</p>
      <button
        v-if="onRetry"
        class="mt-2 px-4 py-1.5 text-sm rounded-lg bg-[var(--color-surface-2)] hover:bg-[var(--color-border)] transition-colors"
        @click="onRetry"
      >
        Retry
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ message: string; onRetry?: () => void }>()
</script>
