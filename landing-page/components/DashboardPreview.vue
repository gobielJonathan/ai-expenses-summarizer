<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)
const mockupOffset = ref(0)
let ticking = false

const onScroll = () => {
  if (!sectionRef.value) return
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const rect = sectionRef.value!.getBoundingClientRect()
      const viewportH = window.innerHeight
      const progress = (viewportH - rect.top) / (viewportH + rect.height)
      mockupOffset.value = Math.max(-30, Math.min(30, (progress - 0.5) * -60))
      ticking = false
    })
    ticking = true
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

const navItems = ['Dashboard', 'Transactions', 'Analytics', 'Statements', 'Settings']
const metrics = [
  { label: 'Total Spending', value: 'Rp 4.2M', change: '+12%', up: false },
  { label: 'Transactions', value: '47', change: '+8', up: true },
  { label: 'Top Category', value: 'Food & Bev', change: 'Rp 1.1M', up: false },
]
</script>

<template>
  <section id="dashboard" ref="sectionRef" class="relative py-20 lg:py-28 overflow-hidden">

    <!-- Background -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-accent-500/8 blur-3xl -translate-y-1/2"></div>
      <div class="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-primary-600/8 blur-3xl"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="text-center mb-14 js-reveal">
        <div class="section-label mb-4 mx-auto">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
          </svg>
          Dashboard preview
        </div>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
          Beautiful analytics, <span class="text-gradient-static">zero setup</span>
        </h2>
        <p class="text-lg text-muted max-w-2xl mx-auto">
          Every chart updates automatically as transactions flow in. Filter by bank, date range, category — your financial story told visually.
        </p>
      </div>

      <!-- Dashboard mockup with parallax -->
      <div
        class="js-reveal"
        :style="{ transform: `translateY(${mockupOffset}px)`, transition: 'transform 0.1s ease-out' }"
      >
        <div class="mockup-browser max-w-5xl mx-auto">
          <!-- Browser chrome -->
          <div class="mockup-titlebar">
            <div class="flex gap-1.5">
              <div class="w-3 h-3 rounded-full bg-danger-500/70"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500/70"></div>
              <div class="w-3 h-3 rounded-full bg-success-500/70"></div>
            </div>
            <div class="flex-1 mx-4">
              <div class="h-5 w-48 mx-auto rounded bg-white/6 flex items-center justify-center">
                <span class="text-xs text-muted">localhost:5173/dashboard</span>
              </div>
            </div>
          </div>

          <!-- App layout -->
          <div class="flex h-[480px] lg:h-[600px]">

            <!-- Sidebar -->
            <div class="hidden sm:flex w-48 lg:w-56 flex-shrink-0 flex-col border-r border-white/6 bg-card/50 p-4">
              <!-- Logo -->
              <div class="flex items-center gap-2 mb-6">
                <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500"></div>
                <span class="text-sm font-bold text-white">WalletAI</span>
              </div>
              <!-- Nav items -->
              <div class="flex flex-col gap-1">
                <div
                  v-for="(item, i) in navItems"
                  :key="item"
                  :class="[
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                    i === 0
                      ? 'bg-primary-600/20 text-primary-300 border border-primary-500/20'
                      : 'text-muted hover:text-white'
                  ]"
                >
                  <div :class="['w-1.5 h-1.5 rounded-full', i === 0 ? 'bg-primary-400' : 'bg-subtle']"></div>
                  {{ item }}
                </div>
              </div>
            </div>

            <!-- Main content -->
            <div class="flex-1 overflow-hidden p-4 lg:p-6 bg-surface/50">

              <!-- Header row -->
              <div class="flex items-center justify-between mb-5">
                <div>
                  <div class="h-5 w-32 rounded bg-white/10 mb-1.5"></div>
                  <div class="h-3 w-24 rounded bg-white/5"></div>
                </div>
                <div class="flex gap-2">
                  <div class="h-7 w-20 rounded-lg bg-white/6 border border-white/8"></div>
                  <div class="h-7 w-16 rounded-lg bg-primary-600/30 border border-primary-500/30"></div>
                </div>
              </div>

              <!-- Metric cards -->
              <div class="grid grid-cols-3 gap-3 mb-5">
                <div
                  v-for="m in metrics"
                  :key="m.label"
                  class="glass-light rounded-xl p-3"
                >
                  <div class="text-xs text-muted mb-1">{{ m.label }}</div>
                  <div class="text-sm lg:text-base font-bold text-white">{{ m.value }}</div>
                  <div :class="['text-xs mt-0.5', m.up ? 'text-success-400' : 'text-danger-400']">
                    {{ m.change }}
                  </div>
                </div>
              </div>

              <!-- Charts row -->
              <div class="grid grid-cols-5 gap-3 mb-4">
                <!-- Bar chart placeholder -->
                <div class="col-span-3 glass-light rounded-xl p-3">
                  <div class="text-xs text-muted mb-3">Monthly Spending</div>
                  <div class="flex items-end gap-1 h-20 lg:h-28">
                    <div
                      v-for="(h, i) in [40, 65, 55, 80, 60, 90, 70, 85, 55, 75, 95, 68]"
                      :key="i"
                      :style="{ height: `${h}%` }"
                      :class="[
                        'flex-1 rounded-t-sm transition-all duration-300',
                        i === 10
                          ? 'bg-gradient-to-t from-primary-600 to-primary-400'
                          : 'bg-white/10 hover:bg-white/20'
                      ]"
                    ></div>
                  </div>
                  <div class="flex justify-between mt-1">
                    <span v-for="m in ['J','F','M','A','M','J','J','A','S','O','N','D']" :key="m"
                      class="text-xs text-subtle" style="font-size:0.6rem">{{ m }}</span>
                  </div>
                </div>

                <!-- Donut chart placeholder -->
                <div class="col-span-2 glass-light rounded-xl p-3">
                  <div class="text-xs text-muted mb-2">Categories</div>
                  <div class="flex items-center justify-center h-20 lg:h-28 relative">
                    <svg viewBox="0 0 80 80" class="w-16 h-16 lg:w-20 lg:h-20 -rotate-90">
                      <circle cx="40" cy="40" r="28" fill="none" stroke="#1e1e3f" stroke-width="12"/>
                      <circle cx="40" cy="40" r="28" fill="none" stroke="#6366f1" stroke-width="12"
                        stroke-dasharray="63 113" stroke-linecap="round"/>
                      <circle cx="40" cy="40" r="28" fill="none" stroke="#22d3ee" stroke-width="12"
                        stroke-dasharray="34 142" stroke-dashoffset="-63" stroke-linecap="round"/>
                      <circle cx="40" cy="40" r="28" fill="none" stroke="#10b981" stroke-width="12"
                        stroke-dasharray="20 156" stroke-dashoffset="-97" stroke-linecap="round"/>
                    </svg>
                    <div class="absolute inset-0 flex items-center justify-center">
                      <div class="text-center">
                        <div class="text-sm font-bold text-white">47</div>
                        <div class="text-xs text-muted" style="font-size:0.6rem">txns</div>
                      </div>
                    </div>
                  </div>
                  <!-- Legend -->
                  <div class="flex flex-col gap-1 mt-1">
                    <div v-for="(cat, color) in {'Food & Bev': '#6366f1', 'Transport': '#22d3ee', 'Other': '#10b981'}"
                      :key="cat"
                      class="flex items-center gap-1.5 text-xs text-muted">
                      <div class="w-2 h-2 rounded-full flex-shrink-0" :style="{ background: color }"></div>
                      {{ cat }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Transaction table preview -->
              <div class="glass-light rounded-xl overflow-hidden">
                <div class="px-3 py-2 border-b border-white/6 flex justify-between">
                  <span class="text-xs font-semibold text-white">Recent Transactions</span>
                  <span class="text-xs text-primary-400">View all →</span>
                </div>
                <div
                  v-for="(tx, i) in [
                    { name: 'Starbucks', bank: 'BCA', cat: 'Food & Bev', amt: '-Rp 45.000', catColor: 'bg-orange-500/20 text-orange-300' },
                    { name: 'GrabCar', bank: 'Jenius', cat: 'Transport', amt: '-Rp 28.000', catColor: 'bg-cyan-500/20 text-cyan-300' },
                    { name: 'Netflix', bank: 'UOB', cat: 'Entertainment', amt: '-Rp 169.000', catColor: 'bg-purple-500/20 text-purple-300' },
                  ]"
                  :key="tx.name"
                  :class="['flex items-center justify-between px-3 py-2 text-xs', i < 2 ? 'border-b border-white/5' : '']"
                >
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                      {{ tx.name[0] }}
                    </div>
                    <div>
                      <div class="text-white font-medium">{{ tx.name }}</div>
                      <div class="text-subtle text-xs" style="font-size:0.65rem">{{ tx.bank }}</div>
                    </div>
                  </div>
                  <span :class="['px-1.5 py-0.5 rounded text-xs', tx.catColor]">{{ tx.cat }}</span>
                  <span class="text-danger-400 font-semibold">{{ tx.amt }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Feature pills -->
      <div class="flex flex-wrap gap-3 justify-center mt-10 js-reveal">
        <div
          v-for="pill in ['Monthly Trends', 'Daily Spending', 'Top 10 Categories', 'Bank Breakdown', 'Debit vs Credit', 'Transaction History', 'Statement Archive', 'AI Insights']"
          :key="pill"
          class="px-4 py-2 rounded-full glass-light border border-white/8 text-sm text-muted hover:text-white hover:border-primary-500/40 transition-all duration-200 cursor-default"
        >
          {{ pill }}
        </div>
      </div>
    </div>
  </section>
</template>
