<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'

const { $wp } = useNuxtApp()

const allPosts = ref<PostModel[]>([])
const featuredPost = ref<PostModel | null>(null)
const { fetchCategories } = useCategories()

const FEATURED_SLUG = 'claude-constitutional-ai-explained'

await Promise.all([
  fetchCategories(),
  (async () => { allPosts.value = await $wp.getPosts(1, 20) as PostModel[] })(),
  (async () => { featuredPost.value = await $wp.getPostBySlug(FEATURED_SLUG) as PostModel | null })(),
])

if (!featuredPost.value) featuredPost.value = allPosts.value[0] ?? null

const remainingPosts = computed(() =>
  allPosts.value.filter(p => p.slug !== FEATURED_SLUG)
)

const sideCards   = computed(() => remainingPosts.value.slice(0, 2))
const listPosts   = computed(() => remainingPosts.value.slice(2, 6))
const latestPosts = computed(() => remainingPosts.value.slice(6, 12))

function postImg(post: PostModel, w = 800, h = 500) {
  return post.featuredImage || `https://picsum.photos/seed/${post.id}/${w}/${h}`
}
</script>

<template>
  <div class="bg-white dark:bg-[#0D0D0D]">
    <SeoHead :seo="{ title: 'AI Blog – Home', description: 'Latest articles on GPT, Gemini, Claude and the AI world.' }" />

    <div class="max-w-[1200px] mx-auto px-8 pt-8 pb-16">

      <!-- ══════════════════════════════════
           HERO: 3-col grid
      ══════════════════════════════════ -->
      <section class="mb-2">
        <div class="grid grid-cols-1 lg:grid-cols-[5fr_3.5fr_2.5fr] gap-4 items-stretch">

          <!-- Col 1: Big hero card -->
          <div v-if="!featuredPost" class="rounded-2xl animate-pulse bg-gray-200 dark:bg-[#1f1f1f] min-h-[440px]" />
          <NuxtLink
            v-else
            :to="`/blog/${featuredPost.slug}`"
            class="relative block rounded-2xl overflow-hidden group bg-gray-200 dark:bg-[#1f1f1f] min-h-[440px]"
          >
            <img
              :src="postImg(featuredPost, 1200, 700)"
              :alt="featuredPost.title"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/88 via-black/30 to-black/10" />
            <div class="absolute bottom-0 left-0 right-0 p-7">
              <span class="block text-[10px] font-extrabold uppercase tracking-widest text-white mb-3">
                {{ featuredPost.categories[0]?.name ?? 'AI' }}
              </span>
              <h1 class="text-[26px] font-extrabold text-white leading-tight mb-3 line-clamp-3 tracking-tight">
                {{ featuredPost.title }}
              </h1>
              <p class="text-sm text-white/50 font-medium">{{ featuredPost.formattedDate }}</p>
            </div>
          </NuxtLink>

          <!-- Col 2: 2 stacked cards -->
          <div class="flex flex-col gap-4">
            <template v-if="!sideCards.length">
              <div v-for="n in 2" :key="n" class="flex-1 rounded-2xl animate-pulse bg-gray-200 dark:bg-[#1f1f1f] min-h-[200px]" />
            </template>
            <template v-else>
              <NuxtLink
                v-for="post in sideCards"
                :key="post.id"
                :to="`/blog/${post.slug}`"
                class="relative flex-1 rounded-2xl overflow-hidden group bg-gray-200 dark:bg-[#1f1f1f] min-h-[200px]"
              >
                <img
                  :src="postImg(post, 600, 400)"
                  :alt="post.title"
                  class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/82 via-black/15 to-transparent" />
                <div class="absolute bottom-0 left-0 right-0 p-[18px]">
                  <span class="block text-[9px] font-extrabold text-white uppercase tracking-widest mb-1.5">
                    {{ post.categories[0]?.name ?? 'AI' }}
                  </span>
                  <h3 class="text-[15px] font-bold text-white leading-snug line-clamp-2 mb-1">
                    {{ post.title }}
                  </h3>
                  <p class="text-[11px] text-white/50">{{ post.formattedDate }}</p>
                </div>
              </NuxtLink>
            </template>
          </div>

          <!-- Col 3: Thumbnail list -->
          <div class="flex flex-col border-l border-gray-100 dark:border-[#222] pl-5">
            <template v-if="!listPosts.length">
              <div
                v-for="n in 4" :key="n"
                class="flex gap-3 py-3.5 border-b border-gray-100 dark:border-[#222] last:border-b-0 animate-pulse"
              >
                <div class="w-[72px] h-[56px] rounded-lg bg-gray-200 dark:bg-[#1f1f1f] flex-shrink-0" />
                <div class="flex-1 space-y-2 pt-1">
                  <div class="h-2 bg-gray-200 dark:bg-[#1f1f1f] rounded w-1/3" />
                  <div class="h-3 bg-gray-200 dark:bg-[#1f1f1f] rounded w-full" />
                  <div class="h-3 bg-gray-200 dark:bg-[#1f1f1f] rounded w-2/3" />
                </div>
              </div>
            </template>
            <template v-else>
              <NuxtLink
                v-for="post in listPosts"
                :key="post.id"
                :to="`/blog/${post.slug}`"
                class="flex gap-3 items-start py-3.5 border-b border-gray-100 dark:border-[#222] last:border-b-0 first:pt-0 group"
              >
                <div class="w-[72px] h-[56px] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-[#1f1f1f]">
                  <img
                    :src="postImg(post, 200, 150)"
                    :alt="post.title"
                    loading="lazy"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-[9px] font-extrabold text-primary uppercase tracking-widest mb-1">
                    {{ post.categories[0]?.name ?? 'AI' }}
                  </p>
                  <p class="text-[13px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {{ post.title }}
                  </p>
                  <p class="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 font-medium">
                    {{ post.formattedDate }}
                  </p>
                </div>
              </NuxtLink>
            </template>
          </div>

        </div>
      </section>

      <!-- ══════════════════════════════════
           LATEST POSTS
      ══════════════════════════════════ -->
      <section v-if="latestPosts.length">
        <div class="flex items-center gap-4 my-9">
          <h2 class="text-[12px] font-extrabold uppercase tracking-[2px] text-gray-900 dark:text-white whitespace-nowrap">
            Latest Posts
          </h2>
          <div class="flex-1 h-px bg-gray-100 dark:bg-[#222]" />
          <NuxtLink to="/" class="text-[11px] font-bold text-primary uppercase tracking-widest">
            View All →
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-11">
          <BlogCard v-for="post in latestPosts" :key="post.id" :post="post" />
        </div>
      </section>

      <!-- ══════════════════════════════════
           NEWSLETTER CTA
      ══════════════════════════════════ -->
      <div class="bg-[#111] dark:bg-[#0a0a0a] rounded-2xl px-12 py-10
                  flex flex-col lg:flex-row items-center justify-between gap-8 mb-14">
        <div>
          <h3 class="text-[22px] font-extrabold text-white tracking-tight mb-1.5">
            Stay ahead of AI.
          </h3>
          <p class="text-[13px] text-gray-500">
            Weekly digest of the most important developments across GPT, Claude, Gemini and beyond.
          </p>
        </div>
        <form class="flex gap-2 flex-shrink-0" @submit.prevent>
          <input
            type="email"
            placeholder="your@email.com"
            class="font-sans text-[13px] bg-[#1e1e1e] border border-[#2d2d2d]
                   text-white placeholder-[#555] px-5 py-3 rounded-lg outline-none
                   w-60 focus:border-gray-500 transition"
          />
          <button
            type="submit"
            class="font-sans text-[12px] font-bold bg-primary text-white
                   px-5 py-3 rounded-lg hover:bg-orange-600 transition"
          >
            Subscribe →
          </button>
        </form>
      </div>

    </div>
  </div>
</template>
