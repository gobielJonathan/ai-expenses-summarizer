// Transaction types
export type BankType = 'BCA' | 'JENIUS' | 'UOB' | 'BRI'
export type PaymentType = 'DEBIT' | 'CREDIT'

export interface Transaction {
  id: string
  bank_type: BankType
  payment_type: PaymentType
  merchant: string
  amount: number
  currency: string
  transaction_date: string
  category: string
  subcategory: string
  statement_id: string | null
  created_at: string
}

export interface TransactionFilters {
  search?: string
  bank_type?: BankType
  payment_type?: PaymentType
  category?: string
  date_from?: string
  date_to?: string
  page?: number
  limit?: number
  sort_by?: keyof Transaction
  sort_dir?: 'asc' | 'desc'
}

// Statement types
export interface Statement {
  id: string
  bank_type: BankType
  statement_month: string
  pdf_path: string
  uploaded_at: string
}

// Dashboard types
export interface MonthlyExpense {
  month: string
  amount: number
}

export interface DailyExpense {
  day: string
  amount: number
}

export interface CategoryExpense {
  category: string
  amount: number
  percentage: number
}

export interface BankExpense {
  bank: BankType
  debit: number
  credit: number
  total: number
}

export interface PaymentTypeExpense {
  debit: number
  credit: number
}

export interface DashboardData {
  monthly: MonthlyExpense[]
  daily: DailyExpense[]
  topCategories: CategoryExpense[]
  byBank: BankExpense[]
  byPaymentType: PaymentTypeExpense
  totalTransactions: number
}

// API types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  code?: string
}

// Auth types
export interface AuthUser {
  id: string
  email: string
  name: string
  avatarUrl: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}
