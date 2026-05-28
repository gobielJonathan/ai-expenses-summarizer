<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold">Transactions</h2>

    <!-- Filters -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3">
      <input
        :value="store.filters.search"
        type="text"
        placeholder="Search merchant..."
        class="sm:col-span-2 lg:flex-1 lg:min-w-48 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
        @input="store.setFilter('search', ($event.target as HTMLInputElement).value)"
      />

      <select
        :value="store.filters.bank_type ?? ''"
        class="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
        @change="store.setFilter('bank_type', ($event.target as HTMLSelectElement).value as BankType || undefined)"
      >
        <option value="">All Banks</option>
        <option v-for="bank in banks" :key="bank" :value="bank">{{ bank }}</option>
      </select>

      <select
        :value="store.filters.payment_type ?? ''"
        class="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
        @change="store.setFilter('payment_type', ($event.target as HTMLSelectElement).value as PaymentType || undefined)"
      >
        <option value="">All Types</option>
        <option value="DEBIT">Debit</option>
        <option value="CREDIT">Credit</option>
      </select>

      <input
        :value="store.filters.date_from"
        type="date"
        class="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
        @change="store.setFilter('date_from', ($event.target as HTMLInputElement).value || undefined)"
      />

      <input
        :value="store.filters.date_to"
        type="date"
        class="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
        @change="store.setFilter('date_to', ($event.target as HTMLInputElement).value || undefined)"
      />

      <button
        class="px-3 py-1.5 text-sm rounded-lg bg-[var(--color-surface-2)] hover:bg-[var(--color-border)] transition-colors"
        @click="store.resetFilters"
      >
        Reset
      </button>
    </div>

    <!-- Table -->
    <AppCard>
      <LoadingSpinner v-if="store.loading" />
      <ErrorMessage v-else-if="store.error" :message="store.error" :onRetry="store.fetch" />
      <DataTable
        v-else
        :columns="columns"
        :rows="rows"
        :total="store.result?.total"
        :page="store.filters.page"
        :totalPages="store.result?.totalPages"
        :sortBy="String(store.filters.sort_by ?? '')"
        :sortDir="store.filters.sort_dir"
        @sort="handleSort"
        @page="(p) => store.setFilter('page', p)"
      >
        <template #default="{ row }">
          <td class="px-4 py-3 text-[var(--color-text-muted)]">{{ formatDate(row.transaction_date) }}</td>
          <td class="px-4 py-3 font-medium">{{ row.merchant }}</td>
          <td class="px-4 py-3">
            <AppBadge :label="row.bank_type" />
          </td>
          <td class="px-4 py-3">
            <AppBadge
              :label="row.payment_type"
              :variant="row.payment_type === 'CREDIT' ? 'warning' : 'info'"
            />
          </td>
          <td class="px-4 py-3">
            <AppBadge :label="row.category" variant="default" />
          </td>
          <td class="px-4 py-3 text-right font-semibold tabular-nums">
            {{ formatCurrency(row.amount) }}
          </td>
        </template>
      </DataTable>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useTransactionStore } from '@/stores/transaction.store'
import type { Transaction, BankType, PaymentType } from '@/types'
import AppCard from '@/components/ui/AppCard.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import DataTable from '@/components/table/DataTable.vue'
import type { TableColumn } from '@/components/table/DataTable.vue'

const store = useTransactionStore()

const banks: BankType[] = ['BCA', 'JENIUS', 'UOB', 'BRI']

const columns: TableColumn[] = [
  { key: 'transaction_date', label: 'Date', sortable: true },
  { key: 'merchant', label: 'Merchant', sortable: true },
  { key: 'bank_type', label: 'Bank' },
  { key: 'payment_type', label: 'Type' },
  { key: 'category', label: 'Category' },
  { key: 'amount', label: 'Amount', sortable: true },
]

const rows = computed(() => store.result?.data ?? [])

function formatDate(date: string) {
  return dayjs(date).format('DD MMM YYYY')
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)
}

function handleSort(key: string) {
  const col = key as keyof Transaction
  if (store.filters.sort_by === col) {
    store.setFilter('sort_dir', store.filters.sort_dir === 'asc' ? 'desc' : 'asc')
  } else {
    store.setFilter('sort_by', col)
    store.setFilter('sort_dir', 'desc')
  }
}

onMounted(() => {
  if (!store.result) store.fetch()
})
</script>
