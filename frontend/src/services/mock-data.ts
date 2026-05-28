import type {
  Transaction,
  Statement,
  MonthlyExpense,
  DailyExpense,
  CategoryExpense,
  BankExpense,
  PaymentTypeExpense,
  BankType,
  PaymentType,
} from '@/types'

// ─── Transactions ─────────────────────────────────────────────────────────────

const merchants = [
  { name: 'Kopi Kenangan', category: 'Food & Drink', subcategory: 'Coffee' },
  { name: 'GrabFood', category: 'Food & Drink', subcategory: 'Delivery' },
  { name: 'GoFood', category: 'Food & Drink', subcategory: 'Delivery' },
  { name: 'Tokopedia', category: 'Shopping', subcategory: 'E-commerce' },
  { name: 'Shopee', category: 'Shopping', subcategory: 'E-commerce' },
  { name: 'Grab', category: 'Transport', subcategory: 'Ride-hailing' },
  { name: 'Gojek', category: 'Transport', subcategory: 'Ride-hailing' },
  { name: 'Netflix', category: 'Entertainment', subcategory: 'Streaming' },
  { name: 'Spotify', category: 'Entertainment', subcategory: 'Streaming' },
  { name: 'PLN', category: 'Utilities', subcategory: 'Electricity' },
  { name: 'PDAM', category: 'Utilities', subcategory: 'Water' },
  { name: 'Indomaret', category: 'Groceries', subcategory: 'Convenience Store' },
  { name: 'Alfamart', category: 'Groceries', subcategory: 'Convenience Store' },
  { name: 'Grand Indonesia', category: 'Shopping', subcategory: 'Mall' },
  { name: 'RSUP Dr. Sardjito', category: 'Health', subcategory: 'Hospital' },
  { name: 'Guardian', category: 'Health', subcategory: 'Pharmacy' },
  { name: 'Uniqlo', category: 'Shopping', subcategory: 'Fashion' },
  { name: 'H&M', category: 'Shopping', subcategory: 'Fashion' },
  { name: 'Pizza Hut', category: 'Food & Drink', subcategory: 'Restaurant' },
  { name: 'McDonald\'s', category: 'Food & Drink', subcategory: 'Fast Food' },
  { name: 'Pertamina', category: 'Transport', subcategory: 'Fuel' },
  { name: 'Traveloka', category: 'Travel', subcategory: 'Flight' },
  { name: 'Tiket.com', category: 'Travel', subcategory: 'Hotel' },
  { name: 'Lazada', category: 'Shopping', subcategory: 'E-commerce' },
  { name: 'Ruangguru', category: 'Education', subcategory: 'Online Course' },
]

const banks: BankType[] = ['BCA', 'JENIUS', 'UOB', 'BRI']
const paymentTypes: PaymentType[] = ['DEBIT', 'CREDIT']

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomDate(year: number, month: number) {
  const day = randomBetween(1, 28)
  return new Date(year, month, day).toISOString()
}

function generateTransactions(): Transaction[] {
  const txns: Transaction[] = []
  let id = 1

  for (let month = 0; month < 12; month++) {
    const count = randomBetween(15, 30)
    for (let i = 0; i < count; i++) {
      const m = merchants[randomBetween(0, merchants.length - 1)]
      const bank = banks[randomBetween(0, 3)]
      const ptype = paymentTypes[Math.random() > 0.4 ? 0 : 1]
      const amount = randomBetween(15_000, 2_500_000)

      txns.push({
        id: String(id++).padStart(8, '0'),
        bank_type: bank,
        payment_type: ptype,
        merchant: m.name,
        amount,
        currency: 'IDR',
        transaction_date: randomDate(2026, month),
        category: m.category,
        subcategory: m.subcategory,
        statement_id: ptype === 'CREDIT' ? `stmt-${bank}-2026-${String(month + 1).padStart(2, '0')}` : null,
        created_at: new Date().toISOString(),
      })
    }
  }

  return txns.sort((a, b) =>
    new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime(),
  )
}

export const MOCK_TRANSACTIONS: Transaction[] = generateTransactions()

// ─── Statements ───────────────────────────────────────────────────────────────

export const MOCK_STATEMENTS: Statement[] = banks.flatMap((bank) =>
  Array.from({ length: 5 }, (_, i) => {
    const month = i + 1
    return {
      id: `stmt-${bank}-2026-${String(month).padStart(2, '0')}`,
      bank_type: bank,
      statement_month: `2026-${String(month).padStart(2, '0')}-01`,
      pdf_path: `/statements/${bank.toLowerCase()}-2026-${String(month).padStart(2, '0')}.pdf`,
      uploaded_at: new Date(2026, month, 5).toISOString(),
    }
  }),
)

// ─── Dashboard ─────────────────────────────────────────────────────────────────

function buildMonthly(): MonthlyExpense[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months.map((month, i) => ({
    month,
    amount: MOCK_TRANSACTIONS
      .filter((t) => new Date(t.transaction_date).getMonth() === i)
      .reduce((s, t) => s + t.amount, 0),
  }))
}

function buildDaily(): DailyExpense[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map((day, i) => ({
    day,
    amount: MOCK_TRANSACTIONS
      .filter((t) => {
        const d = new Date(t.transaction_date).getDay()
        // JS: 0=Sun, 1=Mon ... convert to Mon=0 index
        return ((d + 6) % 7) === i
      })
      .reduce((s, t) => s + t.amount, 0),
  }))
}

function buildTopCategories(): CategoryExpense[] {
  const totals: Record<string, number> = {}
  for (const t of MOCK_TRANSACTIONS) {
    totals[t.category] = (totals[t.category] ?? 0) + t.amount
  }
  const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0)
  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: Math.round((amount / grandTotal) * 100),
    }))
}

function buildByBank(): BankExpense[] {
  return banks.map((bank) => {
    const bankTxns = MOCK_TRANSACTIONS.filter((t) => t.bank_type === bank)
    const debit = bankTxns.filter((t) => t.payment_type === 'DEBIT').reduce((s, t) => s + t.amount, 0)
    const credit = bankTxns.filter((t) => t.payment_type === 'CREDIT').reduce((s, t) => s + t.amount, 0)
    return { bank, debit, credit, total: debit + credit }
  })
}

function buildByPaymentType(): PaymentTypeExpense {
  return {
    debit: MOCK_TRANSACTIONS.filter((t) => t.payment_type === 'DEBIT').reduce((s, t) => s + t.amount, 0),
    credit: MOCK_TRANSACTIONS.filter((t) => t.payment_type === 'CREDIT').reduce((s, t) => s + t.amount, 0),
  }
}

export const MOCK_DASHBOARD = {
  monthly: buildMonthly(),
  daily: buildDaily(),
  topCategories: buildTopCategories(),
  byBank: buildByBank(),
  byPaymentType: buildByPaymentType(),
}
