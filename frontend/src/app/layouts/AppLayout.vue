<template>
  <div class="min-h-screen flex" style="background: var(--color-bg);">
    <!-- Desktop sidebar -->
    <AppSidebar class="hidden md:flex" />

    <div class="flex-1 flex flex-col min-w-0">
      <AppHeader />
      <main class="flex-1 overflow-auto p-4 md:p-6 pb-24 md:pb-6">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
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
