<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'

const { $wp } = useNuxtApp()

const allPosts = ref<PostModel[]>([])
const { fetchCategories } = useCategories()

await Promise.all([
  fetchCategories(),
  (async () => { allPosts.value = await $wp.getPosts(1, 20) as PostModel[] })()
])

const featuredPost = computed(() => allPosts.value[0] ?? null)
const topStories   = computed(() => allPosts.value.slice(1, 6))
const gridPosts    = computed(() => allPosts.value.slice(0, 4))
const articlePosts = computed(() => allPosts.value.slice(0, 10))

const AI_TABS = ['All', 'GPT', 'Gemini', 'Claude']
const activeTab = ref('All')

const filteredFeatured = computed(() => {
  if (activeTab.value === 'All') return allPosts.value.slice(0, 5)
  return allPosts.value
    .filter(p => p.categories.some(c => c.name.toLowerCase().includes(activeTab.value.toLowerCase())))
    .slice(0, 5)
})
</script>

<template>
  <div>
    <SeoHead :seo="{ title: 'AI Blog – Home', description: 'Latest articles on GPT, Gemini, Claude and the AI world.' }" />

    <!-- ─── Hero: Featured + Top Stories ─── -->
    <section class="max-w-7xl mx-auto px-4 pt-6 pb-8">
      <div class="flex flex-col lg:flex-row gap-0 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm dark:shadow-none">

        <!-- Left: big featured post -->
        <div class="flex-1 min-w-0 relative group">
          <div v-if="!featuredPost" class="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse" />
          <NuxtLink v-else :to="`/blog/${featuredPost.slug}`" class="block relative h-72 lg:h-full min-h-72 overflow-hidden">
            <img
              v-if="featuredPost.featuredImage"
              :src="featuredPost.featuredImage"
              :alt="featuredPost.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="w-full h-full bg-gray-200 dark:bg-gray-800" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div class="absolute bottom-0 left-0 right-0 p-6">
              <span class="text-xs font-bold text-teal-400 uppercase tracking-widest mb-2 block">
                {{ featuredPost.categories[0]?.name ?? 'AI' }}
              </span>
              <h2 class="text-2xl lg:text-3xl font-extrabold leading-tight text-white line-clamp-3">
                {{ featuredPost.title }}
              </h2>
              <p class="text-sm text-gray-300 mt-2">
                {{ featuredPost.author.name }} &nbsp;·&nbsp; {{ featuredPost.formattedDate }}
              </p>
            </div>
          </NuxtLink>
        </div>

        <!-- Divider -->
        <div class="hidden lg:block w-px bg-gray-200 dark:bg-gray-800 self-stretch" />

        <!-- Right: Top Stories numbered list -->
        <div class="w-full lg:w-96 flex-shrink-0 bg-gray-50 dark:bg-gray-950 p-5">
          <h3 class="text-teal-500 dark:text-teal-400 font-bold text-base mb-4 tracking-wide">Top Stories</h3>

          <div v-if="!topStories.length" class="space-y-5">
            <div v-for="n in 5" :key="n" class="flex gap-3 animate-pulse">
              <div class="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full flex-shrink-0" />
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                <div class="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
              </div>
            </div>
          </div>

          <div v-else class="space-y-0 divide-y divide-gray-200 dark:divide-gray-800">
            <NuxtLink
              v-for="(post, i) in topStories"
              :key="post.id"
              :to="`/blog/${post.slug}`"
              class="flex items-start gap-4 py-4 group hover:bg-gray-100 dark:hover:bg-gray-900 -mx-5 px-5 transition"
            >
              <span class="flex-shrink-0 w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-800 group-hover:bg-teal-500 text-gray-500 dark:text-gray-400 group-hover:text-white text-xs font-bold flex items-center justify-center transition">
                {{ i + 1 }}
              </span>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-gray-900 dark:text-white leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition line-clamp-2">
                  {{ post.title }}
                </h4>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wide">
                  {{ post.author.name }} &nbsp;·&nbsp; {{ post.formattedDate }}
                </p>
              </div>
              <div class="flex-shrink-0 w-16 h-14 rounded overflow-hidden bg-gray-200 dark:bg-gray-800">
                <img
                  v-if="post.featuredImage"
                  :src="post.featuredImage"
                  :alt="post.title"
                  class="w-full h-full object-cover"
                />
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── All posts 2×2 grid + Featured sidebar ─── -->
    <section class="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-8">

      <!-- Left: 2×2 grid -->
      <div class="flex-1 min-w-0">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">All</h2>

        <div v-if="!allPosts.length" class="grid grid-cols-2 gap-4">
          <div v-for="n in 4" :key="n" class="rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse h-44" />
        </div>

        <div v-else class="grid grid-cols-2 gap-4">
          <NuxtLink
            v-for="post in gridPosts"
            :key="post.id"
            :to="`/blog/${post.slug}`"
            class="group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-md dark:hover:border-teal-600 transition bg-white dark:bg-gray-900"
          >
            <div class="h-32 bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <img
                v-if="post.featuredImage"
                :src="post.featuredImage"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600 text-4xl">✦</div>
            </div>
            <div class="p-3">
              <span class="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wide">
                {{ post.categories[0]?.name ?? 'AI' }}
              </span>
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white mt-0.5 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition leading-snug">
                {{ post.title }}
              </h3>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ post.formattedDate }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Divider -->
      <div class="hidden lg:block w-px bg-gray-200 dark:bg-gray-800 self-stretch" />

      <!-- Right: AI filter + Featured -->
      <div class="w-full lg:w-80 flex-shrink-0">
        <div class="flex gap-1.5 mb-4 flex-wrap">
          <button
            v-for="tab in AI_TABS"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide transition border',
              activeTab === tab
                ? 'bg-teal-500 text-white border-teal-500'
                : 'bg-transparent text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-700 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400'
            ]"
          >
            {{ tab }}
          </button>
        </div>

        <h2 class="text-lg font-bold text-gray-900 dark:text-white border-b-2 border-teal-500 pb-1 mb-4">Featured</h2>

        <div v-if="!allPosts.length" class="space-y-3">
          <div v-for="n in 3" :key="n" class="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
        </div>

        <div v-else class="space-y-3">
          <BlogFeaturedSnippet v-for="post in filteredFeatured" :key="post.id" :post="post" />
          <p v-if="!filteredFeatured.length" class="text-sm text-gray-400 text-center py-6">
            No posts for {{ activeTab }} yet.
          </p>
        </div>
      </div>
    </section>

    <!-- ─── Articles horizontal scroll ─── -->
    <section class="max-w-7xl mx-auto px-4 pb-16">
      <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">Articles</h2>

      <div v-if="!allPosts.length" class="flex gap-4 overflow-hidden">
        <div v-for="n in 5" :key="n" class="flex-shrink-0 w-52 h-48 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
      </div>

      <div v-else class="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
        <BlogHorizontalCard v-for="post in articlePosts" :key="post.id" :post="post" class="snap-start" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
