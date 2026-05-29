<template>
  <div class="space-y-6">
    <h2 class="text-xl font-bold">E-Statements</h2>

    <!-- Upload form -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 space-y-4">
      <h3 class="text-sm font-semibold">Upload Statement</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select
          v-model="uploadForm.bankType"
          class="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]"
        >
          <option value="" disabled>Select bank</option>
          <option v-for="b in banks" :key="b" :value="b">{{ b }}</option>
        </select>

        <input
          v-model="uploadForm.statementMonth"
          type="month"
          class="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]"
        />

        <!-- Drop zone / file picker -->
        <label
          class="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed px-3 py-2 text-sm cursor-pointer transition-colors"
          :class="isDragging
            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
            : 'border-[var(--color-border)] hover:border-[var(--color-primary)] bg-[var(--color-surface-2)]'"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="onDrop"
        >
          <span class="truncate max-w-[160px]">{{ uploadForm.file ? uploadForm.file.name : 'Choose or drop PDF' }}</span>
          <input ref="fileInput" type="file" accept=".pdf,application/pdf" class="sr-only" @change="onFileChange" />
        </label>
      </div>

      <div v-if="store.uploadError" class="text-xs text-red-500">{{ store.uploadError }}</div>
      <div v-if="uploadSuccess" class="text-xs text-green-500">Statement uploaded successfully.</div>

      <button
        :disabled="!canUpload || store.uploading"
        class="px-4 py-2 text-sm rounded-lg bg-[var(--color-primary)] text-white transition-opacity disabled:opacity-40"
        @click="handleUpload"
      >
        {{ store.uploading ? 'Uploading…' : 'Upload' }}
      </button>
    </div>

    <LoadingSpinner v-if="store.loading" />
    <ErrorMessage v-else-if="store.error" :message="store.error" :onRetry="store.fetch" />

    <template v-else>
      <!-- View toggle -->
      <div class="flex gap-2">
        <button
          v-for="mode in (['bank', 'month'] as const)"
          :key="mode"
          class="px-4 py-1.5 text-sm rounded-lg transition-colors capitalize"
          :class="groupMode === mode
            ? 'bg-[var(--color-primary)] text-white'
            : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'"
          @click="groupMode = mode"
        >
          By {{ mode }}
        </button>
      </div>

      <!-- Grouped by bank -->
      <div v-if="groupMode === 'bank'" class="space-y-4">
        <div v-for="(statements, bank) in store.groupedByBank" :key="bank">
          <h3 class="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">{{ bank }}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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

      <!-- Grouped by month -->
      <div v-else class="space-y-4">
        <div v-for="(statements, month) in store.groupedByMonth" :key="month">
          <h3 class="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">
            {{ formatMonth(month) }}
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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

      <div v-if="store.statements.length === 0" class="text-center py-16 text-[var(--color-text-muted)]">
        No statements found.
      </div>
    </template>
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

