import { WordPressService } from '~/services/WordPressService'
import { MockWordPressService } from '~/services/MockWordPressService'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // Switch to WordPressService when your WP site is ready
  const useMock = config.public.wpBaseUrl === 'https://your-wordpress-site.com' || !config.public.wpBaseUrl
  const wpService = useMock
    ? new MockWordPressService()
    : new WordPressService(config.public.wpBaseUrl)

  return {
    provide: {
      wp: wpService
    }
  }
})
