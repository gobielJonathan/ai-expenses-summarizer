<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const stage = ref<'idle' | 'processing' | 'done'>('idle')
const sectionRef = ref<HTMLElement | null>(null)
let triggered = false

const runDemo = () => {
  stage.value = 'processing'
  setTimeout(() => {
    stage.value = 'done'
    setTimeout(() => {
      stage.value = 'idle'
      triggered = false
    }, 4000)
  }, 2200)
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !triggered) {
          triggered = true
          setTimeout(runDemo, 600)
        }
      })
    },
    { threshold: 0.4 }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
  return () => observer.disconnect()
})

const categories = [
  { name: 'Food & Beverage', sub: 'Coffee Shops', color: '#f59e0b', icon: '☕' },
  { name: 'Transportation', sub: 'Ride-hailing', color: '#22d3ee', icon: '🚗' },
  { name: 'Entertainment', sub: 'Streaming', color: '#a78bfa', icon: '🎬' },
  { name: 'Groceries', sub: 'Supermarket', color: '#10b981', icon: '🛒' },
  { name: 'Healthcare', sub: 'Pharmacy', color: '#fb7185', icon: '💊' },
]
</script>

<template>
  <section ref="sectionRef" class="relative py-20 lg:py-28 overflow-hidden">

    <!-- Background -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute inset-0 bg-surface/40"></div>
      <div class="absolute top-0 inset-x-0 h-px divider-gradient"></div>
      <div class="absolute bottom-0 inset-x-0 h-px divider-gradient"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px]
                  rounded-full bg-accent-500/6 blur-3xl"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        <!-- Left: AI demo card -->
        <div class="js-reveal-left order-2 lg:order-1">
          <!-- Demo card -->
          <div class="max-w-md mx-auto lg:mx-0">
            <div class="card border border-accent-500/20 overflow-hidden">
              <!-- Header -->
              <div class="flex items-center justify-between mb-5">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-primary-600 flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-white">AI Categorization</div>
                    <div class="text-xs text-muted">Gemini 1.5 Flash</div>
                  </div>
                </div>
                <span class="badge badge-cyan">Live</span>
              </div>

              <!-- Input -->
              <div class="mb-4">
                <div class="text-xs text-muted mb-2 uppercase tracking-wide font-semibold">Transaction Input</div>
                <div class="glass-light rounded-xl p-3.5 border border-white/8">
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span class="text-subtle">Merchant</span>
                      <p class="text-white font-mono mt-0.5">STARBUCKS THAMRIN</p>
                    </div>
                    <div>
                      <span class="text-subtle">Amount</span>
                      <p class="text-white font-mono mt-0.5">Rp 45.000</p>
                    </div>
                    <div>
                      <span class="text-subtle">Bank</span>
                      <p class="text-white font-mono mt-0.5">BCA DEBIT</p>
                    </div>
                    <div>
                      <span class="text-subtle">Date</span>
                      <p class="text-white font-mono mt-0.5">2026-05-28</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Processing animation -->
              <div class="mb-4">
                <div class="flex items-center justify-between mb-2">
                  <div class="text-xs text-muted uppercase tracking-wide font-semibold">AI Processing</div>
                  <div
                    v-if="stage === 'processing'"
                    class="flex items-end gap-0.5 h-4"
                  >
                    <div class="w-1 rounded-full bg-accent-400 animate-wave-1" style="height:60%"></div>
                    <div class="w-1 rounded-full bg-accent-400 animate-wave-2" style="height:100%"></div>
                    <div class="w-1 rounded-full bg-accent-400 animate-wave-3" style="height:40%"></div>
                    <div class="w-1 rounded-full bg-accent-400 animate-wave-4" style="height:80%"></div>
                    <div class="w-1 rounded-full bg-accent-400 animate-wave-5" style="height:60%"></div>
                  </div>
                  <div v-else-if="stage === 'done'" class="text-success-400 text-xs font-semibold">✓ Done</div>
                </div>
                <div class="relative h-2 rounded-full bg-white/6 overflow-hidden">
                  <div
                    :class="[
                      'h-full rounded-full transition-all duration-[2200ms] ease-out',
                      stage === 'idle' ? 'w-0 bg-accent-500' :
                      stage === 'processing' ? 'w-3/4 bg-gradient-to-r from-accent-500 to-primary-500' :
                      'w-full bg-success-500'
                    ]"
                  ></div>
                </div>
              </div>

              <!-- Output -->
              <div>
                <div class="text-xs text-muted mb-2 uppercase tracking-wide font-semibold">AI Output</div>
                <Transition
                  enter-active-class="transition-all duration-500 ease-out"
                  enter-from-class="opacity-0 translate-y-4"
                  enter-to-class="opacity-1 translate-y-0"
                >
                  <div v-if="stage === 'done'" class="glass-light rounded-xl p-3.5 border border-success-500/20">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-2xl">☕</span>
                      <div>
                        <p class="text-sm font-bold text-white">Food & Beverage</p>
                        <p class="text-xs text-muted">Coffee Shops · High confidence</p>
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <span class="badge badge-green">✓ Categorized</span>
                      <span class="badge badge-cyan">Subcategory set</span>
                    </div>
                  </div>
                  <div v-else class="glass-light rounded-xl p-3.5 border border-white/8 opacity-40">
                    <div class="flex gap-2">
                      <div class="h-4 w-24 rounded bg-white/10 animate-shimmer bg-gradient-to-r from-white/5 via-white/15 to-white/5 bg-[length:200%_auto]"></div>
                      <div class="h-4 w-16 rounded bg-white/10"></div>
                    </div>
                    <div class="h-3 w-32 rounded bg-white/8 mt-2"></div>
                  </div>
                </Transition>
              </div>

              <!-- Replay button -->
              <button
                class="mt-4 w-full text-xs text-muted hover:text-accent-400 transition-colors duration-200 flex items-center justify-center gap-1.5"
                @click="stage = 'idle'; triggered = false; setTimeout(() => { triggered = true; runDemo() }, 100)"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                  <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M1 4v6h6M23 20v-6h-6"/>
                  <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                </svg>
                Replay demo
              </button>
            </div>
          </div>
        </div>

        <!-- Right: Copy -->
        <div class="js-reveal-right order-1 lg:order-2">
          <div class="section-label mb-5">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Powered by Gemini AI
          </div>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-5">
            AI that actually <span class="text-gradient-static">understands</span> your money
          </h2>
          <p class="text-lg text-muted leading-relaxed mb-6">
            No hardcoded rules. No manual category mapping. Gemini 1.5 Flash reads every merchant name and assigns the right category with full context — dynamically.
          </p>

          <!-- Category examples -->
          <div class="grid grid-cols-1 gap-2 mb-6">
            <div
              v-for="cat in categories"
              :key="cat.name"
              class="flex items-center gap-3 glass-light rounded-xl px-4 py-3 border border-white/6 group hover:border-white/15 transition-colors duration-200"
            >
              <span class="text-xl flex-shrink-0">{{ cat.icon }}</span>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-white">{{ cat.name }}</p>
                <p class="text-xs text-muted">{{ cat.sub }}</p>
              </div>
              <div class="w-2 h-2 rounded-full flex-shrink-0" :style="{ background: cat.color }"></div>
            </div>
          </div>

          <p class="text-sm text-muted">
            + custom categories · subcategories · merchant intelligence · spending context
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
