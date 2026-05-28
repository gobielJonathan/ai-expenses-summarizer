<template>
  <div class="space-y-6">
    <h2 class="text-xl font-bold">Dashboard</h2>

    <LoadingSpinner v-if="store.loading" />
    <ErrorMessage v-else-if="store.error" :message="store.error" :onRetry="store.fetchAll" />

    <template v-else-if="store.data">
      <!-- Stat summary row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Spent" :value="totalSpent" format="currency" subtitle="This year" />
        <StatCard label="Transactions" :value="totalTransactions" format="number" subtitle="This year" />
        <StatCard label="Top Category" :value="0" :subtitle="topCategory" />
        <StatCard label="Avg / Month" :value="avgPerMonth" format="currency" />
      </div>

      <!-- Monthly expense chart -->
      <AppCard title="Monthly Expenses">
        <LineChart
          :data="monthlyChartData"
          :xTickFormat="(_, i) => months[i as number] ?? ''"
          :tooltipTemplate="(d) => `${d.x}: ${formatCurrency(d.y)}`"
        />
      </AppCard>

      <!-- Row: daily + payment type -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AppCard title="Spending by Weekday">
          <BarChart
            :data="dailyChartData"
            :yKeys="['y']"
            :xTickFormat="(_, i) => days[i as number] ?? ''"
          />
        </AppCard>

        <AppCard title="Debit vs Credit">
          <div class="flex flex-col sm:flex-row items-center gap-4">
            <DonutChart :data="paymentTypeData" :height="180" />
            <div class="space-y-3 w-full">
              <div v-for="item in paymentTypeData" :key="item.label" class="flex justify-between text-sm">
                <span class="text-[var(--color-text-muted)]">{{ item.label }}</span>
                <span class="font-semibold">{{ formatCurrency(item.value) }}</span>
              </div>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Row: top categories + by bank -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AppCard title="Top 5 Categories">
          <div class="space-y-3 mt-2">
            <div v-for="cat in store.data.topCategories.slice(0, 5)" :key="cat.category">
              <div class="flex justify-between text-sm mb-1">
                <span>{{ cat.category }}</span>
                <span class="text-[var(--color-text-muted)]">{{ formatCurrency(cat.amount) }}</span>
              </div>
              <div class="h-1.5 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                <div
                  class="h-full bg-[var(--color-primary)] rounded-full transition-all"
                  :style="{ width: `${cat.percentage}%` }"
                />
              </div>
            </div>
          </div>
        </AppCard>

        <AppCard title="Expense by Bank">
          <div class="flex gap-4 mb-3">
            <span v-for="item in bankLegend" :key="item.label" class="flex items-center gap-1.5 text-xs">
              <span class="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0" :style="{ background: item.color }" />
              {{ item.label }}
            </span>
          </div>
          <BarChart
            :data="bankChartData"
            :yKeys="['debit', 'credit']"
            :xTickFormat="(_, i) => store.data!.byBank[i as number]?.bank ?? ''"
            :height="200"
          />
        </AppCard>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard.store'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'
import StatCard from '@/components/ui/StatCard.vue'
import AppCard from '@/components/ui/AppCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import DonutChart from '@/components/charts/DonutChart.vue'

const store = useDashboardStore()

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

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
  const months = store.data.monthly.filter((m) => m.amount > 0)
  return months.length ? totalSpent.value / months.length : 0
})

const monthlyChartData = computed(() =>
  (store.data?.monthly ?? []).map((m) => ({ x: m.month, y: m.amount })),
)

const dailyChartData = computed(() =>
  (store.data?.daily ?? []).map((d) => ({ x: d.day, y: d.amount })),
)

const paymentTypeData = computed(() => [
  { label: 'Debit', value: store.data?.byPaymentType.debit ?? 0 },
  { label: 'Credit', value: store.data?.byPaymentType.credit ?? 0 },
])

const bankChartData = computed(() =>
  (store.data?.byBank ?? []).map((b) => ({
    x: b.bank,
    debit: b.debit,
    credit: b.credit,
  })),
)

const bankLegend = [
  { label: 'Debit', color: 'var(--color-primary)' },
  { label: 'Credit', color: '#22c55e' },
]

onMounted(() => {
  if (!store.data) store.fetchAll()
})
</script>
