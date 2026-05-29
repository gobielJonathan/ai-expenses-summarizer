<template>
  <header class="h-14 flex items-center justify-between px-4 md:px-6 flex-shrink-0 sticky top-0 z-40"
    style="background: rgba(8,12,20,0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255,255,255,0.06);">

    <!-- Left: breadcrumb -->
    <div class="flex items-center gap-2">
      <!-- Mobile menu logo -->
      <div class="md:hidden w-7 h-7 rounded-lg flex items-center justify-center mr-1 flex-shrink-0"
        style="background: linear-gradient(135deg, #6366f1, #4f46e5);">
        <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <!-- Page title -->
      <div class="flex items-center gap-1.5 text-xs" style="color: #4a5568;">
        <span>WalletAI</span>
        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none">
          <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M9 18l6-6-6-6"/>
        </svg>
        <span class="font-semibold capitalize" style="color: #7c8fa8;">{{ pageTitle }}</span>
      </div>
    </div>

    <!-- Right: controls -->
    <div class="flex items-center gap-2">

      <!-- Year selector -->
      <div class="relative hidden sm:block">
        <select
          :value="dashStore.selectedYear"
          class="input-field pr-8 py-1.5 text-xs appearance-none cursor-pointer"
          style="width: auto; padding-left: 10px; padding-right: 28px;"
          @change="dashStore.setYear(+($event.target as HTMLSelectElement).value)"
        >
          <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
        </select>
        <svg class="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
          style="color: #4a5568;" viewBox="0 0 24 24" fill="none">
          <path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>

      <!-- Date -->
      <div class="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
        style="background: rgba(255,255,255,0.04); color: #4a5568;">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.75"/>
          <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
        </svg>
        {{ currentDate }}
      </div>

      <!-- User avatar / Mobile logout -->
      <div v-if="auth.user" class="relative" @click="menuOpen = !menuOpen">
        <button class="flex items-center gap-2 rounded-lg px-2 py-1 transition-all duration-200 cursor-pointer border-0"
          style="background: rgba(255,255,255,0.04);"
          @mouseenter="($event.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'"
          @mouseleave="($event.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'">
          <img
            v-if="auth.user.avatarUrl"
            :src="auth.user.avatarUrl"
            :alt="auth.user.name"
            class="w-6 h-6 rounded-full object-cover"
          />
          <div v-else class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style="background: linear-gradient(135deg, #6366f1, #22d3ee); color: white; font-size: 0.65rem;">
            {{ auth.user.name?.charAt(0) }}
          </div>
          <span class="hidden sm:block text-xs font-medium truncate" style="color: #7c8fa8; max-width: 90px;">
            {{ auth.user.name }}
          </span>
        </button>

        <!-- Dropdown -->
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-1"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-1"
        >
          <div v-if="menuOpen"
            class="absolute right-0 top-full mt-1.5 w-44 rounded-xl overflow-hidden z-50"
            style="background: #111827; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 16px 40px rgba(0,0,0,0.5);">
            <div class="px-3 py-2.5" style="border-bottom: 1px solid rgba(255,255,255,0.06);">
              <p class="text-xs font-semibold text-white truncate">{{ auth.user.name }}</p>
              <p class="text-xs truncate mt-0.5" style="color: #4a5568; font-size: 0.72rem;">{{ auth.user.email }}</p>
            </div>
            <button
              class="w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors cursor-pointer border-0"
              style="background: transparent; color: #4a5568;"
              @click="handleLogout"
              @mouseenter="($event.currentTarget as HTMLElement).style.color = '#ef4444'"
              @mouseleave="($event.currentTarget as HTMLElement).style.color = '#4a5568'"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                  stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Log out
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useDashboardStore } from '@/stores/dashboard.store'
import dayjs from 'dayjs'

const route  = useRoute()
const router = useRouter()
const auth   = useAuthStore()
const dashStore = useDashboardStore()

const menuOpen  = ref(false)
const pageTitle = computed(() => String(route.name ?? 'Dashboard'))
const currentDate = computed(() => dayjs().format('MMM D, YYYY'))

const availableYears = computed(() => {
  const cur = new Date().getFullYear()
  return [cur, cur - 1, cur - 2]
})

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

