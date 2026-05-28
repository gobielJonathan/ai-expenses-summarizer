<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled = ref(false)
const mobileOpen = ref(false)

let lastScroll = 0

const onScroll = () => {
  scrolled.value = window.scrollY > 40
  lastScroll = window.scrollY
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Banks', href: '#banks' },
]
</script>

<template>
  <nav
    :class="[
      'fixed top-0 inset-x-0 z-50 transition-all duration-500',
      scrolled
        ? 'glass border-b border-white/8 shadow-xl shadow-black/30'
        : 'bg-transparent border-b border-transparent'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-18">

        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2.5 group no-underline">
          <div class="relative w-8 h-8 flex-shrink-0">
            <div class="absolute inset-0 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 opacity-80 group-hover:opacity-100 transition-opacity duration-200"></div>
            <div class="absolute inset-0 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-200"></div>
            <svg class="relative w-8 h-8 p-1.5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="text-lg font-bold tracking-tight text-white">
            Wallet<span class="text-gradient-static">AI</span>
          </span>
        </NuxtLink>

        <!-- Desktop Nav -->
        <div class="hidden lg:flex items-center gap-8">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="nav-link"
          >{{ link.label }}</a>
        </div>

        <!-- Desktop CTA -->
        <div class="hidden lg:flex items-center gap-3">
          <NuxtLink to="/privacy-policy" class="nav-link text-sm">Privacy</NuxtLink>
          <a href="#get-started" class="btn-primary text-sm px-5 py-2.5 animate-pulse-glow">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Get Started Free
          </a>
        </div>

        <!-- Mobile hamburger -->
        <button
          class="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg glass-light transition-colors duration-200 hover:bg-white/10"
          @click="mobileOpen = !mobileOpen"
          aria-label="Toggle menu"
        >
          <svg v-if="!mobileOpen" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M3 6h18M3 12h18M3 18h18"/>
          </svg>
          <svg v-else class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="mobileOpen"
        class="lg:hidden glass border-t border-white/8 px-4 py-4"
      >
        <div class="flex flex-col gap-1">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="mobile-menu-item"
            @click="mobileOpen = false"
          >{{ link.label }}</a>
          <a href="/privacy-policy" class="mobile-menu-item text-sm" @click="mobileOpen = false">Privacy Policy</a>
          <a href="/terms-of-service" class="mobile-menu-item text-sm" @click="mobileOpen = false">Terms of Service</a>
          <div class="pt-3 mt-2 border-t border-white/8">
            <a href="#get-started" class="btn-primary w-full justify-center" @click="mobileOpen = false">
              Get Started Free
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>
