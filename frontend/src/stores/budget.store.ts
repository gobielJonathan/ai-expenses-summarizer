import { defineStore } from 'pinia'
import { ref } from 'vue'

export const BUDGET_CATEGORIES = [
  { key: 'Food & Beverage',   emoji: '🍔', color: 'rgba(245,158,11,0.15)',  accent: '#f59e0b' },
  { key: 'Transportation',    emoji: '🚗', color: 'rgba(99,102,241,0.15)',  accent: '#6366f1' },
  { key: 'Shopping',          emoji: '🛍️', color: 'rgba(244,114,182,0.15)', accent: '#f472b6' },
  { key: 'Entertainment',     emoji: '🎬', color: 'rgba(34,211,238,0.15)',  accent: '#22d3ee' },
  { key: 'Health',            emoji: '💊', color: 'rgba(16,185,129,0.15)',  accent: '#10b981' },
  { key: 'Education',         emoji: '📚', color: 'rgba(251,191,36,0.15)',  accent: '#fbbf24' },
  { key: 'Bills & Utilities', emoji: '💡', color: 'rgba(248,113,113,0.15)', accent: '#f87171' },
  { key: 'Travel',            emoji: '✈️', color: 'rgba(129,140,248,0.15)', accent: '#818cf8' },
  { key: 'Finance',           emoji: '💳', color: 'rgba(52,211,153,0.15)',  accent: '#34d399' },
  { key: 'Other',             emoji: '📦', color: 'rgba(255,255,255,0.07)', accent: '#94a3b8' },
]

const STORAGE_KEY = 'aw_budgets'

function load(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export const useBudgetStore = defineStore('budget', () => {
  const budgets = ref<Record<string, number>>(load())

  function setBudget(category: string, amount: number) {
    budgets.value[category] = amount
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets.value))
  }

  return { budgets, setBudget, save }
})
