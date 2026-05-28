<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'
const { isDark } = useTheme()

const { $wp } = useNuxtApp()
const { data: posts } = await useAsyncData('newsletter-slider', () => $wp.getPosts(1, 10))

const GAP = 20
const currentIndex = ref(0)
const wrapperRef = ref<HTMLElement | null>(null)
const containerWidth = ref(0)

onMounted(() => {
  const update = () => {
    if (wrapperRef.value) containerWidth.value = wrapperRef.value.offsetWidth
  }
  update()
  const ro = new ResizeObserver(update)
  if (wrapperRef.value) ro.observe(wrapperRef.value)
  onUnmounted(() => ro.disconnect())
})

const isMobile = computed(() => containerWidth.value > 0 && containerWidth.value < 640)

const visible = computed(() => {
  if (containerWidth.value < 640) return 2
  if (containerWidth.value < 1024) return 3
  return 4
})

const total = computed(() => posts.value?.length ?? 0)
const maxIndex = computed(() => Math.max(0, total.value - visible.value))

const cardWidth = computed(() =>
  containerWidth.value > 0
    ? (containerWidth.value - (visible.value - 1) * GAP) / visible.value
    : null
)

const cardStyle = computed(() => {
  const w = cardWidth.value
  const h = isMobile.value && w ? w : 300
  return {
    width: w != null ? `${w}px` : `calc((100% - ${(visible.value - 1) * GAP}px) / ${visible.value})`,
    height: `${h}px`,
  }
})

const trackStyle = computed(() => {
  if (!cardWidth.value) return {}
  return {
    transform: `translateX(-${(cardWidth.value + GAP) * currentIndex.value}px)`,
    transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  }
})

function prev() { currentIndex.value = Math.max(0, currentIndex.value - 1) }
function next() { currentIndex.value = Math.min(maxIndex.value, currentIndex.value + 1) }

// Touch swipe for mobile
let touchStartX = 0
function onTouchStart(e: TouchEvent) { touchStartX = e.touches[0].clientX }
function onTouchEnd(e: TouchEvent) {
  const diff = touchStartX - e.changedTouches[0].clientX
  if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
}

function postImg(post: PostModel, w = 600, h = 400) {
  return post.featuredImage || `https://picsum.photos/seed/${post.id}/${w}/${h}`
}
</script>

<template>
  <section
    class="w-full py-16 border-t transition-colors duration-300"
    :style="{
      backgroundColor: isDark ? '#000' : '#fcfcfd',
      borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'
    }"
  >
    <div class="max-w-[1238px] mx-auto px-5">

      <!-- Header row -->
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <h2 class="font-black leading-none tracking-tight"
              :class="isDark ? 'text-white' : 'text-gray-900'"
              style="font-size: clamp(24px, 3vw, 36px); font-family: 'Inter', sans-serif !important">
            NEWSLETTERS
          </h2>
          <p class="text-[11px] uppercase tracking-[3px] text-gray-500 mt-3 font-display">
            Catch up on top stories
          </p>
        </div>
        <NuxtLink
          to="/newsletter"
          class="flex-shrink-0 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[1.5px] px-6 py-3 font-display transition-colors duration-200 border"
          :class="isDark
            ? 'border-white/60 text-white hover:bg-white hover:text-black'
            : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'"
        >
          See More Newsletters
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10"/>
          </svg>
        </NuxtLink>
      </div>

      <!-- Coming Soon -->
      <div class="flex flex-col items-center justify-center text-center py-16 border"
           :class="isDark ? 'border-white/[0.06]' : 'border-gray-200'">
        <span class="inline-flex items-center gap-2 border border-primary/40 text-primary text-[10px] font-black uppercase tracking-[3px] px-4 py-2 mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Coming Soon
        </span>
        <p class="text-[13px] max-w-xs leading-relaxed" :class="isDark ? 'text-white/50' : 'text-gray-500'">
          Our newsletter is on its way — curated AI news delivered straight to your inbox.
        </p>
      </div>

    </div>
  </section>
</template>
