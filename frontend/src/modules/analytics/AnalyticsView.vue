<template>
  <div class="space-y-6">
    <h2 class="text-xl font-bold">Analytics</h2>

    <LoadingSpinner v-if="store.loading" />
    <ErrorMessage v-else-if="store.error" :message="store.error" :onRetry="store.fetchAll" />

    <template v-else-if="store.data">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AppCard title="Monthly Trend (Line)">
          <LineChart
            :data="monthlyChartData"
            :xTickFormat="(_, i) => months[i as number] ?? ''"
            :tooltipTemplate="(d) => `${d.x}: ${formatCurrency(d.y)}`"
          />
        </AppCard>

        <AppCard title="Monthly Trend (Bar)">
          <BarChart
            :data="monthlyBarData"
            :yKeys="['y']"
            :xTickFormat="(_, i) => months[i as number] ?? ''"
          />
        </AppCard>

        <AppCard title="Top Categories (Bar)">
          <BarChart
            :data="categoryBarData"
            :yKeys="['y']"
            :xTickFormat="(_, i) => store.data!.topCategories[i as number]?.category ?? ''"
          />
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
          />
        </AppCard>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard.store'
import AppCard from '@/components/ui/AppCard.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'

const store = useDashboardStore()

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)
}

const monthlyChartData = computed(() =>
  (store.data?.monthly ?? []).map((m) => ({ x: m.month, y: m.amount })),
)

const monthlyBarData = computed(() =>
  (store.data?.monthly ?? []).map((m) => ({ x: m.month, y: m.amount })),
)

const categoryBarData = computed(() =>
  (store.data?.topCategories ?? []).map((c) => ({ x: c.category, y: c.amount })),
)

const bankChartData = computed(() =>
  (store.data?.byBank ?? []).map((b) => ({ x: b.bank, debit: b.debit, credit: b.credit })),
)

const bankLegend = [
  { label: 'Debit', color: 'var(--color-primary)' },
  { label: 'Credit', color: '#22c55e' },
]

onMounted(() => {
  if (!store.data) store.fetchAll()
})
</script>
