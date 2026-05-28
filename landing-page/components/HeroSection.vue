<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const { bindParallax, cleanup } = useParallax()

onMounted(() => {
  bindParallax('.hero-blob', 0.18)
})

onUnmounted(() => cleanup())

const floatingCards = [
  {
    bank: 'BCA',
    bankColor: 'text-blue-400',
    dot: 'bg-blue-400',
    merchant: 'Starbucks',
    amount: 'Rp 45.000',
    category: 'Food & Bev',
    categoryClass: 'badge-orange',
    icon: '☕',
    posClass: 'top-24 -left-4 lg:top-32 lg:-left-16',
    animClass: 'animate-float-1',
  },
  {
    bank: 'Jenius',
    bankColor: 'text-emerald-400',
    dot: 'bg-emerald-400',
    merchant: 'GrabCar',
    amount: 'Rp 28.000',
    category: 'Transport',
    categoryClass: 'badge-cyan',
    icon: '🚗',
    posClass: 'top-20 -right-4 lg:top-28 lg:-right-20',
    animClass: 'animate-float-2',
  },
  {
    bank: 'UOB',
    bankColor: 'text-red-400',
    dot: 'bg-red-400',
    merchant: 'Netflix',
    amount: 'Rp 169.000',
    category: 'Entertainment',
    categoryClass: 'badge-purple',
    icon: '🎬',
    posClass: 'bottom-24 -left-4 lg:bottom-32 lg:-left-20',
    animClass: 'animate-float-3',
  },
  {
    bank: 'BRI',
    bankColor: 'text-sky-400',
    dot: 'bg-sky-400',
    merchant: 'Indomaret',
    amount: 'Rp 87.500',
    category: 'Groceries',
    categoryClass: 'badge-green',
    icon: '🛒',
    posClass: 'bottom-20 -right-4 lg:bottom-28 lg:-right-16',
    animClass: 'animate-float-4',
  },
]
</script>

<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden">

    <!-- ── Aurora background ───────────────────────────── -->
    <div class="absolute inset-0 pointer-events-none select-none">
      <!-- Gradient blobs -->
      <div class="hero-blob absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full
                  bg-primary-700/20 blur-[120px] animate-aurora-1"></div>
      <div class="hero-blob absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full
                  bg-accent-500/15 blur-[100px] animate-aurora-2"></div>
      <div class="hero-blob absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full
                  bg-success-500/10 blur-[100px] animate-aurora-3"></div>

      <!-- Grid dots -->
      <div class="absolute inset-0 grid-pattern opacity-40"></div>
      <!-- Vignette -->
      <div class="absolute inset-0 bg-gradient-to-b from-bg/0 via-bg/0 to-bg"></div>
    </div>

    <!-- ── Main content ───────────────────────────────── -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

        <!-- Left: Copy -->
        <div class="flex-1 max-w-2xl text-center lg:text-left">

          <!-- Badge -->
          <div class="inline-flex items-center gap-2 mb-6 animate-slide-down">
            <span class="section-label">
              <span class="relative flex h-2 w-2">
                <span class="animate-badge-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-success-500"></span>
              </span>
              Powered by Gemini AI
            </span>
          </div>

          <!-- Headline -->
          <h1 class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08] mb-6
                     animate-slide-down delay-100">
            Your Money,<br>
            <span class="text-gradient">Automated</span><br>
            by AI.
          </h1>

          <!-- Subheadline -->
          <p class="text-lg sm:text-xl text-muted leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0
                     animate-slide-down delay-200">
            Connect Gmail once. AI reads your bank emails, parses e-statements, and categorizes
            every transaction from <strong class="text-white/80">BCA, Jenius, UOB & BRI</strong>
            — automatically, privately, forever.
          </p>

          <!-- CTAs -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start
                      animate-slide-down delay-300">
            <a
              href="#get-started"
              class="btn-primary text-base px-7 py-3.5 animate-pulse-glow"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Deploy for Free
            </a>
            <a href="#dashboard" class="btn-outline text-base px-7 py-3.5">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M10 8l6 4-6 4V8z" fill="currentColor"/>
              </svg>
              See Dashboard
            </a>
          </div>

          <!-- Trust badges -->
          <div class="flex flex-wrap items-center gap-4 mt-8 justify-center lg:justify-start
                      animate-slide-down delay-400">
            <div class="flex items-center gap-1.5 text-sm text-muted">
              <svg class="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd"/>
              </svg>
              Self-hosted & private
            </div>
            <div class="flex items-center gap-1.5 text-sm text-muted">
              <svg class="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              No monthly fees
            </div>
            <div class="flex items-center gap-1.5 text-sm text-muted">
              <svg class="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              Open source
            </div>
          </div>
        </div>

        <!-- Right: Floating card cluster -->
        <div class="flex-1 relative w-full max-w-md lg:max-w-lg h-80 lg:h-[520px]">
          <!-- Center glow -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="w-64 h-64 rounded-full bg-primary-600/20 blur-3xl"></div>
          </div>

          <!-- Central AI badge -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="relative">
              <div class="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl glass border border-primary-500/30
                          flex items-center justify-center glow-primary">
                <svg class="w-10 h-10 lg:w-12 lg:h-12 text-primary-400 animate-spin-slow" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-success-500/20 border border-success-500/30 text-success-400 text-xs font-bold">
                AI
              </div>
            </div>
          </div>

          <!-- Floating transaction cards -->
          <div
            v-for="card in floatingCards"
            :key="card.merchant"
            :class="['absolute tx-card', card.posClass, card.animClass]"
          >
            <div class="flex items-center justify-between mb-1.5">
              <span :class="['text-xs font-bold', card.bankColor]">{{ card.bank }}</span>
              <span class="text-xs text-subtle">Auto</span>
            </div>
            <div class="flex items-center gap-2 mb-1.5">
              <span class="text-base">{{ card.icon }}</span>
              <span class="text-sm font-semibold text-white">{{ card.merchant }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-white">{{ card.amount }}</span>
              <span :class="['badge text-xs', card.categoryClass]">{{ card.category }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Scroll indicator ───────────────────────────── -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
      <span class="text-xs text-muted tracking-widest uppercase">Scroll</span>
      <svg class="w-4 h-6 text-muted animate-bounce" viewBox="0 0 16 24" fill="none">
        <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="8" cy="7" r="2" fill="currentColor"/>
      </svg>
    </div>
  </section>
</template>
