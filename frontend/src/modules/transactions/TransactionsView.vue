<template>
  <div class="flex flex-col h-full">
    <!-- Page header -->
    <div class="px-4 pt-4 pb-2">
      <h2 class="text-lg font-bold text-[var(--color-text)]">Transactions</h2>
    </div>

    <!-- Filter row 1: search + type chips -->
    <div class="px-4 pb-2 space-y-2">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" style="width:14px;height:14px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" stroke-linecap="round"/>
        </svg>
        <input
          :value="store.filters.search"
          type="text"
          placeholder="Search merchant…"
          class="w-full pl-8 pr-3 py-2 rounded-xl text-sm bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]"
          @input="store.setFilter('search', ($event.target as HTMLInputElement).value)"
        />
      </div>

      <!-- Type + Bank chips -->
      <div class="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
        <button
          v-for="pt in paymentTypes"
          :key="pt.value"
          class="shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors"
          :class="store.filters.payment_type === pt.value
            ? 'bg-[var(--color-primary)] text-white'
            : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'"
          @click="store.setFilter('payment_type', store.filters.payment_type === pt.value ? undefined : pt.value as PaymentType)"
        >
          {{ pt.label }}
        </button>
        <div class="w-px h-5 self-center bg-[var(--color-border)] shrink-0" />
        <button
          v-for="bank in banks"
          :key="bank"
          class="shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors"
          :class="store.filters.bank_type === bank
            ? 'bg-[var(--color-primary)] text-white'
            : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'"
          @click="store.setFilter('bank_type', store.filters.bank_type === bank ? undefined : bank as BankType)"
        >
          {{ bank }}
        </button>
      </div>

      <!-- Date range + reset row -->
      <div class="flex gap-2 items-center">
        <input
          :value="store.filters.date_from"
          type="date"
          class="flex-1 min-w-0 px-2 py-1.5 rounded-lg text-xs bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]"
          @change="store.setFilter('date_from', ($event.target as HTMLInputElement).value || undefined)"
        />
        <span class="text-[var(--color-text-muted)] text-xs shrink-0">–</span>
        <input
          :value="store.filters.date_to"
          type="date"
          class="flex-1 min-w-0 px-2 py-1.5 rounded-lg text-xs bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]"
          @change="store.setFilter('date_to', ($event.target as HTMLInputElement).value || undefined)"
        />
        <button
          class="shrink-0 px-3 py-1.5 text-xs rounded-lg bg-[var(--color-surface-2)] hover:bg-[var(--color-border)] text-[var(--color-text-muted)] transition-colors"
          @click="store.resetFilters"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Summary strip -->
    <div v-if="store.result" class="mx-4 mb-2 px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between">
      <span class="text-xs text-[var(--color-text-muted)]">{{ store.result.total }} transactions</span>
      <span class="text-xs font-semibold text-[var(--color-text)]">{{ formatCurrency(totalAmount) }}</span>
    </div>

    <!-- List / states -->
    <div class="flex-1 overflow-y-auto px-4 space-y-4 pb-4">
      <LoadingSpinner v-if="store.loading" />
      <ErrorMessage v-else-if="store.error" :message="store.error" :onRetry="store.fetch" />
      <template v-else>
        <div v-if="rows.length === 0" class="text-center py-16 text-[var(--color-text-muted)] text-sm">
          No transactions found.
        </div>

        <!-- Date groups -->
        <div v-for="group in dateGroups" :key="group.date" class="space-y-1">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">{{ group.label }}</span>
            <span class="text-xs text-[var(--color-text-muted)]">{{ formatCurrency(group.dayTotal) }}</span>
          </div>
          <div
            v-for="tx in group.items"
            :key="tx.id"
            class="flex items-center gap-3 px-3 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]"
          >
            <!-- Category emoji + bank dot -->
            <div class="relative shrink-0">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center text-base" style="background:rgba(99,102,241,0.1)">
                {{ getCategoryEmoji(tx.category) }}
              </div>
              <span
                class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                :style="`background:${bankColor(tx.bank_type)};border-color:var(--color-bg)`"
              />
            </div>

            <!-- Merchant + meta -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-[var(--color-text)] truncate">{{ tx.merchant }}</p>
              <p class="text-xs text-[var(--color-text-muted)] truncate">{{ tx.category || 'Uncategorized' }} · {{ tx.bank_type }}</p>
            </div>

            <!-- Amount + type chip -->
            <div class="text-right shrink-0">
              <p
                class="text-sm font-semibold tabular-nums"
                :class="tx.payment_type === 'CREDIT' ? 'text-emerald-400' : 'text-[var(--color-text)]'"
              >
                {{ tx.payment_type === 'CREDIT' ? '+' : '-' }}{{ formatCurrency(tx.amount) }}
              </p>
              <span
                class="text-xs px-1.5 py-0.5 rounded-full"
                :class="tx.payment_type === 'CREDIT'
                  ? 'bg-emerald-400/10 text-emerald-400'
                  : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]'"
              >
                {{ tx.payment_type === 'CREDIT' ? 'in' : 'out' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="(store.result?.totalPages ?? 0) > 1" class="flex items-center justify-between pt-2">
          <button
            class="px-3 py-1.5 text-xs rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] disabled:opacity-40 transition-opacity"
            :disabled="(store.filters.page ?? 1) <= 1"
            @click="store.setFilter('page', (store.filters.page ?? 1) - 1)"
          >
            ← Prev
          </button>
          <span class="text-xs text-[var(--color-text-muted)]">{{ store.filters.page }} / {{ store.result?.totalPages }}</span>
          <button
            class="px-3 py-1.5 text-xs rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] disabled:opacity-40 transition-opacity"
            :disabled="(store.filters.page ?? 1) >= (store.result?.totalPages ?? 1)"
            @click="store.setFilter('page', (store.filters.page ?? 1) + 1)"
          >
            Next →
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useTransactionStore } from '@/stores/transaction.store'
import type { Transaction, BankType, PaymentType } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'

const store = useTransactionStore()

const banks: BankType[] = ['BCA', 'JENIUS', 'UOB', 'BRI']
const paymentTypes = [
  { value: 'DEBIT', label: 'Expenses' },
  { value: 'CREDIT', label: 'Income' },
]

const rows = computed(() => store.result?.data ?? [])

const totalAmount = computed(() =>
  rows.value.reduce((sum, tx) => sum + Number(tx.amount), 0)
)

interface DateGroup {
  date: string
  label: string
  items: Transaction[]
  dayTotal: number
}

const dateGroups = computed<DateGroup[]>(() => {
  const map = new Map<string, Transaction[]>()
  for (const tx of rows.value) {
    const key = dayjs(tx.transaction_date).format('YYYY-MM-DD')
    const arr = map.get(key) ?? []
    arr.push(tx)
    map.set(key, arr)
  }
  return Array.from(map.entries()).map(([date, items]) => {
    const d = dayjs(date)
    const today = dayjs().startOf('day')
    const label = d.isSame(today, 'day')
      ? 'Today'
      : d.isSame(today.subtract(1, 'day'), 'day')
        ? 'Yesterday'
        : d.format('ddd, D MMM')
    return {
      date,
      label,
      items,
      dayTotal: items.reduce((s, t) => s + Number(t.amount), 0),
    }
  })
})

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)
}

const CATEGORY_EMOJI: Record<string, string> = {
  'Food & Beverage': '🍜',
  'Transportation': '🚗',
  'Shopping': '🛍️',
  'Entertainment': '🎬',
  'Health': '💊',
  'Education': '📚',
  'Bills & Utilities': '💡',
  'Travel': '✈️',
  'Finance': '💳',
  'Other': '📦',
}

function getCategoryEmoji(category: string): string {
  return CATEGORY_EMOJI[category] ?? '📦'
}

const BANK_COLOR: Record<string, string> = {
  BCA: '#0066ae',
  JENIUS: '#00a3e0',
  UOB: '#ee1c24',
  BRI: '#003087',
}

function bankColor(bank: string): string {
  return BANK_COLOR[bank] ?? '#6366f1'
}

onMounted(() => {
  if (!store.result) store.fetch()
})
</script>
