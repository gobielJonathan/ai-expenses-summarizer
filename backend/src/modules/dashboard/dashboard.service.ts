import {
  getMonthlyTotals,
  getDailyTotals,
  getTopCategories,
  getBankBreakdown,
  getBankPaymentBreakdown,
  getPaymentTypeBreakdown,
  getSummaryStats,
} from './dashboard.repository'
import type { DashboardQuery } from './dashboard.schema'

export async function getMonthlyData(query: DashboardQuery) {
  return getMonthlyTotals(query)
}

export async function getDailyData(query: DashboardQuery) {
  return getDailyTotals(query)
}

export async function getTopCategoriesData(query: DashboardQuery) {
  return getTopCategories(query)
}

export async function getBanksData(query: DashboardQuery) {
  return getBankBreakdown(query)
}

export async function getBankPaymentsData(query: DashboardQuery) {
  return getBankPaymentBreakdown(query)
}

export async function getPaymentTypesData(query: DashboardQuery) {
  return getPaymentTypeBreakdown(query)
}

export async function getSummaryData(query: DashboardQuery) {
  return getSummaryStats(query)
}
