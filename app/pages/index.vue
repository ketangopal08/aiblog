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

// Right sidebar latest feed
const feedPosts = computed(() => remainingPosts.value.slice(0, 7))

// Below-fold grid
const gridPosts = computed(() => remainingPosts.value.slice(7, 13))

const homeSeo = {
  title: 'NeuralBriefly – AI News & Analysis',
  description: 'Latest articles on GPT, Gemini, Claude and the AI world.',
  ogType: 'website' as const,
}

function postImg(post: PostModel, w = 800, h = 500) {
  return post.featuredImage || `https://picsum.photos/seed/${post.id}/${w}/${h}`
}

function authorInitial(name: string) {
  return name.charAt(0).toUpperCase()
}
</script>

<template>
  <div class="bg-white dark:bg-[#0D0D0D]">
    <SeoHead :seo="homeSeo" />

    <!-- ══════════════════════════════════════════════
         HERO — split: image+watermark left / feed right
    ══════════════════════════════════════════════ -->
    <section class="border-b border-gray-200 dark:border-white/[0.08]">
      <div class="flex flex-col lg:flex-row" style="min-height: clamp(520px, 82vh, 960px)">

        <!-- ── LEFT: featured post with giant brand watermark ── -->
        <div class="relative overflow-hidden flex-1 bg-[#111] min-h-[56vw] lg:min-h-0">

          <!-- Skeleton -->
          <div v-if="!featuredPost" class="absolute inset-0 animate-pulse bg-[#1a1a1a]" />

          <template v-else>
            <!-- Hero image -->
            <img
              :src="postImg(featuredPost, 1600, 1000)"
              :alt="featuredPost.title"
              class="absolute inset-0 w-full h-full object-cover"
            />

            <!-- Gradient layers for text legibility -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/92 via-black/40 to-black/15 pointer-events-none" />
            <div class="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent pointer-events-none" />

            <!-- ── Giant "Neural / Briefly" watermark ── -->
            <div
              aria-hidden="true"
              class="absolute top-[6%] left-0 z-10 pointer-events-none select-none pl-5 sm:pl-7 lg:pl-9"
            >
              <span
                class="block font-black text-white leading-[0.82] tracking-tighter"
                style="font-size: clamp(52px, 12.5vw, 195px)"
              >Neural</span>
              <span
                class="block font-black text-white leading-[0.82] tracking-tighter"
                style="font-size: clamp(52px, 12.5vw, 195px)"
              >Briefly</span>
            </div>

            <!-- ── Bottom headline ── -->
            <div class="absolute bottom-0 left-0 right-0 z-20 p-6 sm:p-8 lg:p-10">
              <!-- Category pill -->
              <span class="inline-block text-[9px] font-black uppercase tracking-[3px] text-white/60 border border-white/20 px-2.5 py-1 rounded-full mb-4">
                {{ featuredPost.categories[0]?.name ?? 'AI' }}
              </span>

              <!-- Title -->
              <NuxtLink :to="`/blog/${featuredPost.slug}`" class="block group">
                <h1
                  class="text-[22px] sm:text-3xl lg:text-4xl xl:text-[2.6rem] font-black text-white leading-[1.1]
                         tracking-tight max-w-2xl group-hover:opacity-80 transition-opacity duration-200"
                >
                  {{ featuredPost.title }}
                </h1>
              </NuxtLink>

              <!-- Meta -->
              <div class="flex items-center gap-2.5 mt-4 text-[11px] text-white/50 font-medium">
                <span class="text-white/80">{{ featuredPost.author.name }}</span>
                <span class="text-white/25">·</span>
                <span>{{ featuredPost.formattedDate }}</span>
                <span class="text-white/25">·</span>
                <span>{{ featuredPost.readingTime }} min read</span>
              </div>
            </div>
          </template>
        </div>

        <!-- ── RIGHT: Latest feed ── -->
        <div
          class="w-full lg:w-[355px] xl:w-[390px] 2xl:w-[420px] flex-shrink-0 flex flex-col
                 bg-white dark:bg-[#0D0D0D]
                 border-t border-gray-200 dark:border-white/[0.08]
                 lg:border-t-0 lg:border-l lg:border-gray-200 lg:dark:border-white/[0.08]"
        >
          <!-- Tab bar -->
          <div class="flex items-center gap-2 px-5 py-4 border-b border-gray-200 dark:border-white/[0.08] flex-shrink-0">
            <button
              type="button"
              class="px-5 py-[7px] rounded-full bg-gray-900 dark:bg-white
                     text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-[1.5px]"
            >
              Latest
            </button>
            <button
              type="button"
              class="px-5 py-[7px] rounded-full text-gray-400 dark:text-white/35
                     text-[10px] font-black uppercase tracking-[1.5px]
                     hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Following
            </button>
          </div>

          <!-- Feed list -->
          <div class="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-white/[0.06]">

            <!-- Skeleton -->
            <template v-if="!feedPosts.length">
              <div v-for="n in 6" :key="n" class="flex items-start gap-3 px-5 py-4 animate-pulse">
                <div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-[#222] flex-shrink-0 mt-0.5" />
                <div class="flex-1 space-y-2">
                  <div class="h-2 bg-gray-200 dark:bg-[#222] rounded w-1/3" />
                  <div class="h-3 bg-gray-200 dark:bg-[#222] rounded w-full" />
                  <div class="h-3 bg-gray-200 dark:bg-[#222] rounded w-4/5" />
                  <div class="h-2 bg-gray-200 dark:bg-[#222] rounded w-2/5 mt-1" />
                </div>
              </div>
            </template>

            <NuxtLink
              v-for="post in feedPosts"
              :key="post.id"
              :to="`/blog/${post.slug}`"
              class="flex items-start gap-3 px-5 py-4 group hover:bg-gray-50 dark:hover:bg-white/[0.025] transition-colors"
            >
              <!-- Author initial avatar -->
              <div
                class="w-[26px] h-[26px] rounded-full bg-gray-200 dark:bg-[#2a2a2a] flex items-center justify-center
                       flex-shrink-0 mt-0.5"
              >
                <span class="text-[10px] font-black text-gray-600 dark:text-gray-300 leading-none">
                  {{ authorInitial(post.author.name) }}
                </span>
              </div>

              <div class="flex-1 min-w-0">
                <!-- Author + date -->
                <div class="flex items-center gap-1.5 mb-1.5">
                  <span class="text-[10px] font-bold text-gray-700 dark:text-gray-300 truncate">
                    {{ post.author.name }}
                  </span>
                  <span class="text-gray-300 dark:text-white/15 text-[10px] flex-shrink-0">·</span>
                  <span class="text-[10px] text-gray-400 dark:text-gray-500 flex-shrink-0">
                    {{ post.formattedDate }}
                  </span>
                </div>

                <!-- Title -->
                <p
                  class="text-[13px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2
                         group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                >
                  {{ post.title }}
                </p>

                <!-- Excerpt -->
                <div
                  class="text-[11px] text-gray-500 dark:text-gray-500 leading-relaxed line-clamp-2 mt-1"
                  v-html="post.excerpt"
                />
              </div>

              <!-- Thumbnail -->
              <div class="w-[60px] h-[60px] rounded-sm overflow-hidden bg-gray-100 dark:bg-[#1f1f1f] flex-shrink-0 self-center">
                <img
                  :src="postImg(post, 120, 120)"
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
         MORE STORIES — below-fold grid
    ══════════════════════════════════ -->
    <section v-if="gridPosts.length" class="max-w-[1400px] mx-auto px-6 sm:px-8 pt-12 pb-4">
      <div class="flex items-center gap-4 mb-8">
        <h2 class="text-[10px] font-black uppercase tracking-[3px] text-gray-900 dark:text-white whitespace-nowrap">
          More Stories
        </h2>
        <div class="flex-1 h-px bg-gray-200 dark:bg-white/[0.08]" />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <BlogCard v-for="post in gridPosts" :key="post.id" :post="post" />
      </div>
    </section>

    <!-- ══════════════════════════════════
         NEWSLETTER CTA
    ══════════════════════════════════ -->
    <div class="max-w-[1400px] mx-auto px-6 sm:px-8 py-12">
      <div
        class="bg-[#111] dark:bg-[#0a0a0a] border border-white/[0.08]
               px-10 py-9 flex flex-col lg:flex-row items-center justify-between gap-6"
      >
        <div>
          <h3 class="text-xl font-black text-white tracking-tight mb-1">
            Stay ahead of AI.
          </h3>
          <p class="text-[13px] text-gray-500">
            Weekly digest of GPT, Claude, Gemini and the world of AI.
          </p>
        </div>
        <form class="flex gap-2 flex-shrink-0" @submit.prevent>
          <input
            type="email"
            placeholder="your@email.com"
            aria-label="Email address"
            class="font-sans text-[13px] bg-[#1e1e1e] border border-[#2d2d2d]
                   text-white placeholder-[#555] px-5 py-3 outline-none
                   w-56 focus:border-gray-500 transition"
          />
          <button
            type="submit"
            class="font-sans text-[11px] font-black bg-white text-gray-900
                   px-6 py-3 hover:bg-gray-100 transition tracking-wide uppercase"
          >
            Subscribe →
          </button>
        </form>
      </div>
    </div>

  </div>
</template>
