// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap',
        }
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
