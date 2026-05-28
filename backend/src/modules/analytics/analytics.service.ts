import {
  getSpendingTrend,
  getCategoryBreakdown,
  getMerchantRanking,
  getPaymentTypeStats,
} from './analytics.repository'
import type { AnalyticsQuery } from './analytics.schema'

export async function getTrend(query: AnalyticsQuery) {
  return getSpendingTrend(query)
}

export async function getCategories(query: AnalyticsQuery) {
  return getCategoryBreakdown(query)
}

export async function getMerchants(query: AnalyticsQuery) {
  return getMerchantRanking(query)
}

export async function getPaymentTypes(query: AnalyticsQuery) {
  return getPaymentTypeStats(query)
}
