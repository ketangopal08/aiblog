// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo-green-transparent.png' },
        { rel: 'apple-touch-icon', href: '/logo-green-transparent.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Charis+SIL:ital,wght@0,400;0,700;1,400;1,700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
        },
        { rel: 'preconnect', href: 'https://neuralbriefly.com' },
      ],
    },
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/sitemap'],
  css: ['~/assets/css/main.css'],
  components: [
    { path: '~/components', pathPrefix: false },
  ],
  runtimeConfig: {
    public: {
      wpBaseUrl: process.env.WP_BASE_URL ?? 'https://lime-hamster-756747.hostingersite.com',
      wpUseMock: process.env.WP_USE_MOCK !== 'false',
    },
  },
  routeRules: {
    '/': { isr: 60 },
    '/blog/**': { isr: 300 },
    '/category/**': { isr: 120 },
  },
  sitemap: {
    sources: ['/api/sitemap-urls'],
  },
})
