// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap',
        },
      ]
    }
  },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  // Allow <AppHeader> instead of <UiAppHeader> for subdirectory components
  components: [
    { path: '~/components', pathPrefix: false }
  ],
  runtimeConfig: {
    public: {
      wpBaseUrl: process.env.WP_BASE_URL ?? 'https://your-wordpress-site.com'
    }
  }
})
