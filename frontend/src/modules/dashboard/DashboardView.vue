<template>
  <div>

    <!-- Page header -->
    <div class="mb-6 animate-fade-up">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-lg font-bold text-white">Overview</h1>
          <p class="text-xs mt-0.5" style="color: #4a5568;">
            Financial summary for {{ store.selectedYear }}
          </p>
        </div>
        <p v-if="syncError" class="text-xs mt-1" style="color:#f87171">{{ syncError }}</p>
      </div>
    </div>

    <!-- Loading state -->
    <LoadingSpinner v-if="store.loading" />
    <ErrorMessage v-else-if="store.error" :message="store.error" :onRetry="store.fetchAll" />

    <template v-else-if="store.data">

      <!-- ── Stat cards ─────────────────────────────────── -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Total Spent"
          :value="totalSpent"
          format="currency"
          subtitle="This year"
          icon="wallet"
          :accentIndex="0"
          :delay="0"
        />
        <StatCard
          label="Transactions"
          :value="totalTransactions"
          format="number"
          subtitle="This year"
          icon="tx"
          :accentIndex="1"
          :delay="75"
        />
        <StatCard
          label="Top Category"
          :value="0"
          :subtitle="topCategory"
          icon="category"
          :accentIndex="2"
          :delay="150"
        />
        <StatCard
          label="Avg / Month"
          :value="avgPerMonth"
          format="currency"
          icon="avg"
          :accentIndex="3"
          :delay="225"
        />
      </div>

      <!-- ── Monthly chart ───────────────────────────────── -->
      <AppCard class="mb-4 animate-fade-up delay-200" :glow="true" :padded="false">
        <template #actions>
          <span class="text-xs font-semibold text-white">{{ store.selectedYear }}</span>
        </template>
        <template #default>
          <div class="p-5 pt-0">
            <!-- Mini bar chart rendered as SVG sparks if no unovis data yet -->
            <LineChart
              :data="monthlyChartData"
              :numTicks="12"
              :xTickFormat="(v) => months[Number(v)] ?? ''"
              :tooltipTemplate="(d) => `${d.x}: ${formatCurrency(d.y)}`"
            />
          </div>
        </template>
      </AppCard>

      <!-- ── Row: weekday + debit/credit ───────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

        <AppCard title="Spending by Weekday" :glow="true" :padded="false" class="animate-fade-up delay-300">
          <template #default>
            <div class="p-5 pt-0">
              <BarChart
                :data="dailyChartData"
                :yKeys="['y']"
                :xTickFormat="(_, i) => days[i as number] ?? ''"
              />
            </div>
          </template>
        </AppCard>

        <AppCard title="Debit vs Credit" :glow="true" :padded="false" class="animate-fade-up delay-300">
          <template #default>
            <div class="p-5 pt-0">
              <div class="flex flex-col sm:flex-row items-center gap-5">
                <DonutChart :data="paymentTypeData" :height="170" />
                <div class="space-y-3 w-full flex-1">
                  <div v-for="(item, idx) in paymentTypeData" :key="item.label"
                    class="flex items-center justify-between p-3 rounded-xl"
                    :style="`background: ${idx === 0 ? 'rgba(99,102,241,0.08)' : 'rgba(16,185,129,0.08)'};`">
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full" :style="`background: ${idx === 0 ? '#6366f1' : '#10b981'};`"></div>
                      <span class="text-xs font-medium" style="color: #7c8fa8;">{{ item.label }}</span>
                    </div>
                    <span class="text-xs font-bold text-white">{{ formatCurrency(item.value) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </AppCard>

      </div>

      <!-- ── Row: top categories + bank breakdown ───────── -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

        <!-- Top categories -->
        <AppCard title="Top Categories" :glow="true" :padded="false" class="animate-fade-up delay-400">
          <template #default>
            <div class="px-5 pb-5 pt-1 space-y-3">
              <div
                v-for="(cat, idx) in store.data.topCategories.slice(0, 5)"
                :key="cat.category"
                class="group"
              >
                <div class="flex items-center justify-between text-xs mb-1.5">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full flex-shrink-0"
                      :style="`background: ${categoryColors[idx % categoryColors.length]};`"></div>
                    <span class="font-medium text-white capitalize">{{ cat.category }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span style="color: #4a5568;">{{ cat.percentage.toFixed(1) }}%</span>
                    <span class="font-semibold text-white">{{ formatCurrency(cat.amount) }}</span>
                  </div>
                </div>
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="`width: ${cat.percentage}%; background: linear-gradient(90deg, ${categoryColors[idx % categoryColors.length]}, ${categoryColorsLight[idx % categoryColorsLight.length]}); animation-delay: ${idx * 100}ms;`"
                  ></div>
                </div>
              </div>
            </div>
          </template>
        </AppCard>

        <!-- By bank -->
        <AppCard title="Expense by Bank" :glow="true" :padded="false" class="animate-fade-up delay-400">
          <template #default>
            <div class="px-5 pb-5 pt-1 space-y-3">
              <div
                v-for="bank in store.data.byBank"
                :key="bank.bank"
                class="p-3 rounded-xl transition-all duration-200 hover:scale-[1.01]"
                :style="`background: ${bankBg[bank.bank] ?? 'rgba(255,255,255,0.04)'};`"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-bold uppercase tracking-wide"
                    :style="`color: ${bankColor[bank.bank] ?? '#7c8fa8'};`">{{ bank.bank }}</span>
                  <span class="text-xs font-bold text-white">{{ formatCurrency(bank.total) }}</span>
                </div>
                <div class="flex gap-2 text-xs" style="color: #4a5568;">
                  <span>Debit: <span class="text-white font-medium">{{ formatCurrency(bank.debit) }}</span></span>
                  <span>·</span>
                  <span>Credit: <span class="text-white font-medium">{{ formatCurrency(bank.credit) }}</span></span>
                </div>
              </div>

              <!-- Empty state -->
              <div v-if="!store.data.byBank.length" class="py-8 text-center text-xs" style="color: #4a5568;">
                No bank data available
              </div>
            </div>
          </template>
        </AppCard>

      </div>

    </template>

    <!-- Empty state (no data yet) -->
    <template v-else>
      <div class="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center" style="background: rgba(99,102,241,0.1);">
          <svg class="w-7 h-7" style="color: #6366f1;" viewBox="0 0 24 24" fill="none">
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

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useDashboardStore } from '@/stores/dashboard.store'

import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'
import StatCard from '@/components/ui/StatCard.vue'
import AppCard from '@/components/ui/AppCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import DonutChart from '@/components/charts/DonutChart.vue'

const store = useDashboardStore()

const syncError = ref<string | null>(null)

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const days   = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const categoryColors      = ['#6366f1', '#10b981', '#f59e0b', '#22d3ee', '#f87171']
const categoryColorsLight = ['#818cf8', '#34d399', '#fbbf24', '#67e8f9', '#fca5a5']

const bankColor: Record<string, string> = {
  BCA:    '#60a5fa',
  JENIUS: '#34d399',
  UOB:    '#f87171',
  BRI:    '#38bdf8',
}

const bankBg: Record<string, string> = {
  BCA:    'rgba(96,165,250,0.07)',
  JENIUS: 'rgba(52,211,153,0.07)',
  UOB:    'rgba(248,113,113,0.07)',
  BRI:    'rgba(56,189,248,0.07)',
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)
}

const totalSpent = computed(() =>
  store.data?.monthly.reduce((sum, m) => sum + m.amount, 0) ?? 0,
)

const totalTransactions = computed(() => store.data?.totalTransactions ?? 0)

const topCategory = computed(() => store.data?.topCategories[0]?.category ?? '-')

const avgPerMonth = computed(() => {
  if (!store.data) return 0
  const active = store.data.monthly.filter((m) => m.amount > 0)
  return active.length ? totalSpent.value / active.length : 0
})

const monthlyChartData = computed(() =>
  (store.data?.monthly ?? []).map((m) => ({ x: m.month, y: m.amount })),
)

const dailyChartData = computed(() =>
  (store.data?.daily ?? []).map((d) => ({ x: d.day, y: d.amount })),
)

const paymentTypeData = computed(() => [
  { label: 'Debit',  value: store.data?.byPaymentType.debit  ?? 0 },
  { label: 'Credit', value: store.data?.byPaymentType.credit ?? 0 },
])

onMounted(() => {
  if (!store.data) store.fetchAll()
})
</script>

