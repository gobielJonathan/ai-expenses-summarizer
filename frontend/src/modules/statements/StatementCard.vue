<template>
  <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 flex items-start justify-between gap-3">
    <div class="flex items-start gap-3">
      <span class="text-2xl mt-0.5">📄</span>
      <div>
        <p class="font-medium text-sm">{{ statement.bank_type }}</p>
        <p class="text-xs text-[var(--color-text-muted)] mt-0.5">{{ formatMonth(statement.statement_month) }}</p>
        <p class="text-xs text-[var(--color-text-muted)]">Uploaded {{ formatDate(statement.uploaded_at) }}</p>
      </div>
    </div>
    <div class="flex gap-2">
      <button
        :disabled="busy"
        class="px-3 py-1.5 text-xs rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white transition-colors disabled:opacity-50"
        @click="handleDownload"
      >
        {{ downloading ? '…' : 'Download' }}
      </button>
      <button
        :disabled="busy"
        class="px-3 py-1.5 text-xs rounded-lg bg-[var(--color-surface-2)] hover:bg-[var(--color-border)] transition-colors disabled:opacity-50"
        @click="handlePreview"
      >
        {{ previewing ? '…' : 'Preview' }}
      </button>
      <button
        :disabled="busy"
        class="px-3 py-1.5 text-xs rounded-lg border border-[var(--color-danger)] text-[var(--color-danger)] hover:bg-red-50 transition-colors disabled:opacity-50"
        @click="handleDelete"
      >
        {{ deleting ? '…' : 'Delete' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import type { Statement } from '@/types'

const props = defineProps<{
  statement: Statement
  onDownload: (id: string) => Promise<string>
  onPreview: (id: string) => Promise<string>
  onDelete: (id: string) => Promise<void>
}>()

const downloading = ref(false)
const previewing = ref(false)
const deleting = ref(false)
const busy = computed(() => downloading.value || previewing.value || deleting.value)

async function handleDownload() {
  downloading.value = true
  try {
    const blobUrl = await props.onDownload(props.statement.id)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = `${props.statement.bank_type}_${props.statement.statement_month}.pdf`
    a.click()
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000)
  } finally {
    downloading.value = false
  }
}

async function handlePreview() {
  previewing.value = true
  try {
    const blobUrl = await props.onPreview(props.statement.id)
    window.open(blobUrl, '_blank', 'noopener,noreferrer')
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000)
  } finally {
    previewing.value = false
  }
}

async function handleDelete() {
  if (!confirm(`Delete ${props.statement.bank_type} ${formatMonth(props.statement.statement_month)} statement and all its transactions?`)) return
  deleting.value = true
  try {
    await props.onDelete(props.statement.id)
  } finally {
    deleting.value = false
  }
}

function formatMonth(date: string) {
  return dayjs(date).format('MMMM YYYY')
}

function formatDate(date: string) {
  return dayjs(date).format('DD MMM YYYY')
}
</script>

