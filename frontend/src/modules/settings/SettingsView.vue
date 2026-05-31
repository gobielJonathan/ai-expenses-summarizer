<template>
  <div class="pb-24">

    <!-- ────────────────── Toast ────────────────── -->
    <Transition name="toast">
      <div
        v-if="toast.msg"
        class="fixed top-4 left-0 right-0 z-[80] flex justify-center px-4 pointer-events-none"
      >
        <div
          class="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-medium shadow-xl"
          :style="toast.isError
            ? 'background:#2d0b0b;border:1px solid rgba(239,68,68,0.35);color:#f87171;'
            : 'background:#0b2d1a;border:1px solid rgba(16,185,129,0.35);color:#34d399;'"
        >
          <svg v-if="!toast.isError" style="width:15px;height:15px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else style="width:15px;height:15px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ toast.msg }}
        </div>
      </div>
    </Transition>

    <!-- ────────────────── ① Account card ────────────────── -->
    <div class="px-4 pt-5 pb-2">
      <div class="rounded-2xl p-4 flex items-center gap-3" style="background:var(--color-surface);border:1px solid var(--color-border);">
        <img
          v-if="authStore.user?.avatarUrl"
          :src="authStore.user.avatarUrl"
          class="w-12 h-12 rounded-full object-cover shrink-0"
          style="box-shadow:0 0 0 2px rgba(99,102,241,0.35);"
          alt="avatar"
        />
        <div
          v-else
          class="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold shrink-0"
          style="background:linear-gradient(135deg,#4f46e5,#6366f1);color:white;"
        >{{ initials }}</div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold truncate" style="color:var(--color-text)">{{ authStore.user?.name || '—' }}</p>
          <p class="text-xs truncate mt-0.5" style="color:var(--color-text-muted)">{{ authStore.user?.email || '' }}</p>
        </div>
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-opacity active:opacity-70"
          style="background:rgba(239,68,68,0.1);color:#f87171;border:1px solid rgba(239,68,68,0.2);"
          @click="handleSignOut"
        >
          <svg style="width:12px;height:12px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Sign out
        </button>
      </div>
    </div>

    <!-- ────────────────── ② Connections ────────────────── -->
    <div class="px-4 pt-4 pb-2">
      <p class="text-[10px] font-bold uppercase tracking-widest mb-2" style="color:var(--color-text-muted)">Connections</p>
      <div class="rounded-2xl overflow-hidden" style="background:var(--color-surface);border:1px solid var(--color-border);">
        <!-- WhatsApp row header -->
        <button
          class="w-full flex items-center gap-3 px-4 py-3.5 transition-colors active:opacity-70"
          @click="waOpen = !waOpen"
        >
          <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style="background:rgba(99,102,241,0.12);">
            <svg style="width:16px;height:16px;color:#818cf8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.99 2C6.465 2 2 6.466 2 11.993c0 1.984.549 3.841 1.504 5.428L2 22l4.715-1.483A9.97 9.97 0 0011.99 22C17.516 22 22 17.534 22 12.007 22 6.466 17.516 2 11.99 2z"/>
            </svg>
          </div>
          <div class="flex-1 text-left">
            <p class="text-sm font-semibold" style="color:var(--color-text)">WhatsApp</p>
            <p class="text-xs mt-0.5" style="color:var(--color-text-muted)">Query expenses via chat</p>
          </div>
          <span v-if="waStore.status?.account?.isVerified" class="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0" style="background:rgba(16,185,129,0.12);color:#34d399;">Connected</span>
          <span v-else-if="waStore.status?.account && !waStore.status.account.isVerified" class="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0" style="background:rgba(245,158,11,0.12);color:#fbbf24;">Pending OTP</span>
          <span v-else class="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0" style="background:rgba(255,255,255,0.05);color:var(--color-text-muted);">Not linked</span>
          <svg class="shrink-0 transition-transform duration-200 ml-1" :style="waOpen ? 'transform:rotate(180deg)' : ''" style="width:14px;height:14px;color:var(--color-text-muted);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- WhatsApp accordion body -->
        <Transition name="accordion">
          <div v-if="waOpen" class="overflow-hidden">
            <div class="px-4 pt-3 pb-4 space-y-3" style="border-top:1px solid var(--color-border);">
              <p v-if="waStore.loading" class="text-xs" style="color:var(--color-text-muted)">Loading…</p>
              <p v-else-if="waStore.error" class="text-xs" style="color:var(--color-danger)">{{ waStore.error }}</p>

              <!-- Verified -->
              <template v-else-if="waStore.status?.account?.isVerified">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-semibold" style="color:var(--color-text)">{{ waStore.status.account.phoneNumber }}</p>
                    <p class="text-xs mt-0.5 flex items-center gap-1" style="color:#34d399;">
                      <svg style="width:11px;height:11px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      Verified
                    </p>
                  </div>
                  <button
                    class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-opacity active:opacity-70"
                    style="background:rgba(239,68,68,0.1);color:#f87171;border:1px solid rgba(239,68,68,0.2);"
                    :disabled="actionLoading"
                    @click="handleUnlink"
                  >{{ actionLoading ? '…' : 'Unlink' }}</button>
                </div>
              </template>

              <!-- OTP pending -->
              <template v-else-if="waStore.status?.account && !waStore.status.account.isVerified">
                <div class="space-y-3">
                  <div class="flex items-center gap-2">
                    <div class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style="background:rgba(99,102,241,0.15);color:#818cf8;border:1px solid rgba(99,102,241,0.3);">1</div>
                    <p class="text-[11px] line-through" style="color:var(--color-text-muted)">Phone linked</p>
                    <div class="flex-1 h-px" style="background:var(--color-border);"/>
                    <div class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style="background:rgba(245,158,11,0.15);color:#fbbf24;border:1px solid rgba(245,158,11,0.3);">2</div>
                    <p class="text-[11px] font-semibold" style="color:#fbbf24;">Enter OTP</p>
                  </div>
                  <p class="text-xs" style="color:var(--color-text-muted);">
                    OTP sent to <strong style="color:var(--color-text);">{{ waStore.status.account.phoneNumber }}</strong>
                  </p>
                  <div class="flex gap-2">
                    <input
                      v-model="otp"
                      type="tel"
                      inputmode="numeric"
                      pattern="[0-9]*"
                      maxlength="6"
                      placeholder="• • • • • •"
                      class="flex-1 px-3 py-2.5 rounded-xl border text-sm text-center font-mono tracking-[0.35em] focus:outline-none"
                      style="background:var(--color-surface-2);border-color:rgba(245,158,11,0.4);color:var(--color-text);"
                      @keyup.enter="handleVerify"
                    />
                    <button
                      class="px-4 py-2.5 rounded-xl text-sm font-bold transition-opacity shrink-0"
                      style="background:linear-gradient(135deg,#d97706,#fbbf24);color:#0d1117;"
                      :disabled="actionLoading || otp.length !== 6"
                      :style="(actionLoading || otp.length !== 6) ? 'opacity:0.4;cursor:not-allowed' : ''"
                      @click="handleVerify"
                    >{{ actionLoading ? '…' : 'Verify' }}</button>
                  </div>
                  <button class="text-[11px] underline transition-opacity active:opacity-60" style="color:var(--color-text-muted);" :disabled="actionLoading" @click="handleUnlink">Change number</button>
                </div>
              </template>

              <!-- Not linked -->
              <template v-else>
                <div class="space-y-2">
                  <p class="text-xs" style="color:var(--color-text-muted);">Include country code, e.g. <span style="color:var(--color-text);">+628123456789</span></p>
                  <div class="flex gap-2">
                    <input
                      v-model="phoneNumber"
                      type="tel"
                      placeholder="+62812…"
                      class="flex-1 px-3 py-2.5 rounded-xl border text-sm focus:outline-none"
                      style="background:var(--color-surface-2);border-color:rgba(99,102,241,0.35);color:var(--color-text);"
                      @keyup.enter="handleLink"
                    />
                    <button
                      class="px-4 py-2.5 rounded-xl text-sm font-bold transition-opacity shrink-0"
                      style="background:linear-gradient(135deg,#4f46e5,#6366f1);color:white;"
                      :disabled="actionLoading || !phoneNumber.trim()"
                      :style="(actionLoading || !phoneNumber.trim()) ? 'opacity:0.4;cursor:not-allowed' : ''"
                      @click="handleLink"
                    >{{ actionLoading ? '…' : 'Send OTP' }}</button>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- ────────────────── ③ Data Sync ────────────────── -->
    <div class="px-4 pt-4 pb-2">
      <p class="text-[10px] font-bold uppercase tracking-widest mb-2" style="color:var(--color-text-muted)">Data Sync</p>
      <div class="rounded-2xl overflow-hidden" style="background:var(--color-surface);border:1px solid var(--color-border);">

        <!-- Sync Daily -->
        <div style="border-bottom:1px solid var(--color-border);">
          <button class="w-full flex items-center gap-3 px-4 py-3.5 active:opacity-70" @click="toggleSync('daily')">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style="background:rgba(99,102,241,0.12);">
              <svg style="width:15px;height:15px;color:#818cf8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="flex-1 text-left">
              <p class="text-sm font-semibold" style="color:var(--color-text)">Sync Daily</p>
              <p class="text-xs mt-0.5" style="color:var(--color-text-muted)">Debit &amp; credit notifications</p>
            </div>
            <svg class="shrink-0 transition-transform duration-200" :style="openSync === 'daily' ? 'transform:rotate(180deg)' : ''" style="width:14px;height:14px;color:var(--color-text-muted);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <Transition name="accordion">
            <div v-if="openSync === 'daily'" class="overflow-hidden">
              <div class="px-4 pt-2 pb-4 space-y-2" style="border-top:1px solid var(--color-border);">
                <p class="text-xs" style="color:var(--color-text-muted);">Pick a date to sync Gmail notifications for</p>
                <div class="flex gap-2">
                  <input v-model="syncDate" type="date" :max="todayDate" :disabled="anySyncing" class="flex-1 px-3 py-2.5 rounded-xl border text-sm focus:outline-none" style="background:var(--color-surface-2);border-color:rgba(99,102,241,0.35);color:var(--color-text);min-width:0;"/>
                  <button @click="handleSyncDaily" :disabled="anySyncing" class="px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shrink-0 transition-opacity" style="background:linear-gradient(135deg,#4f46e5,#6366f1);color:white;" :style="syncingDaily ? 'opacity:0.5;cursor:not-allowed' : ''">
                    <svg v-if="syncingDaily" class="animate-spin" style="width:13px;height:13px" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="40" stroke-dashoffset="10"/></svg>
                    {{ syncingDaily ? 'Syncing' : 'Sync' }}
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Sync Monthly -->
        <div style="border-bottom:1px solid var(--color-border);">
          <button class="w-full flex items-center gap-3 px-4 py-3.5 active:opacity-70" @click="toggleSync('monthly')">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style="background:rgba(16,185,129,0.1);">
              <svg style="width:15px;height:15px;color:#34d399" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="flex-1 text-left">
              <p class="text-sm font-semibold" style="color:var(--color-text)">Sync Monthly</p>
              <p class="text-xs mt-0.5" style="color:var(--color-text-muted)">Debit &amp; credit for a full month</p>
            </div>
            <svg class="shrink-0 transition-transform duration-200" :style="openSync === 'monthly' ? 'transform:rotate(180deg)' : ''" style="width:14px;height:14px;color:var(--color-text-muted);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <Transition name="accordion">
            <div v-if="openSync === 'monthly'" class="overflow-hidden">
              <div class="px-4 pt-2 pb-4 space-y-2" style="border-top:1px solid var(--color-border);">
                <p class="text-xs" style="color:var(--color-text-muted);">Pick a month to fetch all transaction emails</p>
                <div class="flex gap-2">
                  <input v-model="syncMonth" type="month" :max="currentMonth" :disabled="anySyncing" class="flex-1 px-3 py-2.5 rounded-xl border text-sm focus:outline-none" style="background:var(--color-surface-2);border-color:rgba(16,185,129,0.35);color:var(--color-text);min-width:0;"/>
                  <button @click="handleSyncMonthlyTransaction" :disabled="anySyncing" class="px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shrink-0 transition-opacity" style="background:linear-gradient(135deg,#059669,#10b981);color:white;" :style="syncingMonthlyTransaction ? 'opacity:0.5;cursor:not-allowed' : ''">
                    <svg v-if="syncingMonthlyTransaction" class="animate-spin" style="width:13px;height:13px" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="40" stroke-dashoffset="10"/></svg>
                    {{ syncingMonthlyTransaction ? 'Syncing' : 'Sync' }}
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Sync E-Statement -->
        <div>
          <button class="w-full flex items-center gap-3 px-4 py-3.5 active:opacity-70" @click="toggleSync('statement')">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style="background:rgba(245,158,11,0.1);">
              <svg style="width:15px;height:15px;color:#fbbf24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="flex-1 text-left">
              <p class="text-sm font-semibold" style="color:var(--color-text)">Sync E-Statement</p>
              <p class="text-xs mt-0.5" style="color:var(--color-text-muted)">This month's PDFs — BCA, BRI, Jenius, UOB</p>
            </div>
            <svg class="shrink-0 transition-transform duration-200" :style="openSync === 'statement' ? 'transform:rotate(180deg)' : ''" style="width:14px;height:14px;color:var(--color-text-muted);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <Transition name="accordion">
            <div v-if="openSync === 'statement'" class="overflow-hidden">
              <div class="px-4 pt-2 pb-4 space-y-2" style="border-top:1px solid var(--color-border);">
                <p class="text-xs" style="color:var(--color-text-muted);">Fetches PDF e-statements sent to your Gmail this month and queues them for parsing.</p>
                <button @click="handleSyncEstatement" :disabled="anySyncing" class="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-opacity" style="background:linear-gradient(135deg,#b45309,#fbbf24);color:#0d1117;" :style="syncingEstatement ? 'opacity:0.5;cursor:not-allowed' : ''">
                  <svg v-if="syncingEstatement" class="animate-spin" style="width:13px;height:13px" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="40" stroke-dashoffset="10"/></svg>
                  {{ syncingEstatement ? 'Syncing…' : 'Sync Now' }}
                </button>
              </div>
            </div>
          </Transition>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWhatsappStore } from '@/stores/whatsapp.store'
import { useAuthStore } from '@/stores/auth.store'
import { http } from '@/services/http'

const router = useRouter()
const waStore = useWhatsappStore()
const authStore = useAuthStore()

// ── Accordion state ──────────────────────────────────────
const waOpen = ref(false)
const openSync = ref<'daily' | 'monthly' | 'statement' | null>(null)

function toggleSync(key: 'daily' | 'monthly' | 'statement') {
  openSync.value = openSync.value === key ? null : key
}

// ── WhatsApp form ────────────────────────────────────────
const phoneNumber = ref('')
const otp = ref('')
const actionLoading = ref(false)

// ── Sync state ───────────────────────────────────────────
const syncingDaily = ref(false)
const syncingMonthlyTransaction = ref(false)
const syncingEstatement = ref(false)
const anySyncing = computed(() => syncingDaily.value || syncingMonthlyTransaction.value || syncingEstatement.value)

const todayDate = new Date().toISOString().slice(0, 10)
const currentMonth = new Date().toISOString().slice(0, 7)
const syncDate = ref(todayDate)
const syncMonth = ref(currentMonth)

// ── Toast ─────────────────────────────────────────────────
const toast = ref({ msg: '', isError: false })
let toastTimer: ReturnType<typeof setTimeout> | null = null

function showToast(msg: string, isError = false) {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { msg, isError }
  toastTimer = setTimeout(() => { toast.value = { msg: '', isError: false } }, 3500)
}

// ── Derived ──────────────────────────────────────────────
const initials = computed(() => {
  const name = authStore.user?.name ?? ''
  return name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase() || '?'
})

// ── Lifecycle ────────────────────────────────────────────
onMounted(() => waStore.fetchStatus())

// ── Handlers ─────────────────────────────────────────────
function handleSignOut() {
  authStore.logout()
  router.push('/login')
}

async function handleLink() {
  if (!phoneNumber.value.trim()) return
  actionLoading.value = true
  try {
    const msg = await waStore.link(phoneNumber.value.trim())
    await waStore.fetchStatus()
    showToast(msg)
  } catch (e) {
    showToast(e instanceof Error ? e.message : 'Failed to send OTP', true)
  } finally {
    actionLoading.value = false
  }
}

async function handleVerify() {
  if (otp.value.length !== 6) return
  actionLoading.value = true
  try {
    const msg = await waStore.verify(waStore.status?.account?.phoneNumber ?? '', otp.value)
    otp.value = ''
    showToast(msg)
  } catch (e) {
    showToast(e instanceof Error ? e.message : 'Invalid OTP', true)
  } finally {
    actionLoading.value = false
  }
}

async function handleUnlink() {
  actionLoading.value = true
  try {
    const msg = await waStore.unlink()
    phoneNumber.value = ''
    otp.value = ''
    showToast(msg)
  } catch (e) {
    showToast(e instanceof Error ? e.message : 'Failed to unlink', true)
  } finally {
    actionLoading.value = false
  }
}

async function handleSyncDaily() {
  syncingDaily.value = true
  try {
    await http.post('/gmail/sync/daily', { date: syncDate.value })
    showToast(`Daily sync triggered for ${syncDate.value}`)
  } catch (e) {
    showToast(e instanceof Error ? e.message : 'Sync failed', true)
  } finally {
    syncingDaily.value = false
  }
}

async function handleSyncMonthlyTransaction() {
  syncingMonthlyTransaction.value = true
  try {
    await http.post('/gmail/sync/monthly-transaction', { month: syncMonth.value })
    showToast(`Monthly sync triggered for ${syncMonth.value}`)
  } catch (e) {
    showToast(e instanceof Error ? e.message : 'Sync failed', true)
  } finally {
    syncingMonthlyTransaction.value = false
  }
}

async function handleSyncEstatement() {
  syncingEstatement.value = true
  try {
    await http.post('/gmail/sync/e-statement', {})
    showToast('Bank e-statement sync triggered successfully')
  } catch (e) {
    showToast(e instanceof Error ? e.message : 'Sync failed', true)
  } finally {
    syncingEstatement.value = false
  }
}
</script>

<style scoped>
/* Accordion */
.accordion-enter-active {
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s ease;
}
.accordion-leave-active {
  transition: max-height 0.22s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s ease;
}
.accordion-enter-from,
.accordion-leave-to { max-height: 0; opacity: 0; }
.accordion-enter-to,
.accordion-leave-from { max-height: 500px; opacity: 1; }

/* Toast */
.toast-enter-active {
  transition: opacity 0.22s ease, transform 0.26s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.18s ease-in;
}
.toast-enter-from { opacity: 0; transform: translateY(-12px) scale(0.92); }
.toast-leave-to   { opacity: 0; transform: translateY(-6px) scale(0.96); }
</style>
