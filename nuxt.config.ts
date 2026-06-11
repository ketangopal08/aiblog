// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      script: [
        {
          innerHTML: `(function(){try{if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark')}}catch(e){}})()`,
        },
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-RM78WJ9DKQ',
          async: true,
        },
        {
          innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-RM78WJ9DKQ');`,
        },
      ],
      meta: [
        { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#0D0D0D', media: '(prefers-color-scheme: dark)' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/icon.png' },
        { rel: 'apple-touch-icon', href: '/icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
        },
        { rel: 'preconnect', href: 'https://neuralbriefly.com' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'NeuralBriefly RSS Feed', href: '/api/rss.xml' },
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
      wpUseMock: process.env.WP_USE_MOCK === 'true',
    },
  },
  routeRules: {
    '/': { isr: 60 },
    '/blog': { isr: 300 },
    '/blog/**': { isr: 300 },
    '/category/**': { isr: 120 },
    '/tag/**': { isr: 120 },
    '/author/**': { isr: 120 },
    '/about': { isr: 3600 },
    '/contact': { isr: 3600 },
    '/advertise': { isr: 3600 },
    '/newsletter': { isr: 60 },
    '/search': { isr: 0 },
  },
  sitemap: {
    sources: ['/api/sitemap-urls'],
  },
})
