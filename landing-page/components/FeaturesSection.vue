<script setup lang="ts">
const features = [
  {
    title: 'AI Transaction Categorization',
    description: 'Every transaction is automatically categorized by Gemini AI. No rules. No manual tags. AI understands merchant context and assigns the right category.',
    badge: 'Core Feature',
    badgeClass: 'badge-purple',
    iconColor: '#818cf8',
    iconBg: 'from-primary-700/30 to-primary-900/10',
    borderHover: 'hover:border-primary-500/40',
    icon: `<path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  {
    title: 'Multi-Bank Support',
    description: 'Connect all your Indonesian bank accounts. BCA, Jenius, UOB, and BRI — debit and credit cards, all parsed and unified in one dashboard.',
    badge: '4 Banks',
    badgeClass: 'badge-cyan',
    iconColor: '#22d3ee',
    iconBg: 'from-accent-500/30 to-accent-600/10',
    borderHover: 'hover:border-accent-500/40',
    icon: `<path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  {
    title: 'Smart Analytics Dashboard',
    description: 'Interactive charts for monthly trends, daily spending, top categories, bank breakdowns, and debit vs credit analysis. All in one beautiful UI.',
    badge: 'Visual',
    badgeClass: 'badge-green',
    iconColor: '#34d399',
    iconBg: 'from-success-500/30 to-success-600/10',
    borderHover: 'hover:border-success-500/40',
    icon: `<path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  {
    title: 'Gmail Automation via n8n',
    description: 'n8n watches your Gmail for bank notification emails. Transactions are extracted the moment they arrive — no manual checking needed.',
    badge: 'Automation',
    badgeClass: 'badge-orange',
    iconColor: '#fbbf24',
    iconBg: 'from-yellow-500/30 to-yellow-600/10',
    borderHover: 'hover:border-yellow-500/40',
    icon: `<path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  {
    title: 'PDF Statement Parsing',
    description: 'Upload your monthly e-statement PDFs. AI parses every line item, extracts transactions, and loads them into your dashboard automatically.',
    badge: 'Upload',
    badgeClass: 'badge-purple',
    iconColor: '#a78bfa',
    iconBg: 'from-violet-500/30 to-violet-600/10',
    borderHover: 'hover:border-violet-500/40',
    icon: `<path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  {
    title: 'Self-Hosted & 100% Private',
    description: 'Runs on your own VPS with Docker. Your financial data never leaves your server. No SaaS subscriptions. No data selling. Pure ownership.',
    badge: 'Private',
    badgeClass: 'badge-green',
    iconColor: '#10b981',
    iconBg: 'from-success-600/30 to-success-700/10',
    borderHover: 'hover:border-success-500/40',
    icon: `<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
]
</script>

<template>
  <section id="features" class="relative py-20 lg:py-28 overflow-hidden">

    <!-- Background accent -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px]
                  rounded-full bg-primary-700/8 blur-3xl"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="text-center mb-16 js-reveal">
        <div class="section-label mb-4 mx-auto">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Everything you need
        </div>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
          Built for the <span class="text-gradient-static">complete</span> picture
        </h2>
        <p class="text-lg text-muted max-w-2xl mx-auto">
          From email ingestion to AI categorization to beautiful analytics — every piece works together so you never have to think about it.
        </p>
      </div>

      <!-- Feature grid -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        <div
          v-for="(feature, i) in features"
          :key="feature.title"
          :class="[
            'js-reveal card-animated-border p-6 lg:p-7 group',
            `stagger-${i + 1}`,
            feature.borderHover
          ]"
        >
          <!-- Icon -->
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-gradient-to-br border border-white/8', feature.iconBg]">
            <svg class="w-6 h-6" :style="{ color: feature.iconColor }" viewBox="0 0 24 24" fill="none" v-html="feature.icon"></svg>
          </div>

          <!-- Badge + Title -->
          <div class="flex items-center gap-2 mb-2">
            <span :class="['badge', feature.badgeClass]">{{ feature.badge }}</span>
          </div>
          <h3 class="text-lg font-bold text-white mb-2.5 group-hover:text-primary-300 transition-colors duration-200">
            {{ feature.title }}
          </h3>
          <p class="text-sm text-muted leading-relaxed">{{ feature.description }}</p>

          <!-- Arrow on hover -->
          <div class="mt-4 flex items-center gap-1 text-xs font-semibold text-primary-400 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-0 group-hover:translate-x-1">
            Learn more
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
