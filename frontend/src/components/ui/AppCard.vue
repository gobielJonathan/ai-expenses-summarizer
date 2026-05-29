<template>
  <div class="card relative overflow-hidden transition-all duration-200" :class="{ 'card-glow': glow }">
    <!-- Optional header -->
    <div v-if="title || $slots.actions"
      class="flex items-center justify-between px-5 pt-4 pb-3"
      style="border-bottom: 1px solid rgba(255,255,255,0.05);">
      <h3 v-if="title" class="text-xs font-semibold uppercase tracking-wider" style="color: #4a5568; letter-spacing: 0.07em;">{{ title }}</h3>
      <slot name="actions" />
    </div>
    <!-- Body -->
    <div :class="padded !== false ? 'p-5' : ''">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title?: string; glow?: boolean; padded?: boolean }>()
</script>
