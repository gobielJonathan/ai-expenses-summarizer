import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { transactionService } from '@/services/transaction.service'
import type { Transaction, TransactionFilters, PaginatedResponse } from '@/types'

const DEFAULT_FILTERS: TransactionFilters = {
  page: 1,
  limit: 20,
  sort_by: 'transaction_date',
  sort_dir: 'desc',
}

export const useTransactionStore = defineStore('transactions', () => {
  const result = ref<PaginatedResponse<Transaction> | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = reactive<TransactionFilters>({ ...DEFAULT_FILTERS })

  async function fetch() {
    loading.value = true
    error.value = null
    try {
      result.value = await transactionService.getAll(filters)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load transactions'
    } finally {
      loading.value = false
    }
  }

  function setFilter<K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) {
    filters[key] = value
    if (key !== 'page') filters.page = 1
    fetch()
  }

  function resetFilters() {
    Object.assign(filters, DEFAULT_FILTERS)
    fetch()
  }

  return { result, loading, error, filters, fetch, setFilter, resetFilters }
})
