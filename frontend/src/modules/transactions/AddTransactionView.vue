<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="flex items-center gap-3 px-4 pt-4 pb-2 shrink-0">
      <button
        class="w-8 h-8 flex items-center justify-center rounded-xl shrink-0"
        style="background: var(--color-surface);"
        @click="router.back()"
      >
        <svg style="width:16px;height:16px;color:var(--color-text-muted)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M19 12H5M12 5l-7 7 7 7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h2 class="text-base font-bold text-[var(--color-text)]">Add Transaction</h2>
    </div>

    <!-- Amount hero -->
    <div class="px-4 pt-3 pb-4 text-center shrink-0">
      <!-- Debit / Credit toggle -->
      <div class="flex justify-center mb-3">
        <div class="flex rounded-xl overflow-hidden" style="background:var(--color-surface);border:1px solid var(--color-border);">
          <button
            v-for="pt in paymentTypes" :key="pt.value"
            class="px-6 py-2 text-xs font-bold transition-all"
            :style="form.paymentType === pt.value
              ? `background:${pt.color};color:white;`
              : 'background:transparent;color:#4a5568;'"
            @click="form.paymentType = pt.value as PaymentType"
          >{{ pt.label }}</button>
        </div>
      </div>
      <p class="text-[10px] font-semibold uppercase tracking-widest mb-1" style="color:#4a5568;">Amount</p>
      <p class="text-3xl font-extrabold tabular-nums leading-tight"
        :style="form.paymentType === 'CREDIT' ? 'color:#10b981;' : 'color:white;'">
        {{ displayAmount }}
      </p>
    </div>

    <!-- Scrollable details -->
    <div class="flex-1 overflow-y-auto px-4 space-y-3 pb-4">

      <!-- Merchant -->
      <div>
        <label class="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style="color:#4a5568;">Merchant</label>
        <input
          v-model="form.merchant"
          type="text"
          placeholder="e.g. Starbucks, Grab, Tokopedia"
          class="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
          style="background:var(--color-surface);border:1px solid var(--color-border);color:var(--color-text);"
        />
      </div>

      <!-- Category chips -->
      <div>
        <label class="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style="color:#4a5568;">Category</label>
        <div class="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            v-for="cat in BUDGET_CATEGORIES" :key="cat.key"
            class="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            :style="form.category === cat.key
              ? `background:${cat.accent}22;color:${cat.accent};border:1px solid ${cat.accent}55;`
              : 'background:var(--color-surface);color:#4a5568;border:1px solid var(--color-border);'"
            @click="form.category = cat.key"
          >{{ cat.emoji }} {{ cat.key }}</button>
        </div>
      </div>

      <!-- Bank chips -->
      <div>
        <label class="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style="color:#4a5568;">Bank</label>
        <div class="flex gap-2">
          <button
            v-for="bank in banks" :key="bank"
            class="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
            :style="form.bankType === bank
              ? `background:${bankColor(bank)}22;color:${bankColor(bank)};border:1px solid ${bankColor(bank)}55;`
              : 'background:var(--color-surface);color:#4a5568;border:1px solid var(--color-border);'"
            @click="form.bankType = bank as BankType"
          >{{ bank }}</button>
        </div>
      </div>

      <!-- Date -->
      <div>
        <label class="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style="color:#4a5568;">Date</label>
        <input
          v-model="form.date"
          type="date"
          class="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
          style="background:var(--color-surface);border:1px solid var(--color-border);color:var(--color-text);"
        />
      </div>

      <!-- Numpad -->
      <div>
        <label class="block text-[10px] font-semibold uppercase tracking-wider mb-2" style="color:#4a5568;">Enter Amount</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="key in numpadKeys" :key="key"
            class="py-4 rounded-xl text-base font-semibold transition-all active:scale-95"
            :style="key === '⌫'
              ? 'background:rgba(239,68,68,0.1);color:#f87171;'
              : 'background:var(--color-surface);color:white;border:1px solid var(--color-border);'"
            @click="onNumpad(key)"
          >{{ key }}</button>
        </div>
      </div>

      <!-- Save -->
      <button
        :disabled="saving || !isValid"
        class="w-full py-4 rounded-2xl text-sm font-bold text-white transition-all active:scale-98 disabled:opacity-40"
        style="background:linear-gradient(135deg,#4f46e5,#6366f1,#818cf8);"
        @click="handleSave"
      >
        {{ saving ? 'Saving…' : 'Save Transaction' }}
      </button>

      <p v-if="errorMsg" class="text-xs text-center" style="color:#f87171;">{{ errorMsg }}</p>
      <p v-if="successMsg" class="text-xs text-center" style="color:#10b981;">{{ successMsg }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '@/services/http'
import type { BankType, PaymentType } from '@/types'
import { BUDGET_CATEGORIES } from '@/stores/budget.store'

const router = useRouter()

const banks: BankType[] = ['BCA', 'JENIUS', 'UOB', 'BRI']
const paymentTypes = [
  { value: 'DEBIT',  label: 'Expense', color: '#6366f1' },
  { value: 'CREDIT', label: 'Income',  color: '#10b981' },
]
const numpadKeys = ['1','2','3','4','5','6','7','8','9','000','0','⌫']

const BANK_COLORS: Record<string, string> = {
  BCA: '#0066ae', JENIUS: '#00a3e0', UOB: '#ee1c24', BRI: '#003087',
}
function bankColor(b: string) { return BANK_COLORS[b] ?? '#6366f1' }

const form = reactive({
  merchant:    '',
  category:    '',
  bankType:    '' as BankType | '',
  paymentType: 'DEBIT' as PaymentType,
  date:        new Date().toISOString().slice(0, 10),
})

const amountStr = ref('0')

const displayAmount = computed(() => {
  const n = parseInt(amountStr.value, 10) || 0
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
})

const isValid = computed(() =>
  parseInt(amountStr.value, 10) > 0 &&
  form.merchant.trim() !== '' &&
  form.bankType !== ''
)

function onNumpad(key: string) {
  if (key === '⌫') {
    amountStr.value = amountStr.value.length > 1 ? amountStr.value.slice(0, -1) : '0'
  } else if (key === '000') {
    if (amountStr.value !== '0') amountStr.value += '000'
  } else {
    amountStr.value = amountStr.value === '0' ? key : amountStr.value + key
  }
}

const saving    = ref(false)
const errorMsg  = ref('')
const successMsg = ref('')

async function handleSave() {
  if (!isValid.value) return
  saving.value   = true
  errorMsg.value = ''
  try {
    await http.post('/transactions', {
      merchant:         form.merchant.trim(),
      amount:           parseInt(amountStr.value, 10),
      bank_type:        form.bankType,
      payment_type:     form.paymentType,
      category:         form.category || 'Other',
      transaction_date: form.date,
      currency:         'IDR',
    })
    successMsg.value = 'Transaction saved!'
    setTimeout(() => router.back(), 900)
  } catch (e) {
    errorMsg.value = e instanceof Error ? e.message : 'Failed to save'
  } finally {
    saving.value = false
  }
}
</script>
