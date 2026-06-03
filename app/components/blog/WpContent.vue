<script setup lang="ts">
import DOMPurify from 'dompurify'

const props = defineProps<{ content: string }>()

// Convert naked Twitter/X URL anchor tags into blockquote embeds so the widget can pick them up
function embedTweetLinks(html: string): string {
  return html.replace(
    /<a\s[^>]*href="(https?:\/\/(?:twitter\.com|x\.com)\/[^/]+\/status\/[^"]+)"[^>]*>\s*https?:\/\/(?:twitter\.com|x\.com)\/[^\s<]+\s*<\/a>/gi,
    (_, url) => `<blockquote class="twitter-tweet"><a href="${url}"></a></blockquote>`
  )
}

const cleanHtml = computed(() => {
  if (!import.meta.client) return props.content
  return DOMPurify.sanitize(embedTweetLinks(props.content))
})

const articleRef = ref<HTMLElement | null>(null)

function loadTwitterWidgets() {
  if (!import.meta.client) return
  const el = articleRef.value
  if (!el || !el.querySelector('.twitter-tweet')) return

  const w = window as any
  if (w.twttr?.widgets) {
    w.twttr.widgets.load(el)
    return
  }
  if (document.querySelector('script[src*="platform.twitter.com/widgets.js"]')) return

  const script = document.createElement('script')
  script.src = 'https://platform.twitter.com/widgets.js'
  script.async = true
  script.onload = () => w.twttr?.widgets?.load(el)
  document.head.appendChild(script)
}

onMounted(loadTwitterWidgets)
watch(() => props.content, () => nextTick(loadTwitterWidgets))
</script>

<template>
  <article ref="articleRef" class="wp-article prose dark:prose-invert max-w-none" v-html="cleanHtml" />
</template>

<style scoped>
.wp-article { font-size: 1.1rem; }
@media (min-width: 1024px) {
  .wp-article { font-size: 1.125rem; }
}
</style>
