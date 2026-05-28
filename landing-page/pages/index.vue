<script setup lang="ts">
import { onMounted } from 'vue'

const { initReveal } = useScrollReveal()
const { initCounters } = useCounter()

useHead({
  title: 'WalletAI — AI-Powered Personal Finance Automation',
})

onMounted(() => {
  initReveal()
  initCounters()
})
</script>

<template>
  <div class="min-h-screen bg-bg text-text">
    <AppNav />
    <main>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorks />
      <DashboardPreview />
      <AISection />
      <BanksSection />
      <CTASection />
    </main>
    <AppFooter />
  </div>
</template>
