<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'

const { $wp } = useNuxtApp()

const allPosts = ref<PostModel[]>([])
const featuredPost = ref<PostModel | null>(null)
const { fetchCategories } = useCategories()

const FEATURED_SLUG = 'claude-constitutional-ai-explained'

try {
  await Promise.all([
    fetchCategories(),
    (async () => { allPosts.value = await $wp.getPosts(1, 20) as PostModel[] })(),
    (async () => { featuredPost.value = await $wp.getPostBySlug(FEATURED_SLUG) as PostModel | null })(),
  ])
} catch {
  // API unavailable — gracefully degrade
}

if (!featuredPost.value) featuredPost.value = allPosts.value[0] ?? null

const remainingPosts = computed(() =>
  allPosts.value.filter(p => p.slug !== FEATURED_SLUG)
)

const stackedPosts  = computed(() => remainingPosts.value.slice(0, 2))
const trendingPosts = computed(() => allPosts.value.slice(0, 8))

const homeSeo = {
  title: 'NeuralBriefly – AI News & Analysis',
  description: 'Latest articles on GPT, Gemini, Claude and the AI world.',
  ogType: 'website' as const,
}

function postImg(post: PostModel, w = 800, h = 500) {
  return post.featuredImage || `https://picsum.photos/seed/${post.id}/${w}/${h}`
}
</script>

<template>
  <div class="bg-white dark:bg-[#0D0D0D]">
    <SeoHead :seo="homeSeo" />

    <!-- ══════════════════════════════════════════════
         HERO GRID
    ══════════════════════════════════════════════ -->
    <section>
      <div class="max-w-[1238px] mx-auto px-5 lg:px-0">
        <div class="flex flex-col lg:flex-row lg:gap-[20px]">

          <!-- ── LEFT: main content ── -->
          <div class="flex-1 min-w-0">

            <!--
              Top grid
              Mobile  : hero full-width 240px, then stacked 2-up row 160px
              Desktop : hero 58% + stacked column 42%, shared clamp height
            -->
            <div class="flex flex-col sm:flex-row gap-[6px] sm:gap-[20px] sm:h-[clamp(380px,52vw,560px)]">

              <!-- Large hero -->
              <NuxtLink
                v-if="featuredPost"
                :to="`/blog/${featuredPost.slug}`"
                class="relative img-card group block flex-shrink-0
                       h-[240px] sm:h-full w-full sm:w-[58%]"
              >
                <img
                  :src="postImg(featuredPost, 900, 560)"
                  :alt="featuredPost.title"
                  class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div class="absolute inset-0 pointer-events-none" style="background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.55) 25%, rgba(0,0,0,0.15) 50%, transparent 70%)" />
                <!-- Category -->
                <div class="absolute top-4 left-4 z-10">
                  <span class="cat-label text-[9px] font-black uppercase tracking-[2.5px] text-white bg-black/30 backdrop-blur-md px-2 py-1 rounded-sm" style="font-weight: 300">
                    {{ featuredPost.categories[0]?.name ?? 'AI' }}
                  </span>
                </div>
                <!-- Title + meta -->
                <div class="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <p class="hero-title text-white line-clamp-3"
                     v-html="featuredPost.title" />
                  <span class="text-[11px] text-white/55 mt-2 block">{{ featuredPost.formattedDate }}</span>
                </div>
              </NuxtLink>
              <div v-else class="flex-shrink-0 animate-pulse bg-[#1a1a1a]
                                  h-[240px] sm:h-full w-full sm:w-[58%]" />

              <!-- 2 stacked cards — row on mobile, column on desktop -->
              <div class="flex sm:flex-col gap-[6px] sm:gap-[20px] flex-none sm:flex-1 h-[160px] sm:h-full">
                <template v-if="stackedPosts.length">
                  <NuxtLink
                    v-for="post in stackedPosts"
                    :key="post.id"
                    :to="`/blog/${post.slug}`"
                    class="relative flex-1 img-card group block min-h-0 min-w-0"
                  >
                    <img
                      :src="postImg(post, 480, 280)"
                      :alt="post.title"
                      class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    <div class="absolute inset-0 pointer-events-none" style="background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.50) 30%, rgba(0,0,0,0.12) 55%, transparent 75%)" />
                    <div class="absolute top-3 left-3 z-10">
                      <span class="cat-label text-[8px] font-black uppercase tracking-[2px] text-white bg-black/30 backdrop-blur-md px-2 py-1 rounded-sm" style="font-weight: 300">
                        {{ post.categories[0]?.name ?? 'AI' }}
                      </span>
                    </div>
                    <div class="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10">
                      <p class="hero-title text-white line-clamp-2 sm:line-clamp-3"
                         v-html="post.title" />
                      <span class="text-[10px] text-white/55 mt-1 block">{{ post.formattedDate }}</span>
                    </div>
                  </NuxtLink>
                </template>
                <template v-else>
                  <div v-for="n in 2" :key="n" class="flex-1 animate-pulse bg-[#1a1a1a] min-h-0 min-w-0" />
                </template>
              </div>
            </div>

            <!-- Horizontal card -->
            <!-- <NuxtLink
              v-if="horizontalPost"
              :to="`/blog/${horizontalPost.slug}`"
              class="flex items-stretch border-t border-gray-200 dark:border-white/[0.08] group
                     hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
            >
              <div class="w-[100px] sm:w-[200px] lg:w-[280px] flex-shrink-0 overflow-hidden" style="height: 110px">
                <img
                  :src="postImg(horizontalPost, 280, 130)"
                  :alt="horizontalPost.title"
                  class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              <div class="flex-1 px-4 sm:px-5 flex flex-col justify-center gap-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-[9px] font-black uppercase tracking-[2px] text-gray-500 dark:text-gray-400">
                    {{ horizontalPost.categories[0]?.name ?? 'AI' }}
                  </span>
                  <span class="hidden sm:block text-[11px] text-gray-400 dark:text-gray-500">{{ horizontalPost.formattedDate }}</span>
                </div>
                <h3 class="text-[13px] sm:text-[15px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2
                           group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                  {{ horizontalPost.title }}
                </h3>
                <span class="sm:hidden text-[10px] text-gray-400 dark:text-gray-500">{{ horizontalPost.formattedDate }}</span>
              </div>
            </NuxtLink>
            <div
              v-else
              class="border-t border-gray-200 dark:border-white/[0.08] animate-pulse bg-gray-100 dark:bg-[#1a1a1a]"
              style="height: 110px"
            /> -->
          </div>

          <!-- ── RIGHT: trending stories sidebar ── -->
          <div class="w-full lg:w-[300px] xl:w-[330px] flex-shrink-0
                      border-t border-gray-200 dark:border-white/[0.08] lg:border-t-0
                      pt-4 lg:pt-0 pb-5">
            <h3 class="text-gray-900 dark:text-white pb-3 mb-1 border-b-2 border-primary inline-block"
                style="text-transform: capitalize; font-family: Inter, sans-serif !important; font-size: 14px !important; letter-spacing: 1px; padding-bottom: 6px">
              Trending Stories
            </h3>

            <!-- Skeleton -->
            <template v-if="!trendingPosts.length">
              <div v-for="n in 6" :key="n" class="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-white/[0.06] animate-pulse">
                <div class="flex-1 space-y-2">
                  <div class="h-3 bg-gray-200 dark:bg-[#222] rounded w-full" />
                  <div class="h-3 bg-gray-200 dark:bg-[#222] rounded w-4/5" />
                  <div class="h-2 bg-gray-200 dark:bg-[#222] rounded w-1/3 mt-1" />
                </div>
                <div class="w-[68px] h-[54px] bg-gray-200 dark:bg-[#222] flex-shrink-0" />
              </div>
            </template>

            <NuxtLink
              v-for="post in trendingPosts"
              :key="post.id"
              :to="`/blog/${post.slug}`"
              class="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-white/[0.06]
                     group hover:bg-gray-50 dark:hover:bg-white/[0.02] -mx-2 px-2 transition-colors"
            >
              <div class="flex-1 min-w-0">
                <p class="text-[15px] font-medium text-gray-900 dark:text-white leading-snug line-clamp-2
                          group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                   v-html="post.title" />
                <span class="text-[11px] text-gray-400 dark:text-gray-500 mt-1 block">{{ post.formattedDate }}</span>
              </div>
              <div class="w-[68px] h-[54px] flex-shrink-0 img-card bg-gray-100 dark:bg-[#1f1f1f]">
                <img
                  :src="postImg(post, 136, 108)"
                  :alt="post.title"
                  loading="lazy"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </NuxtLink>
          </div>

        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════
         MORE STORIES
    ══════════════════════════════════ -->
    <MoreStories />

    <!-- ══════════════════════════════════
         NEWSLETTER SLIDER
    ══════════════════════════════════ -->
    <NewsletterSlider />

  </div>
</template>

<style scoped>
.hero-title {
  font-size: 1.4rem !important;
  font-weight: 100 !important;
  line-height: 1.2 !important;
  tracking: -0.01em;
}
@media (min-width: 1024px) {
  .hero-title { font-size: 1.625rem !important; }
}
</style>
