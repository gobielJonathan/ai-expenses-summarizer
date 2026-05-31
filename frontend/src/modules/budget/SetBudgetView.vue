<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="flex items-center gap-3 px-4 pt-4 pb-3 shrink-0">
      <button
        class="w-8 h-8 flex items-center justify-center rounded-xl shrink-0"
        style="background: var(--color-surface);"
        @click="router.back()"
      >
        <svg style="width:16px;height:16px;color:var(--color-text-muted)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M19 12H5M12 5l-7 7 7 7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div>
        <h2 class="text-base font-bold text-[var(--color-text)]">Set Budget</h2>
        <p class="text-[11px]" style="color:#4a5568;">{{ setCount }} of {{ BUDGET_CATEGORIES.length }} categories set</p>
      </div>
    </div>

    <!-- Category chip scroll -->
    <div class="shrink-0 px-4 pb-3">
      <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          v-for="cat in BUDGET_CATEGORIES"
          :key="cat.key"
          class="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
          :style="selectedCat === cat.key
            ? `background:${cat.accent}22;color:${cat.accent};border:1px solid ${cat.accent}55;`
            : 'background:var(--color-surface);color:#4a5568;border:1px solid var(--color-border);'"
          @click="selectCat(cat.key)"
        >
          <span>{{ cat.emoji }}</span>
          <span>{{ cat.key.split(' ')[0] }}</span>
          <span v-if="draft[cat.key]" class="px-1.5 py-0.5 rounded-full text-[10px]"
            :style="`background:${cat.accent}33;color:${cat.accent};`">✓</span>
        </button>
      </div>
    </div>

    <!-- Selected category display -->
    <div v-if="activeCat" class="mx-4 mb-3 rounded-2xl p-4 shrink-0"
      :style="`background:${activeCat.color};border:1px solid ${activeCat.accent}33;`">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          :style="`background:${activeCat.accent}22;`">{{ activeCat.emoji }}</div>
        <div>
          <p class="text-xs font-bold text-white">{{ activeCat.key }}</p>
          <p class="text-[10px]" style="color:#4a5568;">Monthly limit</p>
        </div>
      </div>
      <!-- Amount display -->
      <div class="text-center py-2">
        <p class="text-[10px] font-semibold uppercase tracking-widest mb-1" style="color:#4a5568;">Budget Amount</p>
        <p class="text-2xl font-extrabold tabular-nums"
          :style="`color:${activeCat.accent};`">
          {{ displayAmount }}
        </p>
      </div>
    </div>
    <div v-else class="mx-4 mb-3 rounded-2xl p-6 text-center shrink-0"
      style="background:var(--color-surface);border:1px solid var(--color-border);">
      <p class="text-sm" style="color:#4a5568;">Tap a category above to set its budget</p>
    </div>

    <!-- Numpad grid -->
    <div class="px-4 shrink-0">
      <div class="grid grid-cols-3 gap-2 mb-3">
        <button
          v-for="key in numpadKeys" :key="key"
          class="py-4 rounded-xl text-base font-semibold transition-all active:scale-95"
          :style="key === '⌫'
            ? 'background:rgba(239,68,68,0.1);color:#f87171;'
            : 'background:var(--color-surface);color:white;border:1px solid var(--color-border);'"
          :disabled="!activeCat"
          @click="onNumpad(key)"
        >{{ key }}</button>
      </div>

      <!-- Action row -->
      <div class="flex gap-2 mb-3">
        <button
          class="flex-1 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
          style="background:rgba(239,68,68,0.1);color:#f87171;"
          :disabled="!activeCat"
          @click="clearCurrent"
        >Clear</button>
        <button
          class="flex-2 flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
          :style="activeCat ? `background:${activeCat.accent};` : 'background:#2d3748;'"
          :disabled="!activeCat || parseInt(amountStr, 10) === 0"
          @click="setCurrent"
        >Set Budget →</button>
      </div>
    </div>

    <!-- Save All -->
    <div class="px-4 pb-4 shrink-0">
      <button
        class="w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all active:scale-98"
        :style="saved
          ? 'background:linear-gradient(135deg,#10b981,#34d399);'
          : 'background:linear-gradient(135deg,#4f46e5,#6366f1,#818cf8);'"
        @click="handleSaveAll"
      >
        <span v-if="saved" class="flex items-center justify-center gap-2">
          <svg style="width:14px;height:14px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Saved!
        </span>
        <span v-else>Save All Budgets</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBudgetStore, BUDGET_CATEGORIES } from '@/stores/budget.store'

const router = useRouter()
const store  = useBudgetStore()
const saved  = ref(false)

const numpadKeys = ['1','2','3','4','5','6','7','8','9','000','0','⌫']

const draft       = reactive<Record<string, number>>({})
const selectedCat = ref(BUDGET_CATEGORIES[0].key)
const amountStr   = ref('0')

const activeCat = computed(() =>
  BUDGET_CATEGORIES.find(c => c.key === selectedCat.value) ?? null
)

const setCount = computed(() => Object.keys(draft).length)

const displayAmount = computed(() => {
  const n = parseInt(amountStr.value, 10) || 0
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
})

onMounted(() => {
  for (const cat of BUDGET_CATEGORIES) {
    if (store.budgets[cat.key]) draft[cat.key] = store.budgets[cat.key]
  }
  // Pre-fill amount for first category
  amountStr.value = String(draft[selectedCat.value] ?? 0) || '0'
})

function selectCat(key: string) {
  // Save current draft before switching
  const n = parseInt(amountStr.value, 10)
  if (n > 0) draft[selectedCat.value] = n
  else delete draft[selectedCat.value]

  selectedCat.value = key
  amountStr.value   = String(draft[key] ?? 0) || '0'
}

function onNumpad(key: string) {
  if (key === '⌫') {
    amountStr.value = amountStr.value.length > 1 ? amountStr.value.slice(0, -1) : '0'
  } else if (key === '000') {
    if (amountStr.value !== '0') amountStr.value += '000'
  } else {
    amountStr.value = amountStr.value === '0' ? key : amountStr.value + key
  }
}

function clearCurrent() {
  amountStr.value = '0'
  delete draft[selectedCat.value]
}

function setCurrent() {
  const n = parseInt(amountStr.value, 10)
  if (n > 0) {
    draft[selectedCat.value] = n
    // Auto-advance to next unset category
    const nextIdx = BUDGET_CATEGORIES.findIndex(c => !draft[c.key] && c.key !== selectedCat.value)
    if (nextIdx !== -1) {
      selectedCat.value = BUDGET_CATEGORIES[nextIdx].key
      amountStr.value   = String(draft[selectedCat.value] ?? 0) || '0'
    }
  }
}

function handleSaveAll() {
  for (const cat of BUDGET_CATEGORIES) {
    if (draft[cat.key] && draft[cat.key] > 0) {
      store.setBudget(cat.key, draft[cat.key])
    } else {
      delete store.budgets[cat.key]
    }
  }
  store.save()
  saved.value = true
  setTimeout(() => {
    saved.value = false
    router.back()
  }, 1200)
}
</script>

          <path d="M19 12H5M12 5l-7 7 7 7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div>
        <h2 class="text-base font-bold text-[var(--color-text)]">Set Budget</h2>
        <p class="text-[11px]" style="color:#4a5568;">Monthly spending limits per category</p>
      </div>
    </div>

    <!-- Category list -->
    <div class="flex-1 overflow-y-auto px-4 space-y-2.5 pb-28">
      <div
        v-for="cat in BUDGET_CATEGORIES"
        :key="cat.key"
        class="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
        style="background: var(--color-surface); border: 1px solid var(--color-border);"
      >
        <!-- Emoji icon -->
        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
          :style="`background: ${cat.color}`">
          {{ cat.emoji }}
        </div>

        <!-- Category name -->
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-[var(--color-text)] truncate">{{ cat.key }}</p>
          <p v-if="draft[cat.key]" class="text-[10px] mt-0.5" :style="`color: ${cat.accent}`">
            {{ formatCurrency(draft[cat.key]) }} / month
          </p>
          <p v-else class="text-[10px] mt-0.5" style="color:#4a5568;">No limit set</p>
        </div>

        <!-- Amount input -->
        <div class="relative shrink-0 w-28">
          <span class="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-medium" style="color:#4a5568;">Rp</span>
          <input
            :value="draft[cat.key] ? String(draft[cat.key]) : ''"
            type="number"
            min="0"
            step="10000"
            placeholder="0"
            class="w-full pl-7 pr-2 py-2 rounded-xl text-xs text-right font-semibold focus:outline-none transition-colors text-[var(--color-text)]"
            style="background: var(--color-surface-2); border: 1px solid var(--color-border);"
            @focus="(e) => (e.target as HTMLInputElement).select()"
            @input="(e) => onInput(cat.key, (e.target as HTMLInputElement).value)"
          />
        </div>
      </div>
    </div>

    <!-- Save button — pinned above bottom nav -->
    <div class="absolute bottom-16 left-0 right-0 px-4 pb-2 max-w-[375px] mx-auto">
      <button
        class="w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all active:scale-95"
        :style="saved
          ? 'background: linear-gradient(135deg, #10b981, #34d399);'
          : 'background: linear-gradient(135deg, #4f46e5, #6366f1, #818cf8);'"
        @click="handleSave"
      >
        <span v-if="saved" class="flex items-center justify-center gap-2">
          <svg style="width:14px;height:14px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Saved!
        </span>
        <span v-else>Save All Budgets</span>
      </button>
    </div>
  </div>
</template>
