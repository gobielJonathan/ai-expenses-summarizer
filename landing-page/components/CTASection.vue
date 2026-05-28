<script setup lang="ts">
const stackItems = [
  { name: 'Vue.js 3', cat: 'Frontend', color: '#42d392' },
  { name: 'Express.js', cat: 'Backend', color: '#68b040' },
  { name: 'Gemini AI', cat: 'AI', color: '#4285f4' },
  { name: 'PostgreSQL', cat: 'Database', color: '#336791' },
  { name: 'n8n', cat: 'Automation', color: '#ea4b71' },
  { name: 'Docker', cat: 'Deploy', color: '#2496ed' },
  { name: 'BullMQ', cat: 'Queue', color: '#e31c5f' },
  { name: 'Prisma', cat: 'ORM', color: '#2d3748' },
]
</script>

<template>
  <section id="get-started" class="relative py-20 lg:py-32 overflow-hidden">

    <!-- Animated gradient background -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute inset-0 bg-gradient-to-b from-bg to-surface"></div>
      <div class="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full
                  bg-primary-600/15 blur-[120px] animate-aurora-1"></div>
      <div class="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full
                  bg-accent-500/12 blur-[100px] animate-aurora-2"></div>
      <div class="absolute inset-0 grid-pattern opacity-20"></div>
    </div>

    <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

      <!-- Section label -->
      <div class="section-label mb-6 mx-auto js-reveal">
        <span class="relative flex h-2 w-2">
          <span class="animate-badge-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-success-500"></span>
        </span>
        Open Source · Self-Hosted · Free Forever
      </div>

      <!-- Headline -->
      <h2 class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-tight mb-6 js-reveal delay-100">
        Take control of<br>
        your <span class="text-gradient">financial future</span>
      </h2>

      <!-- Subtext -->
      <p class="text-xl text-muted max-w-2xl mx-auto mb-10 js-reveal delay-200">
        Deploy WalletAI on your own VPS in minutes. Your data stays on your server. No subscriptions. No privacy trade-offs. Just clarity.
      </p>

      <!-- CTA buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-14 js-reveal delay-300">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-primary text-base px-8 py-4 animate-pulse-glow"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          View on GitHub
        </a>
        <a href="#how-it-works" class="btn-outline text-base px-8 py-4">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Read the Docs
        </a>
      </div>

      <!-- Requirements -->
      <div class="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-14 js-reveal delay-400">
        <div class="glass-light rounded-xl p-4 border border-white/8 text-center">
          <div class="text-2xl font-black text-white mb-1">2</div>
          <div class="text-xs text-muted">vCPU min</div>
        </div>
        <div class="glass-light rounded-xl p-4 border border-white/8 text-center">
          <div class="text-2xl font-black text-white mb-1">4GB</div>
          <div class="text-xs text-muted">RAM min</div>
        </div>
        <div class="glass-light rounded-xl p-4 border border-white/8 text-center">
          <div class="text-2xl font-black text-white mb-1">40GB</div>
          <div class="text-xs text-muted">SSD min</div>
        </div>
      </div>

      <!-- Tech stack pills -->
      <div class="js-reveal delay-500">
        <p class="text-sm text-muted mb-4">Built with</p>
        <div class="flex flex-wrap gap-2 justify-center">
          <div
            v-for="item in stackItems"
            :key="item.name"
            class="flex items-center gap-2 px-3 py-1.5 rounded-full glass-light border border-white/8 text-sm hover:border-white/20 transition-all duration-200 group cursor-default"
          >
            <div class="w-2 h-2 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform duration-200"
              :style="{ background: item.color }"></div>
            <span class="text-muted group-hover:text-white transition-colors duration-200">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
