import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  devtools: { enabled: false },

  vite: {
    plugins: [tailwindcss()]
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'WalletAI — AI-Powered Personal Finance Automation',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Automate your personal finances with AI. Connect Gmail, parse bank statements from BCA, Jenius, UOB & BRI, and categorize every transaction automatically. Self-hosted & 100% private.'
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'WalletAI — AI-Powered Personal Finance Automation' },
        {
          property: 'og:description',
          content:
            'Automate your personal finances with AI. Connect Gmail, parse bank statements, categorize transactions automatically.'
        },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'theme-color', content: '#050512' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
        }
      ]
    }
  },

  modules: ['@vueuse/nuxt'],

  compatibilityDate: '2025-05-28'
})
