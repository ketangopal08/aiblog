import { WordPressService } from '~/services/WordPressService'
import { MockWordPressService } from '~/services/MockWordPressService'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const wpService = config.public.wpUseMock
    ? new MockWordPressService()
    : new WordPressService(config.public.wpBaseUrl, config.public.siteUrl)

  return {
    provide: {
      wp: wpService,
    },
  }
})
