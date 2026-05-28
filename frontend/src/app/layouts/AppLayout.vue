<template>
  <div class="min-h-screen flex bg-[var(--color-bg)]">
    <!-- Desktop sidebar -->
    <AppSidebar class="hidden md:flex" />

    <div class="flex-1 flex flex-col min-w-0">
      <AppHeader />
      <main class="flex-1 p-4 md:p-6 overflow-auto pb-20 md:pb-6">
        <RouterView />
      </main>
    </div>

    <!-- Mobile bottom nav -->
    <AppBottomNav class="md:hidden" />
  </div>
</template>

<script setup lang="ts">
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import AppBottomNav from './AppBottomNav.vue'
</script>
