<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'

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
  <section class="bg-black w-full py-16">
    <div class="max-w-[1158px] mx-auto px-5">

      <!-- Header row -->
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <h2 class="font-black text-white leading-none tracking-tight"
              style="font-size: clamp(24px, 3vw, 36px); font-family: 'Inter', sans-serif !important">
            NEWSLETTERS
          </h2>
          <p class="text-[11px] uppercase tracking-[3px] text-gray-500 mt-3 font-display">
            Catch up on top stories
          </p>
        </div>
        <NuxtLink
          to="/newsletter"
          class="flex-shrink-0 flex items-center gap-2 border border-white/60 text-white
                 text-[12px] font-bold uppercase tracking-[1.5px] px-6 py-3 font-display
                 hover:bg-white hover:text-black transition-colors duration-200"
        >
          See More Newsletters
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10"/>
          </svg>
        </NuxtLink>
      </div>

      <!-- Slider -->
      <div class="relative">
        <div
          ref="wrapperRef"
          class="overflow-hidden"
          @touchstart.passive="onTouchStart"
          @touchend.passive="onTouchEnd"
        >
          <div class="flex" :style="[trackStyle, { gap: GAP + 'px' }]">

            <!-- Skeleton -->
            <template v-if="!posts?.length">
              <div
                v-for="n in visible" :key="n"
                class="flex-shrink-0 animate-pulse bg-[#1a1a1a]"
                :style="cardStyle"
              />
            </template>

            <!-- Cards -->
            <NuxtLink
              v-for="post in posts"
              :key="post.id"
              :to="`/blog/${post.slug}`"
              class="flex-shrink-0 relative overflow-hidden group"
              :style="cardStyle"
            >
              <img
                :src="postImg(post)"
                :alt="post.title"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 pointer-events-none" />
              <div class="absolute inset-0 p-5 flex flex-col justify-between z-10">
                <span class="text-[9px] font-black uppercase tracking-[2.5px] text-white/70 font-display">
                  Newsletter
                </span>
                <div>
                  <h3 class="text-[16px] font-black text-white leading-snug line-clamp-3 font-display mb-2">
                    {{ post.title }}
                  </h3>
                  <span class="text-[11px] text-white/50">{{ post.formattedDate }}</span>
                </div>
              </div>
            </NuxtLink>

          </div>
        </div>

        <!-- Prev / Next — desktop only -->
        <button
          v-if="!isMobile && currentIndex > 0"
          @click="prev"
          class="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-black
                 flex items-center justify-center hover:bg-gray-200 transition-colors z-10 shadow-lg"
          aria-label="Previous"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <button
          v-if="!isMobile && currentIndex < maxIndex"
          @click="next"
          class="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-black
                 flex items-center justify-center hover:bg-gray-200 transition-colors z-10 shadow-lg"
          aria-label="Next"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <!-- Dot indicators — desktop only -->
      <div v-if="!isMobile && total > visible" class="flex items-center justify-center gap-2 mt-6">
        <button
          v-for="i in maxIndex + 1" :key="i"
          @click="currentIndex = i - 1"
          class="transition-all duration-200"
          :class="currentIndex === i - 1
            ? 'w-6 h-1.5 bg-white'
            : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'"
          :aria-label="`Go to slide ${i}`"
        />
      </div>

    </div>
  </section>
</template>
