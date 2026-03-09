// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
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
