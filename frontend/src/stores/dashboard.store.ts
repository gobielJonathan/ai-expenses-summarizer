import { defineStore } from 'pinia'
import { ref } from 'vue'
import { dashboardService } from '@/services/dashboard.service'
import type { DashboardData } from '@/types'

export const useDashboardStore = defineStore('dashboard', () => {
  const data = ref<DashboardData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedYear = ref(new Date().getFullYear())

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      data.value = await dashboardService.getAll(selectedYear.value)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load dashboard'
    } finally {
      loading.value = false
    }
  }

  function setYear(year: number) {
    selectedYear.value = year
    fetchAll()
  }

  return { data, loading, error, selectedYear, fetchAll, setYear }
})
