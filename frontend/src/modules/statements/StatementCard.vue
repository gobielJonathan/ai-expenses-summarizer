<template>
  <div class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
    <!-- Bank color accent bar -->
    <div class="w-1 shrink-0" :style="`background:${bankAccent}`" />

    <!-- Content -->
    <div class="flex flex-1 items-center gap-3 px-3 py-3 min-w-0">
      <!-- Icon -->
      <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" :style="`background:${bankAccent}1a`">
        <svg style="width:18px;height:18px" :style="`color:${bankAccent}`" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <!-- Text -->
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-[var(--color-text)]">{{ statement.bank_type }}</p>
        <p class="text-xs text-[var(--color-text-muted)]">{{ formatMonth(statement.statement_month) }}</p>
        <p class="text-xs text-[var(--color-text-muted)] opacity-60">{{ formatDate(statement.uploaded_at) }}</p>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="flex items-center gap-1 pr-2">
      <!-- Download -->
      <button
        :disabled="busy"
        class="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-colors disabled:opacity-40"
        title="Download"
        @click="handleDownload"
      >
        <svg v-if="downloading" class="animate-spin" style="width:16px;height:16px" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="40" stroke-dashoffset="10"/>
        </svg>
        <svg v-else style="width:16px;height:16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <!-- Preview -->
      <button
        :disabled="busy"
        class="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-colors disabled:opacity-40"
        title="Preview"
        @click="handlePreview"
      >
        <svg v-if="previewing" class="animate-spin" style="width:16px;height:16px" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="40" stroke-dashoffset="10"/>
        </svg>
        <svg v-else style="width:16px;height:16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </button>
      <!-- Delete -->
      <button
        :disabled="busy"
        class="p-2 rounded-lg text-[var(--color-danger)] hover:bg-red-900/20 transition-colors disabled:opacity-40"
        title="Delete"
        @click="handleDelete"
      >
        <svg v-if="deleting" class="animate-spin" style="width:16px;height:16px" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="40" stroke-dashoffset="10"/>
        </svg>
        <svg v-else style="width:16px;height:16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
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

const BANK_ACCENT: Record<string, string> = {
  BCA: '#0066ae',
  JENIUS: '#00a3e0',
  UOB: '#ee1c24',
  BRI: '#003087',
}
const bankAccent = computed(() => BANK_ACCENT[props.statement.bank_type] ?? '#6366f1')

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

