<template>
  <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5">
    <div v-if="title" class="mb-4">
      <h3 class="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">{{ title }}</h3>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title?: string }>()
</script>
