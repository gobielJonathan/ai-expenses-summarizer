import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { statementService } from '@/services/statement.service'
import type { Statement, BankType } from '@/types'

export const useStatementStore = defineStore('statements', () => {
  const statements = ref<Statement[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const groupedByBank = computed(() => {
    const groups: Partial<Record<BankType, Statement[]>> = {}
    for (const s of statements.value) {
      if (!groups[s.bank_type]) groups[s.bank_type] = []
      groups[s.bank_type]!.push(s)
    }
    return groups
  })

  const groupedByMonth = computed(() => {
    const groups: Record<string, Statement[]> = {}
    for (const s of statements.value) {
      const month = s.statement_month.slice(0, 7)
      if (!groups[month]) groups[month] = []
      groups[month].push(s)
    }
    return groups
  })

  async function fetch() {
    loading.value = true
    error.value = null
    try {
      statements.value = await statementService.getAll()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load statements'
    } finally {
      loading.value = false
    }
  }

  const uploading = ref(false)
  const uploadError = ref<string | null>(null)

  async function upload(file: File, bankType: string, statementMonth: string) {
    uploading.value = true
    uploadError.value = null
    try {
      const s = await statementService.upload(file, bankType, statementMonth)
      statements.value = [s, ...statements.value]
      return s
    } catch (e) {
      uploadError.value = e instanceof Error ? e.message : 'Upload failed'
      throw e
    } finally {
      uploading.value = false
    }
  }

  function downloadFile(id: string) {
    return statementService.downloadFile(id)
  }

  function previewFile(id: string) {
    return statementService.previewFile(id)
  }

  return { statements, loading, error, uploading, uploadError, groupedByBank, groupedByMonth, fetch, upload, downloadFile, previewFile }
})
