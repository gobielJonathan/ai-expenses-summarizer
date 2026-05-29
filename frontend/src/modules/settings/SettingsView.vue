<template>
  <div class="max-w-xl mx-auto space-y-6 p-4 md:p-6">
    <h2 class="text-xl font-semibold text-[var(--color-text)]">Settings</h2>

    <!-- WhatsApp Linking Card -->
    <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5 space-y-4">
      <div class="flex items-center gap-3">
        <span class="text-2xl">💬</span>
        <div>
          <h3 class="font-semibold text-[var(--color-text)]">WhatsApp Integration</h3>
          <p class="text-xs text-[var(--color-text-muted)]">Link your number to query expenses via WhatsApp</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="store.loading" class="text-sm text-[var(--color-text-muted)]">Loading…</div>

      <!-- Error -->
      <p v-else-if="store.error" class="text-sm text-[var(--color-danger)]">{{ store.error }}</p>

      <!-- Already linked & verified -->
      <template v-else-if="store.status?.account?.isVerified">
        <div class="flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface-2)]">
          <div>
            <p class="text-sm font-medium text-[var(--color-text)]">{{ store.status.account.phoneNumber }}</p>
            <p class="text-xs text-green-500 mt-0.5">✓ Verified</p>
          </div>
          <button
            class="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-danger)] text-[var(--color-danger)] hover:bg-red-50 transition-colors"
            :disabled="actionLoading"
            @click="handleUnlink"
          >
            Unlink
          </button>
        </div>
      </template>

      <!-- Linked but not verified — show OTP step -->
      <template v-else-if="store.status?.account && !store.status.account.isVerified">
        <div class="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-sm text-yellow-700">
          OTP sent to <strong>{{ store.status.account.phoneNumber }}</strong>. Check your WhatsApp.
        </div>
        <div class="space-y-2">
          <label class="block text-xs font-medium text-[var(--color-text-muted)]">Enter 6-digit OTP</label>
          <div class="flex gap-2">
            <input
              v-model="otp"
              maxlength="6"
              placeholder="123456"
              class="flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              @keyup.enter="handleVerify"
            />
            <button
              class="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
              :disabled="actionLoading || otp.length !== 6"
              @click="handleVerify"
            >
              {{ actionLoading ? 'Verifying…' : 'Verify' }}
            </button>
          </div>
          <button
            class="text-xs text-[var(--color-text-muted)] hover:underline"
            :disabled="actionLoading"
            @click="handleUnlink"
          >
            Change number
          </button>
        </div>
      </template>

      <!-- Not linked — show link form -->
      <template v-else>
        <div class="space-y-2">
          <label class="block text-xs font-medium text-[var(--color-text-muted)]">WhatsApp number (with country code)</label>
          <div class="flex gap-2">
            <input
              v-model="phoneNumber"
              placeholder="+628123456789"
              class="flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              @keyup.enter="handleLink"
            />
            <button
              class="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
              :disabled="actionLoading || !phoneNumber.trim()"
              @click="handleLink"
            >
              {{ actionLoading ? 'Sending…' : 'Link' }}
            </button>
          </div>
        </div>
      </template>

      <!-- Feedback message -->
      <p v-if="feedback" class="text-sm" :class="feedbackError ? 'text-[var(--color-danger)]' : 'text-green-500'">
        {{ feedback }}
      </p>
    </div>

    <!-- Gmail Sync Card -->
    <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5 space-y-4">
      <div class="flex items-center gap-3">
        <span class="text-2xl">📧</span>
        <div>
          <h3 class="font-semibold text-[var(--color-text)]">Gmail Sync</h3>
          <p class="text-xs text-[var(--color-text-muted)]">Manually trigger email transaction sync</p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-3">
        <!-- Sync Transaction Daily -->
        <div class="flex items-stretch gap-2">
          <input
            v-model="syncDate"
            type="date"
            :max="todayDate"
            :disabled="anySyncing"
            class="px-3 py-2 rounded-xl text-sm border bg-[var(--color-surface-2)] text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-50"
            style="border-color: rgba(99,102,241,0.35); min-width: 0; flex: 1 1 0;"
          />
          <button
            @click="handleSyncDaily"
            :disabled="anySyncing"
            class="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all shrink-0"
            style="background: rgba(99,102,241,0.12); color: #818cf8; border: 1px solid rgba(99,102,241,0.25);"
            :style="syncingDaily ? 'opacity:0.6;cursor:not-allowed' : 'cursor:pointer'"
          >
            <svg v-if="syncingDaily" class="animate-spin shrink-0" style="width:16px;height:16px" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="40" stroke-dashoffset="10" />
            </svg>
            <svg v-else class="shrink-0" style="width:16px;height:16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-left">
              <span class="block">{{ syncingDaily ? 'Syncing…' : 'Sync Daily' }}</span>
              <span class="block text-xs opacity-60 font-normal">debit &amp; credit</span>
            </span>
          </button>
        </div>

        <!-- Sync Transaction Monthly -->
        <div class="flex items-stretch gap-2">
          <input
            v-model="syncMonth"
            type="month"
            :max="currentMonth"
            :disabled="anySyncing"
            class="px-3 py-2 rounded-xl text-sm border bg-[var(--color-surface-2)] text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-50"
            style="border-color: rgba(16,185,129,0.35); min-width: 0; flex: 1 1 0;"
          />
          <button
            @click="handleSyncMonthlyTransaction"
            :disabled="anySyncing"
            class="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all shrink-0"
            style="background: rgba(16,185,129,0.1); color: #34d399; border: 1px solid rgba(16,185,129,0.2);"
            :style="syncingMonthlyTransaction ? 'opacity:0.6;cursor:not-allowed' : 'cursor:pointer'"
          >
            <svg v-if="syncingMonthlyTransaction" class="animate-spin shrink-0" style="width:16px;height:16px" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="40" stroke-dashoffset="10" />
            </svg>
            <svg v-else class="shrink-0" style="width:16px;height:16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-left">
              <span class="block">{{ syncingMonthlyTransaction ? 'Syncing…' : 'Sync Monthly' }}</span>
              <span class="block text-xs opacity-60 font-normal">debit &amp; credit</span>
            </span>
          </button>
        </div>

        <!-- Sync Bank E-Statement -->
        <button
          @click="handleSyncEstatement"
          :disabled="anySyncing"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full"
          style="background: rgba(245,158,11,0.1); color: #fbbf24; border: 1px solid rgba(245,158,11,0.2);"
          :style="syncingEstatement ? 'opacity:0.6;cursor:not-allowed' : 'cursor:pointer'"
        >
          <svg v-if="syncingEstatement" class="animate-spin shrink-0" style="width:16px;height:16px" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="40" stroke-dashoffset="10" />
          </svg>
          <svg v-else class="shrink-0" style="width:16px;height:16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="text-left">
            <span class="block">{{ syncingEstatement ? 'Syncing…' : 'Sync Bank E-Statement' }}</span>
            <span class="block text-xs opacity-60 font-normal">This month's PDF statements (BCA, BRI, Jenius, UOB)</span>
          </span>
        </button>
      </div>

      <!-- Sync feedback -->
      <p v-if="syncFeedback" class="text-sm" :class="syncFeedbackError ? 'text-[var(--color-danger)]' : 'text-green-500'">
        {{ syncFeedback }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWhatsappStore } from '@/stores/whatsapp.store'
import { http } from '@/services/http'

const store = useWhatsappStore()
const phoneNumber = ref('')
const otp = ref('')
const actionLoading = ref(false)
const feedback = ref('')
const feedbackError = ref(false)

const syncingDaily = ref(false)
const syncingMonthlyTransaction = ref(false)
const syncingEstatement = ref(false)
const syncFeedback = ref('')
const syncFeedbackError = ref(false)
const anySyncing = computed(() => syncingDaily.value || syncingMonthlyTransaction.value || syncingEstatement.value)

// Date pickers — default to today / current month
const todayDate = new Date().toISOString().slice(0, 10)            // YYYY-MM-DD
const currentMonth = new Date().toISOString().slice(0, 7)          // YYYY-MM
const syncDate = ref(todayDate)
const syncMonth = ref(currentMonth)

onMounted(() => store.fetchStatus())

function setFeedback(msg: string, isError = false) {
  feedback.value = msg
  feedbackError.value = isError
  setTimeout(() => { feedback.value = '' }, 4000)
}

function setSyncFeedback(msg: string, isError = false) {
  syncFeedback.value = msg
  syncFeedbackError.value = isError
  setTimeout(() => { syncFeedback.value = '' }, 4000)
}

async function handleSyncDaily() {
  syncingDaily.value = true
  try {
    await http.post('/gmail/sync/daily', { date: syncDate.value })
    setSyncFeedback(`Daily sync triggered for ${syncDate.value}`)
  } catch (e) {
    setSyncFeedback(e instanceof Error ? e.message : 'Sync failed', true)
  } finally {
    syncingDaily.value = false
  }
}

async function handleSyncMonthlyTransaction() {
  syncingMonthlyTransaction.value = true
  try {
    await http.post('/gmail/sync/monthly-transaction', { month: syncMonth.value })
    setSyncFeedback(`Monthly sync triggered for ${syncMonth.value}`)
  } catch (e) {
    setSyncFeedback(e instanceof Error ? e.message : 'Sync failed', true)
  } finally {
    syncingMonthlyTransaction.value = false
  }
}

async function handleSyncEstatement() {
  syncingEstatement.value = true
  try {
    await http.post('/gmail/sync/e-statement', {})
    setSyncFeedback('Bank e-statement sync triggered successfully')
  } catch (e) {
    setSyncFeedback(e instanceof Error ? e.message : 'Sync failed', true)
  } finally {
    syncingEstatement.value = false
  }
}

async function handleLink() {
  if (!phoneNumber.value.trim()) return
  actionLoading.value = true
  try {
    const msg = await store.link(phoneNumber.value.trim())
    await store.fetchStatus()
    setFeedback(msg)
  } catch (e) {
    setFeedback(e instanceof Error ? e.message : 'Failed to send OTP', true)
  } finally {
    actionLoading.value = false
  }
}

async function handleVerify() {
  if (otp.value.length !== 6) return
  actionLoading.value = true
  try {
    const msg = await store.verify(store.status?.account?.phoneNumber ?? '', otp.value)
    otp.value = ''
    setFeedback(msg)
  } catch (e) {
    setFeedback(e instanceof Error ? e.message : 'Invalid OTP', true)
  } finally {
    actionLoading.value = false
  }
}

async function handleUnlink() {
  actionLoading.value = true
  try {
    const msg = await store.unlink()
    phoneNumber.value = ''
    otp.value = ''
    setFeedback(msg)
  } catch (e) {
    setFeedback(e instanceof Error ? e.message : 'Failed to unlink', true)
  } finally {
    actionLoading.value = false
  }
}
</script>
