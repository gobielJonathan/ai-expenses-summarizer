import { http } from './http'
import type { DashboardData, BankType } from '@/types'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Raw shapes returned by the API
interface MonthlyRow { month: number; bank_type: string; total: number }
interface DailyRow { day: number; total: number }
interface CategoryRow { category: string; total: number }
interface BankPaymentRow { bank_type: string; payment_type: string; total: number }
interface PaymentTypeRow { payment_type: string; total: number }
interface SummaryRow { _count: { id: number } }

export const dashboardService = {
  getAll: async (year = new Date().getFullYear()): Promise<DashboardData> => {
    const q = `year=${year}`

    const [monthlyRes, dailyRes, categoriesRes, bankPaymentsRes, paymentTypesRes, summaryRes] =
      await Promise.all([
        http.get<MonthlyRow[]>(`/dashboard/monthly?${q}`),
        http.get<DailyRow[]>(`/dashboard/daily?${q}`),
        http.get<CategoryRow[]>(`/dashboard/top-categories?${q}`),
        http.get<BankPaymentRow[]>(`/dashboard/bank-payments?${q}`),
        http.get<PaymentTypeRow[]>(`/dashboard/payment-types?${q}`),
        http.get<SummaryRow>(`/dashboard/summary?${q}`),
      ])

    // Monthly: sum across bank types per month → 12 entries
    const monthMap: Record<number, number> = {}
    for (const row of monthlyRes.data) {
      monthMap[row.month] = (monthMap[row.month] ?? 0) + row.total
    }
    const monthly = MONTHS.map((month, i) => ({ month, amount: monthMap[i + 1] ?? 0 }))

    // Daily: day-of-month totals
    const daily = dailyRes.data.map((d) => ({ day: String(d.day), amount: d.total }))

    // Top categories with percentages
    const grandTotal = categoriesRes.data.reduce((s, c) => s + c.total, 0)
    const topCategories = categoriesRes.data.map((c) => ({
      category: c.category,
      amount: c.total,
      percentage: grandTotal > 0 ? (c.total / grandTotal) * 100 : 0,
    }))

    // By bank: group bank_payment rows into debit/credit per bank
    const bankMap: Record<string, { bank: BankType; debit: number; credit: number; total: number }> = {}
    for (const row of bankPaymentsRes.data) {
      if (!bankMap[row.bank_type]) {
        bankMap[row.bank_type] = { bank: row.bank_type as BankType, debit: 0, credit: 0, total: 0 }
      }
      const lower = row.payment_type.toLowerCase()
      if (lower.includes('debit') || lower === 'debit') bankMap[row.bank_type].debit += row.total
      else bankMap[row.bank_type].credit += row.total
      bankMap[row.bank_type].total += row.total
    }
    const byBank = Object.values(bankMap)

    // Payment type totals
    const byPaymentType = { debit: 0, credit: 0 }
    for (const row of paymentTypesRes.data) {
      const lower = row.payment_type.toLowerCase()
      if (lower.includes('debit') || lower === 'debit') byPaymentType.debit = row.total
      else byPaymentType.credit = row.total
    }

    const totalTransactions = summaryRes.data._count.id

    return { monthly, daily, topCategories, byBank, byPaymentType, totalTransactions }
  },
}
