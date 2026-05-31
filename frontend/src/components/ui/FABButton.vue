<template>
  <button
    class="fab-button w-14 h-14 rounded-full flex items-center justify-center border-0 cursor-pointer"
    :style="`background: linear-gradient(135deg, #6366f1, #4f46e5); box-shadow: 0 8px 24px rgba(99,102,241,0.45), 0 2px 8px rgba(0,0,0,0.3); transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1); transform: rotate(${open ? 45 : 0}deg);`"
    @click="$emit('click')"
    aria-label="Add transaction"
  >
    <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
defineProps<{ open?: boolean }>()
defineEmits<{ click: [] }>()
</script>
