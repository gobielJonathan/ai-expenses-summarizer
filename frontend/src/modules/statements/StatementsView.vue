<template>
  <div class="flex flex-col h-full">
    <!-- Page header -->
    <div class="px-4 pt-4 pb-3">
      <h2 class="text-lg font-bold text-[var(--color-text)]">E-Statements</h2>
    </div>

    <!-- Upload form -->
    <div class="mx-4 mb-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-3">
      <p class="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Upload Statement</p>

      <div class="flex gap-2">
        <select
          v-model="uploadForm.bankType"
          class="flex-1 min-w-0 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]"
        >
          <option value="" disabled>Bank</option>
          <option v-for="b in banks" :key="b" :value="b">{{ b }}</option>
        </select>

        <input
          v-model="uploadForm.statementMonth"
          type="month"
          class="flex-1 min-w-0 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]"
        />
      </div>

      <label
        class="flex items-center gap-2 rounded-lg border-2 border-dashed px-3 py-2.5 text-sm cursor-pointer transition-colors"
        :class="isDragging
          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
          : 'border-[var(--color-border)] hover:border-[var(--color-primary)] bg-[var(--color-surface-2)] text-[var(--color-text-muted)]'"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
      >
        <svg style="width:14px;height:14px;shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="truncate text-sm">{{ uploadForm.file ? uploadForm.file.name : 'Choose or drop PDF' }}</span>
        <input ref="fileInput" type="file" accept=".pdf,application/pdf" class="sr-only" @change="onFileChange" />
      </label>

      <div v-if="store.uploadError" class="text-xs text-red-400">{{ store.uploadError }}</div>
      <div v-if="uploadSuccess" class="text-xs text-emerald-400">Statement uploaded successfully.</div>

      <button
        :disabled="!canUpload || store.uploading"
        class="w-full py-2 text-sm rounded-lg bg-[var(--color-primary)] text-white font-medium transition-opacity disabled:opacity-40"
        @click="handleUpload"
      >
        {{ store.uploading ? 'Uploading…' : 'Upload' }}
      </button>
    </div>

    <!-- Group toggle chips -->
    <div class="flex gap-2 px-4 mb-3">
      <button
        v-for="mode in (['bank', 'month'] as const)"
        :key="mode"
        class="px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize"
        :class="groupMode === mode
          ? 'bg-[var(--color-primary)] text-white'
          : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'"
        @click="groupMode = mode"
      >
        By {{ mode }}
      </button>
    </div>

    <!-- List -->
    <div class="flex-1 overflow-y-auto px-4 pb-4">
      <LoadingSpinner v-if="store.loading" />
      <ErrorMessage v-else-if="store.error" :message="store.error" :onRetry="store.fetch" />

      <template v-else>
        <div v-if="store.statements.length === 0" class="text-center py-16 text-[var(--color-text-muted)] text-sm">
          No statements yet.
        </div>

        <!-- By bank -->
        <div v-else-if="groupMode === 'bank'" class="space-y-5">
          <div v-for="(statements, bank) in store.groupedByBank" :key="bank" class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full shrink-0" :style="`background:${bankAccent(String(bank))}`" />
              <span class="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">{{ bank }}</span>
            </div>
            <div class="space-y-2">
              <StatementCard
                v-for="s in statements"
                :key="s.id"
                :statement="s"
                :onDownload="store.downloadFile"
                :onPreview="store.previewFile"
                :onDelete="store.deleteStatement"
              />
            </div>
          </div>
        </div>

        <!-- By month -->
        <div v-else class="space-y-5">
          <div v-for="(statements, month) in store.groupedByMonth" :key="month" class="space-y-2">
            <p class="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">{{ formatMonth(String(month)) }}</p>
            <div class="space-y-2">
              <StatementCard
                v-for="s in statements"
                :key="s.id"
                :statement="s"
                :onDownload="store.downloadFile"
                :onPreview="store.previewFile"
                :onDelete="store.deleteStatement"
              />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useStatementStore } from '@/stores/statement.store'
import type { BankType } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'
import StatementCard from './StatementCard.vue'

const store = useStatementStore()
const groupMode = ref<'bank' | 'month'>('bank')

const banks: BankType[] = ['BCA', 'JENIUS', 'UOB', 'BRI']

const uploadForm = ref<{ bankType: BankType | ''; statementMonth: string; file: File | null }>({
  bankType: '',
  statementMonth: '',
  file: null,
})
const isDragging = ref(false)
const uploadSuccess = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const canUpload = computed(
  () => uploadForm.value.bankType !== '' && uploadForm.value.statementMonth !== '' && uploadForm.value.file !== null
)

const BANK_ACCENT: Record<string, string> = {
  BCA: '#0066ae',
  JENIUS: '#00a3e0',
  UOB: '#ee1c24',
  BRI: '#003087',
}
function bankAccent(bank: string): string {
  return BANK_ACCENT[bank] ?? '#6366f1'
}

function onFileChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) uploadForm.value.file = f
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  const f = e.dataTransfer?.files?.[0]
  if (f && f.type === 'application/pdf') uploadForm.value.file = f
}

async function handleUpload() {
  if (!canUpload.value || !uploadForm.value.file) return
  uploadSuccess.value = false
  try {
    await store.upload(uploadForm.value.file, uploadForm.value.bankType as BankType, uploadForm.value.statementMonth)
    uploadSuccess.value = true
    uploadForm.value = { bankType: '', statementMonth: '', file: null }
    if (fileInput.value) fileInput.value.value = ''
  } catch {
    // error surfaced via store.uploadError
  }
}

function formatMonth(month: string) {
  return dayjs(month).format('MMMM YYYY')
}

onMounted(() => {
  if (!store.statements.length) store.fetch()
})
</script>

