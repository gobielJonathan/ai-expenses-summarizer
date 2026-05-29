<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 flex items-stretch safe-area-pb"
    style="background: rgba(8,12,20,0.92); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-top: 1px solid rgba(255,255,255,0.07);">
    <RouterLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-all duration-200 no-underline relative"
      :style="isActive(item.to) ? 'color: #818cf8;' : 'color: #4a5568;'"
    >
      <!-- Active indicator -->
      <div v-if="isActive(item.to)"
        class="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b-full"
        style="background: linear-gradient(90deg, #6366f1, #818cf8);"></div>

      <!-- Icon container -->
      <div class="w-8 h-7 flex items-center justify-center rounded-xl transition-all duration-200"
        :style="isActive(item.to) ? 'background: rgba(99,102,241,0.15);' : ''">
        <component :is="item.icon" class="w-4.5 h-4.5" />
      </div>
      <span class="text-xs font-medium leading-none" style="font-size: 0.68rem;">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { defineComponent, h } from 'vue'

const route = useRoute()

function isActive(path: string) {
  return route.path.startsWith(path)
}

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
  { to: '/dashboard',    label: 'Home',    icon: IconDashboard },
  { to: '/transactions', label: 'Txns',    icon: IconTransactions },
  { to: '/statements',   label: 'Files',   icon: IconStatements },
  { to: '/settings',     label: 'Settings',icon: IconSettings },
]
</script>
