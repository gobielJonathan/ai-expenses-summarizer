import { http } from './http'
import type { Transaction, TransactionFilters, PaginatedResponse } from '@/types'

// Map camelCase backend Transaction to frontend snake_case Transaction
function mapTransaction(t: Record<string, unknown>): Transaction {
  return {
    id: t.id as string,
    bank_type: t.bankType as Transaction['bank_type'],
    payment_type: t.paymentType as Transaction['payment_type'],
    merchant: t.merchant as string,
    amount: Number(t.amount),
    currency: t.currency as string,
    transaction_date: (t.transactionDate as string)?.split('T')[0] ?? (t.transactionDate as string),
    category: t.category as string,
    subcategory: t.subcategory as string,
    statement_id: t.statementId as string | null,
    created_at: t.createdAt as string,
  }
}

// Build query string from frontend filters
function buildQuery(filters: TransactionFilters): string {
  const p = new URLSearchParams()
  if (filters.page) p.set('page', String(filters.page))
  if (filters.limit) p.set('limit', String(filters.limit))
  if (filters.date_from) p.set('startDate', filters.date_from)
  if (filters.date_to) p.set('endDate', filters.date_to)
  if (filters.bank_type) p.set('bankType', filters.bank_type)
  if (filters.payment_type) p.set('paymentType', filters.payment_type)
  if (filters.category) p.set('category', filters.category)
  if (filters.search) p.set('merchant', filters.search)
  if (filters.sort_by) {
    const sortByMap: Record<string, string> = { transaction_date: 'transactionDate' }
    p.set('sortBy', sortByMap[String(filters.sort_by)] ?? String(filters.sort_by))
  }
  if (filters.sort_dir) p.set('sortOrder', filters.sort_dir)
  return p.toString()
}

export const transactionService = {
  getAll: async (filters: TransactionFilters = {}): Promise<PaginatedResponse<Transaction>> => {
    const qs = buildQuery(filters)
    const res = await http.get<Record<string, unknown>[]>(`/transactions?${qs}`)
    const data = res.data.map(mapTransaction)
    const meta = res.meta ?? { total: data.length, page: 1, limit: filters.limit ?? 20, totalPages: 1 }
    return { data, total: meta.total, page: meta.page, limit: meta.limit, totalPages: meta.totalPages }
  },

  getById: async (id: string): Promise<Transaction> => {
    const res = await http.get<Record<string, unknown>>(`/transactions/${id}`)
    return mapTransaction(res.data)
  },
}
