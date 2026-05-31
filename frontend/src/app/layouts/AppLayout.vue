<template>
  <!-- Outer: full-screen dark bg to fill space outside the phone frame on desktop -->
  <div class="min-h-screen" style="background: #04060a;">
    <!-- Phone frame: max 375px centered on desktop, full-width on mobile -->
    <div class="phone-frame mx-auto w-full max-w-[375px] min-h-screen flex flex-col">
      <AppHeader />
      <main class="flex-1 px-4 pt-4 pb-24 overflow-auto">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>

    <!-- Bottom nav: always visible, centered at 375px via its own CSS -->
    <AppBottomNav />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import AppHeader from './AppHeader.vue'
import AppBottomNav from './AppBottomNav.vue'

const auth = useAuthStore()
onMounted(() => { auth.fetchUser() })
</script>
