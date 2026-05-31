<template>
  <div class="relative">

    <!-- Greeting header -->
    <div class="flex items-center justify-between mb-5 animate-fade-up">
      <div>
        <h1 class="text-base font-bold text-white">Hi, {{ firstName }}! 👋</h1>
        <p class="text-[11px] mt-0.5" style="color: #4a5568;">{{ currentMonthYear }}</p>
      </div>
    </div>

    <LoadingSpinner v-if="store.loading" />
    <ErrorMessage v-else-if="store.error" :message="store.error" :onRetry="store.fetchAll" />

    <template v-else-if="store.data">

      <!-- Available Funds hero -->
      <div class="rounded-2xl p-5 mb-5 animate-fade-up delay-75 relative overflow-hidden"
        style="background: linear-gradient(135deg, #3730a3 0%, #6366f1 55%, #818cf8 100%);">
        <div class="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
          style="background: rgba(255,255,255,0.07);"></div>
        <div class="absolute -bottom-8 -left-8 w-32 h-32 rounded-full pointer-events-none"
          style="background: rgba(0,0,0,0.15);"></div>

        <p class="text-[10px] font-semibold uppercase tracking-widest mb-1 relative z-10"
          style="color: rgba(255,255,255,0.65);">Available Funds</p>
        <p class="text-2xl font-extrabold text-white mb-4 relative z-10 leading-tight">
          {{ formatCurrency(availableFunds) }}
        </p>

        <!-- Income / Expense chips -->
        <div class="flex gap-2.5 mb-5 relative z-10">
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white"
            style="background: rgba(255,255,255,0.18);">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-[11px] font-semibold">{{ formatShort(totalCredit) }}</span>
          </div>
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white"
            style="background: rgba(0,0,0,0.22);">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none">
              <path d="M17 7L7 17M7 17H17M7 17V7" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-[11px] font-semibold">{{ formatShort(totalDebit) }}</span>
          </div>
        </div>

        <!-- Weekly spending line chart -->
        <div class="relative z-10">
          <p class="text-[10px] font-medium mb-2" style="color: rgba(255,255,255,0.55);">Weekly Spending</p>
          <svg viewBox="0 0 280 48" preserveAspectRatio="none" class="w-full" style="height:52px;overflow:visible;">
            <defs>
              <linearGradient id="wkAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="rgba(255,255,255,0.22)" />
                <stop offset="100%" stop-color="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            <path :d="areaPath" fill="url(#wkAreaGrad)" />
            <path :d="linePath" fill="none" stroke="rgba(255,255,255,0.88)" stroke-width="1.8" stroke-linecap="round" />
            <circle
              v-for="(pt, i) in chartPoints" :key="i"
              :cx="pt.x" :cy="pt.y"
              :r="pt.isToday ? 3.5 : 2"
              :fill="pt.isToday ? 'white' : 'rgba(255,255,255,0.45)'"
              :style="pt.isToday ? 'filter:drop-shadow(0 0 5px rgba(255,255,255,0.9))' : ''"
            />
          </svg>
          <div class="flex justify-between mt-1.5">
            <span v-for="(bar, i) in weeklyBars" :key="i"
              class="text-[9px] font-medium"
              :style="bar.isToday ? 'color:rgba(255,255,255,0.95);font-weight:700;' : 'color:rgba(255,255,255,0.42);'"
            >{{ bar.label }}</span>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="mb-5 animate-fade-up delay-150">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xs font-bold text-white">Recent Activity</h2>
          <RouterLink to="/transactions" class="text-[11px] font-medium no-underline"
            style="color: #818cf8;">See all →</RouterLink>
        </div>
        <LoadingSpinner v-if="txStore.loading" size="sm" />
        <div v-else class="space-y-2">
          <div v-for="tx in recentTransactions" :key="tx.id"
            class="flex items-center gap-3 p-3 rounded-xl"
            style="background: var(--color-surface);">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
              :style="`background: ${getCategoryBg(tx.category)};`">
              {{ getCategoryEmoji(tx.category) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-white truncate">{{ tx.merchant }}</p>
              <p class="text-[10px] mt-0.5" style="color: #4a5568;">
                {{ tx.category || 'Uncategorized' }} · {{ relativeTime(tx.transaction_date) }}
              </p>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="text-xs font-bold"
                :style="tx.payment_type === 'CREDIT' ? 'color: #10b981;' : 'color: #f1f5f9;'">
                {{ tx.payment_type === 'CREDIT' ? '+' : '-' }}{{ formatShort(tx.amount) }}
              </p>
              <span class="text-[10px]" style="color: #4a5568;">{{ tx.bank_type }}</span>
            </div>
          </div>
          <div v-if="!recentTransactions.length"
            class="py-8 text-center text-xs rounded-xl"
            style="background: var(--color-surface); color: #4a5568;">
            No recent transactions
          </div>
        </div>
      </div>

      <!-- Budget Progress -->
      <div class="mb-6 animate-fade-up delay-200">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xs font-bold text-white">Budget Progress</h2>
          <RouterLink to="/analytics" class="text-[11px] font-medium no-underline"
            style="color: #818cf8;">See all →</RouterLink>
        </div>
        <div class="rounded-2xl overflow-hidden" style="background: var(--color-surface);">
          <div v-for="(cat, idx) in topCategories" :key="cat.category"
            class="px-4 py-3.5"
            :style="idx < topCategories.length - 1 ? 'border-bottom: 1px solid rgba(255,255,255,0.05);' : ''">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm"
                :style="`background: ${getCategoryBg(cat.category)};`">
                {{ getCategoryEmoji(cat.category) }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-[11px] font-semibold text-white capitalize">{{ cat.category }}</span>
                  <span class="text-[11px] font-bold" :style="`color: ${budgetPctColor(cat.percentage)};`">
                    {{ cat.percentage.toFixed(0) }}%
                  </span>
                </div>
                <div class="progress-bar" style="height: 6px;">
                  <div class="progress-fill"
                    :style="`width: ${cat.percentage}%; background: linear-gradient(90deg, ${categoryColors[idx % categoryColors.length]}, ${categoryColorsLight[idx % categoryColorsLight.length]}); animation-delay: ${idx * 80}ms;`">
                  </div>
                </div>
                <p class="text-[10px] mt-1.5" style="color: #4a5568;">
                  {{ formatCurrency(cat.amount) }} of total spend
                </p>
              </div>
            </div>
          </div>
          <div v-if="!topCategories.length" class="py-8 text-center text-xs" style="color: #4a5568;">
            No category data
          </div>
        </div>
      </div>

    </template>

    <!-- Empty state -->
    <template v-else>
      <div class="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center"
          style="background: rgba(99,102,241,0.1);">
          <svg class="w-6 h-6" style="color: #6366f1;" viewBox="0 0 24 24" fill="none">
            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="text-center">
          <p class="text-sm font-semibold text-white mb-1">No data yet</p>
          <p class="text-xs" style="color: #4a5568;">Upload a bank statement to get started</p>
        </div>
      </div>
    </template>

    <!-- FAB -->
    <FABButton :open="showActions" @click="toggleActions" />

    <!-- Backdrop -->
    <Transition name="fab-backdrop">
      <div
        v-if="showActions"
        class="fixed inset-0 z-40"
        style="background:rgba(4,6,10,0.72);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);"
        @click="showActions = false"
      />
    </Transition>

    <!-- Speed dial: Add Transaction (top, farther from FAB) -->
    <Transition name="fab-opt-b">
      <button
        v-if="showActions"
        class="fab-speed-opt"
        style="bottom:208px;"
        @click="goToAddTransaction"
      >
        <span class="fab-opt-label">Add Transaction</span>
        <div class="fab-opt-circle" style="background:linear-gradient(135deg,#4f46e5,#6366f1);box-shadow:0 6px 20px rgba(99,102,241,0.5);">
          <svg style="width:20px;height:20px;color:white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 5v14M5 12h14" stroke-linecap="round"/>
          </svg>
        </div>
      </button>
    </Transition>

    <!-- Speed dial: Set Budget (bottom, closer to FAB) -->
    <Transition name="fab-opt-a">
      <button
        v-if="showActions"
        class="fab-speed-opt"
        style="bottom:144px;"
        @click="goToBudget"
      >
        <span class="fab-opt-label">Set Budget</span>
        <div class="fab-opt-circle" style="background:linear-gradient(135deg,#059669,#10b981);box-shadow:0 6px 20px rgba(16,185,129,0.45);">
          <svg style="width:20px;height:20px;color:white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M9 14l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </button>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '@/stores/dashboard.store'
import { useTransactionStore } from '@/stores/transaction.store'
import { useAuthStore } from '@/stores/auth.store'
import dayjs from 'dayjs'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'
import FABButton from '@/components/ui/FABButton.vue'

const store   = useDashboardStore()
const txStore = useTransactionStore()
const auth    = useAuthStore()
const router  = useRouter()

const showActions = ref(false)
function toggleActions() { showActions.value = !showActions.value }
function goToAddTransaction() { showActions.value = false; router.push('/add-transaction') }
function goToBudget() { showActions.value = false; router.push('/budget') }

const categoryColors      = ['#6366f1', '#10b981', '#f59e0b', '#22d3ee', '#f87171']
const categoryColorsLight = ['#818cf8', '#34d399', '#fbbf24', '#67e8f9', '#fca5a5']

const todayIndex       = (dayjs().day() + 6) % 7
const currentMonthYear = dayjs().format('MMMM YYYY')
const firstName        = computed(() => auth.user?.name?.split(' ')[0] ?? 'there')

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
  }).format(value)
}

function formatShort(value: number): string {
  if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000)     return `Rp ${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000)         return `Rp ${(value / 1_000).toFixed(0)}K`
  return `Rp ${value}`
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7)  return `${days}d ago`
  return dayjs(dateStr).format('DD MMM')
}

const totalCredit    = computed(() => store.data?.byPaymentType.credit ?? 0)
const totalDebit     = computed(() => store.data?.byPaymentType.debit  ?? 0)
const availableFunds = computed(() => totalCredit.value - totalDebit.value)

const weeklyBars = computed(() => {
  const daily  = store.data?.daily ?? []
  const maxVal = Math.max(...daily.map((d) => d.amount), 1)
  return ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((label, i) => ({
    label,
    heightPct: Math.round(((daily[i]?.amount ?? 0) / maxVal) * 100),
    isToday: i === todayIndex,
  }))
})

function bezierSegs(pts: { x: number; y: number }[]): string {
  let d = ''
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(i + 2, pts.length - 1)]
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`
  }
  return d
}

const chartPoints = computed(() => {
  const W = 280, H = 48, top = 6
  const bars = weeklyBars.value
  const step = bars.length > 1 ? W / (bars.length - 1) : W
  return bars.map((b, i) => ({
    x: i * step,
    y: top + (1 - Math.max(b.heightPct, 2) / 100) * (H - top),
    isToday: b.isToday,
    label: b.label,
  }))
})

const linePath = computed(() => {
  const pts = chartPoints.value
  if (!pts.length) return ''
  return `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}${bezierSegs(pts)}`
})

const areaPath = computed(() => {
  const pts = chartPoints.value
  if (pts.length < 2) return ''
  const last = pts[pts.length - 1]
  return `M ${pts[0].x.toFixed(1)},48 L ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}${bezierSegs(pts)} L ${last.x.toFixed(1)},48 Z`
})

const recentTransactions = computed(() => txStore.result?.data.slice(0, 5) ?? [])
const topCategories      = computed(() => store.data?.topCategories.slice(0, 4) ?? [])

function getCategoryEmoji(category: string): string {
  const c = (category ?? '').toLowerCase()
  if (c.includes('food') || c.includes('beverage') || c.includes('eat') || c.includes('restaurant') || c.includes('cafe')) return '🍔'
  if (c.includes('transport') || c.includes('travel') || c.includes('ride') || c.includes('fuel') || c.includes('grab') || c.includes('gojek')) return '🚗'
  if (c.includes('health') || c.includes('medical') || c.includes('pharma') || c.includes('doctor')) return '💊'
  if (c.includes('shop') || c.includes('retail') || c.includes('fashion') || c.includes('cloth')) return '🛍️'
  if (c.includes('entertainment') || c.includes('leisure') || c.includes('movie') || c.includes('game') || c.includes('streaming')) return '🎬'
  if (c.includes('bill') || c.includes('utility') || c.includes('electric') || c.includes('internet')) return '💡'
  if (c.includes('grocery') || c.includes('market') || c.includes('supermarket')) return '🛒'
  if (c.includes('edu') || c.includes('school') || c.includes('course') || c.includes('book')) return '📚'
  return '💳'
}

function getCategoryBg(category: string): string {
  const c = (category ?? '').toLowerCase()
  if (c.includes('food') || c.includes('beverage') || c.includes('eat') || c.includes('restaurant')) return 'rgba(245,158,11,0.15)'
  if (c.includes('transport') || c.includes('travel') || c.includes('ride')) return 'rgba(99,102,241,0.15)'
  if (c.includes('health') || c.includes('medical')) return 'rgba(16,185,129,0.15)'
  if (c.includes('shop') || c.includes('retail') || c.includes('fashion')) return 'rgba(244,114,182,0.15)'
  if (c.includes('entertainment') || c.includes('leisure') || c.includes('movie')) return 'rgba(34,211,238,0.15)'
  if (c.includes('grocery') || c.includes('market')) return 'rgba(52,211,153,0.12)'
  return 'rgba(255,255,255,0.07)'
}

function budgetPctColor(pct: number): string {
  if (pct >= 80) return '#ef4444'
  if (pct >= 50) return '#f59e0b'
  return '#10b981'
}

onMounted(() => {
  if (!store.data) store.fetchAll()
  if (!txStore.result) {
    txStore.filters.limit    = 5
    txStore.filters.sort_by  = 'transaction_date'
    txStore.filters.sort_dir = 'desc'
    txStore.fetch()
  }
})
</script>

<style scoped>
/* ── Backdrop ─────────────────────────────────────────────── */
.fab-backdrop-enter-active, .fab-backdrop-leave-active { transition: opacity 0.22s ease; }
.fab-backdrop-enter-from, .fab-backdrop-leave-to { opacity: 0; }

/* ── Speed dial option A (Set Budget — bottom/closest) ────── */
/* enters last (60ms delay), leaves first (0ms delay) */
.fab-opt-a-enter-active {
  transition: opacity 0.34s cubic-bezier(0.34,1.56,0.64,1), transform 0.34s cubic-bezier(0.34,1.56,0.64,1);
  transition-delay: 0ms;
}
.fab-opt-a-leave-active {
  transition: opacity 0.18s ease-in, transform 0.18s ease-in;
  transition-delay: 60ms;
}
.fab-opt-a-enter-from, .fab-opt-a-leave-to { opacity: 0; transform: translateY(22px) scale(0.72); }

/* ── Speed dial option B (Add Transaction — top/farther) ─── */
/* enters first (60ms delay means it completes after A which has 0ms), leaves last */
/* Actually: A enters with 0ms delay (pops up first from FAB position),
   B enters with 60ms delay (pops up second, higher) — bottom-to-top reveal */
.fab-opt-b-enter-active {
  transition: opacity 0.34s cubic-bezier(0.34,1.56,0.64,1), transform 0.34s cubic-bezier(0.34,1.56,0.64,1);
  transition-delay: 65ms;
}
.fab-opt-b-leave-active {
  transition: opacity 0.18s ease-in, transform 0.18s ease-in;
  transition-delay: 0ms;
}
.fab-opt-b-enter-from, .fab-opt-b-leave-to { opacity: 0; transform: translateY(22px) scale(0.72); }

/* ── Progress bar ─────────────────────────────────────────── */
.progress-bar {
  background: rgba(255,255,255,0.07);
  border-radius: 9999px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 9999px;
  animation: growBar 0.6s cubic-bezier(0.34,1.2,0.64,1) both;
}
@keyframes growBar { from { width: 0 !important; } }
</style>
