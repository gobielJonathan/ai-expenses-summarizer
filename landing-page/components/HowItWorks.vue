<script setup lang="ts">
const steps = [
  {
    number: '01',
    title: 'Connect Gmail',
    description: 'Set up n8n to watch your Gmail inbox. It automatically detects bank transaction emails from BCA, Jenius, UOB, and BRI the moment they arrive.',
    color: 'from-primary-500 to-primary-600',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    badge: 'Gmail OAuth',
    badgeClass: 'badge-purple',
    icon: `<path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  {
    number: '02',
    title: 'AI Parses Transactions',
    description: 'The backend extracts structured transaction data from emails and PDF statements using AI. Merchant, amount, date, bank, payment type — all captured.',
    color: 'from-accent-500 to-accent-600',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    badge: 'Gemini AI',
    badgeClass: 'badge-cyan',
    icon: `<path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  {
    number: '03',
    title: 'Smart Categorization',
    description: 'Every transaction is sent to Gemini AI which assigns a category and subcategory based on merchant context — Food & Beverage, Transport, Entertainment, and more.',
    color: 'from-violet-500 to-violet-600',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    badge: 'No Rules',
    badgeClass: 'badge-purple',
    icon: `<path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  {
    number: '04',
    title: 'View Your Analytics',
    description: 'Log in to your dashboard. See spending trends, category breakdowns, daily habits, bank summaries, and AI-generated prose insights about your finances.',
    color: 'from-success-500 to-success-600',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    badge: 'Live Dashboard',
    badgeClass: 'badge-green',
    icon: `<path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
]
</script>

<template>
  <section id="how-it-works" class="relative py-20 lg:py-28 bg-surface overflow-hidden">

    <!-- Background pattern -->
    <div class="absolute inset-0 grid-pattern opacity-20"></div>
    <div class="absolute top-0 inset-x-0 h-px divider-gradient"></div>
    <div class="absolute bottom-0 inset-x-0 h-px divider-gradient"></div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="text-center mb-16 lg:mb-20 js-reveal">
        <div class="section-label mb-4 mx-auto">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          How it works
        </div>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
          Set up once, <span class="text-gradient-static">works forever</span>
        </h2>
        <p class="text-lg text-muted max-w-2xl mx-auto">
          A four-step pipeline from raw email to polished analytics. Fully automated, AI-powered, zero maintenance.
        </p>
      </div>

      <!-- Steps — desktop: horizontal timeline, mobile: vertical -->
      <div class="relative">
        <!-- Connecting line (desktop) -->
        <div class="hidden lg:block absolute top-12 left-0 right-0 h-px
                    bg-gradient-to-r from-transparent via-primary-500/40 to-transparent z-0"></div>

        <div class="grid lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
          <div
            v-for="(step, i) in steps"
            :key="step.number"
            :class="['js-reveal text-center lg:text-left group', `stagger-${i + 1}`]"
          >
            <!-- Number badge + icon -->
            <div class="flex justify-center lg:justify-start mb-5">
              <div class="relative">
                <!-- Glow ring -->
                <div
                  :class="['absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300']"
                  :style="{ background: step.glowColor }"
                ></div>
                <!-- Icon container -->
                <div :class="['relative w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br text-white shadow-lg', step.color]">
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" v-html="step.icon"></svg>
                </div>
                <!-- Step number -->
                <div class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-card border border-white/15
                            flex items-center justify-center text-xs font-black text-muted">
                  {{ i + 1 }}
                </div>
              </div>
            </div>

            <!-- Content -->
            <span :class="['badge mb-2', step.badgeClass]">{{ step.badge }}</span>
            <h3 class="text-lg lg:text-xl font-bold text-white mb-2.5 group-hover:text-primary-300 transition-colors duration-200">
              {{ step.title }}
            </h3>
            <p class="text-sm text-muted leading-relaxed">{{ step.description }}</p>
          </div>
        </div>
      </div>

      <!-- Flow diagram (bottom visual) -->
      <div class="mt-16 js-reveal">
        <div class="glass border border-white/8 rounded-2xl p-6 lg:p-8 overflow-x-auto">
          <div class="flex items-center justify-center gap-2 lg:gap-4 min-w-max mx-auto">
            <template v-for="(item, i) in ['Gmail API', 'n8n', 'Express API', 'AI · Gemini', 'PostgreSQL', 'Vue Dashboard']" :key="item">
              <div class="flex flex-col items-center gap-1.5">
                <div class="px-3 py-1.5 rounded-lg glass-light border border-white/8 text-xs font-semibold text-white whitespace-nowrap">
                  {{ item }}
                </div>
              </div>
              <div v-if="i < 5" class="flex items-center">
                <svg class="w-4 h-4 text-primary-500/60" viewBox="0 0 24 24" fill="none">
                  <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
