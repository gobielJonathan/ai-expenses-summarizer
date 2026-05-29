<template>
  <aside class="w-60 flex-shrink-0 flex flex-col h-screen sticky top-0"
    style="background: linear-gradient(180deg, #0d1421 0%, #080c14 100%); border-right: 1px solid rgba(255,255,255,0.07);">

    <!-- Logo -->
    <div class="px-5 py-4 flex-shrink-0" style="border-bottom: 1px solid rgba(255,255,255,0.06);">
      <RouterLink to="/dashboard" class="flex items-center gap-2.5 no-underline group">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 relative"
          style="background: linear-gradient(135deg, #6366f1, #4f46e5);">
          <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style="background: linear-gradient(135deg, #818cf8, #6366f1);"></div>
        </div>
        <div>
          <div class="text-sm font-bold text-white leading-none">WalletAI</div>
          <div class="text-xs mt-0.5" style="color: #4a5568;">Finance Dashboard</div>
        </div>
      </RouterLink>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-item group"
      >
        <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
          :style="isActive(item.to) ? 'background: rgba(99,102,241,0.2);' : 'background: rgba(255,255,255,0.04);'">
          <component :is="item.icon" class="w-4 h-4" />
        </div>
        <span class="flex-1">{{ item.label }}</span>
        <div v-if="isActive(item.to)"
          class="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style="background: #818cf8;"></div>
      </RouterLink>
    </nav>

    <!-- User profile -->
    <div class="px-3 pb-4 flex-shrink-0 space-y-1" style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px;">
      <!-- User info -->
      <div v-if="auth.user" class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-1"
        style="background: rgba(255,255,255,0.03);">
        <img
          v-if="auth.user.avatarUrl"
          :src="auth.user.avatarUrl"
          :alt="auth.user.name"
          class="w-7 h-7 rounded-full flex-shrink-0 object-cover"
        />
        <div v-else class="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
          style="background: linear-gradient(135deg, #6366f1, #22d3ee); color: white;">
          {{ auth.user.name?.charAt(0) ?? 'U' }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-xs font-semibold text-white truncate leading-none mb-0.5">{{ auth.user.name }}</div>
          <div class="text-xs truncate" style="color: #4a5568; font-size: 0.72rem;">{{ auth.user.email }}</div>
        </div>
      </div>

      <!-- Logout -->
      <button
        class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 cursor-pointer"
        style="color: #4a5568; background: transparent; border: none;"
        @mouseenter="($event.currentTarget as HTMLElement).style.color = '#ef4444'"
        @mouseleave="($event.currentTarget as HTMLElement).style.color = '#4a5568'"
        @click="handleLogout"
      >
        <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Log out</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { defineComponent, h } from 'vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

function isActive(path: string) {
  return route.path.startsWith(path)
}

// SVG icon components
const IconDashboard = defineComponent({
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', 'stroke-width': '1.75', stroke: 'currentColor' }, [
    h('rect', { x: '3', y: '3', width: '7', height: '7', rx: '1.5' }),
    h('rect', { x: '14', y: '3', width: '7', height: '7', rx: '1.5' }),
    h('rect', { x: '3', y: '14', width: '7', height: '7', rx: '1.5' }),
    h('rect', { x: '14', y: '14', width: '7', height: '7', rx: '1.5' }),
  ])
})

const IconTransactions = defineComponent({
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', 'stroke-width': '1.75', stroke: 'currentColor' }, [
    h('path', { d: 'M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
  ])
})

const IconStatements = defineComponent({
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', 'stroke-width': '1.75', stroke: 'currentColor' }, [
    h('path', { d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
  ])
})

const IconSettings = defineComponent({
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', 'stroke-width': '1.75', stroke: 'currentColor' }, [
    h('path', { d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
  ])
})

const navItems = [
  { to: '/dashboard',    label: 'Dashboard',     icon: IconDashboard },
  { to: '/transactions', label: 'Transactions',  icon: IconTransactions },
  { to: '/statements',   label: 'Statements',    icon: IconStatements },
  { to: '/settings',     label: 'Settings',      icon: IconSettings },
]

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

