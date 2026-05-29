import { env } from '../../config/env'
import { NotFoundError } from '../../shared/errors'
import {
  getTodaySummary,
  getMonthlySummary,
  getCategorySummary,
  getBankSummary,
  getPaymentSummary,
  getStatementByBankAndMonth,
} from './chat.repository'
import type { ChatDateRangeQuery, ChatCategoryQuery, ChatStatementQuery } from './chat.schema'

export async function getSummaryData(query: ChatDateRangeQuery) {
  return getTodaySummary(query.startDate, query.endDate, query.bankType)
}

export async function getMonthlySummaryData(query: ChatDateRangeQuery) {
  return getMonthlySummary(query.startDate, query.endDate, query.bankType)
}

export async function getCategorySummaryData(query: ChatCategoryQuery) {
  return getCategorySummary(query.category, query.startDate, query.endDate, query.bankType)
}

export async function getBankSummaryData(query: ChatDateRangeQuery) {
  return getBankSummary(query.startDate, query.endDate)
}

export async function getPaymentSummaryData(query: ChatDateRangeQuery) {
  return getPaymentSummary(query.startDate, query.endDate, query.bankType)
}

export async function getStatementData(query: ChatStatementQuery) {
  const statement = await getStatementByBankAndMonth(query.bankType, query.month)
  if (!statement) throw new NotFoundError('Statement')

  const downloadUrl = `${env.FRONTEND_URL}/api/v1/statements/${statement.id}/download`

  return {
    id: statement.id,
    bankType: statement.bankType,
    statementMonth: statement.statementMonth,
    uploadedAt: statement.uploadedAt,
    downloadUrl,
  }
}
