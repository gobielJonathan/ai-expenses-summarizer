<script setup lang="ts">
const banks = [
  {
    name: 'BCA',
    fullName: 'Bank Central Asia',
    color: '#1a73e8',
    glowColor: 'rgba(26, 115, 232, 0.25)',
    bgGradient: 'from-blue-600/20 to-blue-800/10',
    borderColor: 'border-blue-500/25',
    hoverBorder: 'hover:border-blue-400/50',
    types: ['Debit', 'Credit'],
    features: ['Email notifications', 'PDF statements', 'QRIS transactions'],
    abbr: 'B',
    abbrColor: 'text-blue-300',
  },
  {
    name: 'Jenius',
    fullName: 'BTPN Digital Bank',
    color: '#00b140',
    glowColor: 'rgba(0, 177, 64, 0.25)',
    bgGradient: 'from-emerald-600/20 to-emerald-800/10',
    borderColor: 'border-emerald-500/25',
    hoverBorder: 'hover:border-emerald-400/50',
    types: ['Debit', 'Credit'],
    features: ['Email parsing', 'QRIS support', 'Real-time alerts'],
    abbr: 'J',
    abbrColor: 'text-emerald-300',
  },
  {
    name: 'UOB',
    fullName: 'United Overseas Bank',
    color: '#e60028',
    glowColor: 'rgba(230, 0, 40, 0.2)',
    bgGradient: 'from-red-600/20 to-red-800/10',
    borderColor: 'border-red-500/25',
    hoverBorder: 'hover:border-red-400/50',
    types: ['Credit'],
    features: ['Statement parsing', 'Spend categorization', 'Monthly reports'],
    abbr: 'U',
    abbrColor: 'text-red-300',
  },
  {
    name: 'BRI',
    fullName: 'Bank Rakyat Indonesia',
    color: '#005baa',
    glowColor: 'rgba(0, 91, 170, 0.25)',
    bgGradient: 'from-sky-600/20 to-sky-800/10',
    borderColor: 'border-sky-500/25',
    hoverBorder: 'hover:border-sky-400/50',
    types: ['Debit', 'Credit'],
    features: ['Email notifications', 'PDF parsing', 'Balance tracking'],
    abbr: 'R',
    abbrColor: 'text-sky-300',
  },
]

const paymentTypes = [
  {
    icon: '💳',
    name: 'Debit',
    desc: 'Direct bank deductions, ATM withdrawals, and QRIS payments',
    color: 'text-success-400',
    bg: 'from-success-600/15 to-transparent',
    border: 'border-success-500/20',
  },
  {
    icon: '🏦',
    name: 'Credit',
    desc: 'Credit card charges, installments, and statement billing',
    color: 'text-primary-400',
    bg: 'from-primary-600/15 to-transparent',
    border: 'border-primary-500/20',
  },
]
</script>

<template>
  <section id="banks" class="relative py-20 lg:py-28 overflow-hidden bg-surface">
    <!-- Decorative -->
    <div class="absolute top-0 inset-x-0 h-px divider-gradient"></div>
    <div class="absolute bottom-0 inset-x-0 h-px divider-gradient"></div>
    <div class="absolute inset-0 grid-pattern opacity-15"></div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="text-center mb-14 js-reveal">
        <div class="section-label mb-4 mx-auto">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
            <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Bank support
        </div>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
          All your <span class="text-gradient-static">Indonesian banks</span>,<br>
          one dashboard
        </h2>
        <p class="text-lg text-muted max-w-2xl mx-auto">
          Connect every major bank you use. WalletAI reads both email notifications and PDF e-statements, giving you a complete picture regardless of how your bank communicates.
        </p>
      </div>

      <!-- Bank cards -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-14">
        <div
          v-for="(bank, i) in banks"
          :key="bank.name"
          :class="[
            'js-reveal card-animated-border group p-6 relative overflow-hidden',
            `stagger-${i + 1}`,
            bank.hoverBorder
          ]"
        >
          <!-- Glow on hover -->
          <div
            class="absolute inset-0 rounded-[1rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            :style="{ background: `radial-gradient(ellipse at 50% 0%, ${bank.glowColor}, transparent 70%)` }"
          ></div>

          <!-- Bank letter avatar -->
          <div :class="['relative w-14 h-14 rounded-2xl bg-gradient-to-br border mb-4 flex items-center justify-center', bank.bgGradient, bank.borderColor]">
            <span :class="['text-2xl font-black', bank.abbrColor]">{{ bank.abbr }}</span>
          </div>

          <!-- Info -->
          <h3 class="text-xl font-black text-white mb-0.5">{{ bank.name }}</h3>
          <p class="text-xs text-muted mb-3">{{ bank.fullName }}</p>

          <!-- Payment types -->
          <div class="flex gap-1.5 mb-4">
            <span v-for="type in bank.types" :key="type" class="badge badge-purple">{{ type }}</span>
          </div>

          <!-- Features -->
          <ul class="space-y-1.5">
            <li
              v-for="feat in bank.features"
              :key="feat"
              class="flex items-center gap-2 text-xs text-muted"
            >
              <svg class="w-3.5 h-3.5 text-success-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              {{ feat }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Payment types -->
      <div class="js-reveal">
        <div class="text-center mb-6">
          <h3 class="text-xl font-bold text-white">Both payment types supported</h3>
        </div>
        <div class="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div
            v-for="type in paymentTypes"
            :key="type.name"
            :class="['glass-light rounded-2xl p-5 border flex items-start gap-4', type.border]"
          >
            <span class="text-3xl flex-shrink-0">{{ type.icon }}</span>
            <div>
              <h4 :class="['text-lg font-bold mb-1', type.color]">{{ type.name }}</h4>
              <p class="text-sm text-muted">{{ type.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
