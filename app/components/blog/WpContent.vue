<script setup lang="ts">
import DOMPurify from 'dompurify'

const props = defineProps<{ content: string }>()

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
  if (w.twttr?.widgets) { w.twttr.widgets.load(el); return }
  if (document.querySelector('script[src*="platform.twitter.com/widgets.js"]')) return
  const script = document.createElement('script')
  script.src = 'https://platform.twitter.com/widgets.js'
  script.async = true
  script.onload = () => w.twttr?.widgets?.load(el)
  document.head.appendChild(script)
}

function initGalleryCarousels() {
  if (!import.meta.client || !articleRef.value) return
  const galleries = articleRef.value.querySelectorAll('.gallery:not([data-carousel])') as NodeListOf<HTMLElement>
  galleries.forEach((gallery) => {
    const items = Array.from(gallery.querySelectorAll('.gallery-item')) as HTMLElement[]
    if (!items.length) return
    gallery.setAttribute('data-carousel', 'true')

    const track = document.createElement('div')
    track.style.cssText = 'display:flex;transition:transform 0.35s ease;'
    items.forEach((item) => {
      item.style.flex = '0 0 100%'
      item.style.minWidth = '100%'
      track.appendChild(item)
    })
    gallery.appendChild(track)

    let current = 0
    const total = items.length
    const dotsWrap = document.createElement('div')
    dotsWrap.style.cssText = 'position:absolute;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:10;'
    const dots = items.map((_, i) => {
      const d = document.createElement('span')
      d.style.cssText = `width:8px;height:8px;border-radius:50%;cursor:pointer;transition:background 0.2s;background:${i === 0 ? 'var(--accent)' : 'rgba(255,255,255,0.65)'};`
      d.addEventListener('click', () => goTo(i))
      dotsWrap.appendChild(d)
      return d
    })

    function goTo(idx: number) {
      current = (idx + total) % total
      track.style.transform = `translateX(-${current * 100}%)`
      dots.forEach((d, i) => { d.style.background = i === current ? 'var(--accent)' : 'rgba(255,255,255,0.65)' })
    }

    if (total > 1) {
      const btnBase = 'position:absolute;top:50%;transform:translateY(-50%);z-index:10;background:rgba(0,0,0,0.45);color:#fff;border:none;border-radius:50%;width:36px;height:36px;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;'
      const prev = document.createElement('button')
      prev.innerHTML = '←'
      prev.setAttribute('aria-label', 'Previous image')
      prev.style.cssText = btnBase + 'left:12px;'
      prev.addEventListener('click', () => goTo(current - 1))
      const next = document.createElement('button')
      next.innerHTML = '→'
      next.setAttribute('aria-label', 'Next image')
      next.style.cssText = btnBase + 'right:12px;'
      next.addEventListener('click', () => goTo(current + 1))
      gallery.append(prev, next, dotsWrap)
    }
  })
}

function init() {
  nextTick(() => { loadTwitterWidgets(); initGalleryCarousels() })
}

onMounted(init)
watch(() => props.content, init)
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
