<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'

const { $wp } = useNuxtApp()
const route = useRoute()

const page = computed(() => Number(route.query.page ?? 1))

const { data, refresh } = await useAsyncData(
  () => `blog-index-${page.value}`,
  () => $wp.getPostsPaginated(page.value, 12)
)

watch(page, () => refresh())

const posts = computed(() => data.value?.items ?? [])
const totalPages = computed(() => data.value?.totalPages ?? 1)
const total = computed(() => data.value?.total ?? 0)

type ViewMode = 'list' | 'grid'
const view = ref<ViewMode>('list')

function postImg(post: PostModel, w = 480, h = 320) {
  return post.featuredImage || `https://picsum.photos/seed/${post.id}/${w}/${h}`
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3_600_000)
  if (hours < 24) return `${hours} hrs ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <div class="bg-white dark:bg-[#0D0D0D] min-h-screen">
    <SeoHead :seo="{
      title: 'All Posts – NeuralBriefly',
      description: 'Browse all AI articles on NeuralBriefly — in-depth coverage of GPT, Gemini, Claude, open-source models, AI tools, and the latest research and news.',
      ogType: 'website',
      canonicalUrl: 'https://www.neuralbriefly.com/blog',
    }" />

    <div class="max-w-[1238px] mx-auto px-5 py-10">
      <!-- Header -->
      <div class="flex items-end justify-between mb-8 gap-4 border-b border-gray-100 dark:border-white/[0.06] pb-6">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            All Posts
          </h1>
          <p v-if="total > 0" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ total }} articles
          </p>
        </div>
        <!-- View toggle -->
        <div class="flex gap-1 flex-shrink-0">
          <button @click="view = 'list'" :class="view === 'list' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-400 hover:text-gray-900 dark:hover:text-white'" class="w-9 h-9 flex items-center justify-center transition-colors" aria-label="List view">
            <svg class="w-[15px] h-[15px]" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <button @click="view = 'grid'" :class="view === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-400 hover:text-gray-900 dark:hover:text-white'" class="w-9 h-9 flex items-center justify-center transition-colors" aria-label="Grid view">
            <svg class="w-[14px] h-[14px]" fill="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>
          </button>
        </div>
      </div>

      <!-- LIST VIEW -->
      <template v-if="view === 'list'">
        <template v-if="!posts.length">
          <div v-for="n in 6" :key="n" class="flex items-start gap-5 py-5 border-b border-gray-100 dark:border-white/[0.06] animate-pulse">
            <div class="w-[220px] flex-shrink-0 bg-gray-200 dark:bg-[#1a1a1a]" style="height:140px" />
            <div class="flex-1 space-y-3 pt-2"><div class="h-2.5 bg-gray-200 dark:bg-[#1a1a1a] rounded w-24" /><div class="h-4 bg-gray-200 dark:bg-[#1a1a1a] rounded w-full" /><div class="h-4 bg-gray-200 dark:bg-[#1a1a1a] rounded w-4/5" /></div>
          </div>
        </template>
        <NuxtLink v-for="post in posts" :key="post.id" :to="`/blog/${post.slug}`" class="flex items-start gap-4 sm:gap-5 py-5 border-b border-gray-100 dark:border-white/[0.06] group hover:bg-gray-50 dark:hover:bg-white/[0.02] -mx-3 px-3 transition-colors">
          <div class="w-[110px] sm:w-[200px] lg:w-[240px] flex-shrink-0 overflow-hidden" style="height: 130px">
            <img :src="postImg(post as PostModel)" :alt="post.title" loading="lazy" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
          </div>
          <div class="flex-1 min-w-0 py-1">
            <div class="flex items-start justify-between gap-3 mb-2">
              <span class="cat-label text-[9px] font-black uppercase tracking-[2px] text-gray-500 dark:text-gray-400 border-b border-gray-400 dark:border-gray-600 pb-px leading-none">{{ post.categories[0]?.name ?? 'AI' }}</span>
              <span class="text-[11px] text-gray-400 dark:text-gray-500 flex-shrink-0 whitespace-nowrap">{{ timeAgo(post.date) }}</span>
            </div>
            <h2 class="text-[15px] sm:text-[18px] lg:text-[20px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-3 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" v-html="post.title" />
          </div>
        </NuxtLink>
      </template>

      <!-- GRID VIEW -->
      <template v-else>
        <div v-if="!posts.length" class="grid grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="n in 6" :key="n" class="animate-pulse"><div class="bg-gray-200 dark:bg-[#1a1a1a] mb-3" style="height:160px" /><div class="h-2.5 bg-gray-200 dark:bg-[#1a1a1a] rounded w-20 mb-2" /><div class="h-4 bg-gray-200 dark:bg-[#1a1a1a] rounded w-full mb-1" /><div class="h-4 bg-gray-200 dark:bg-[#1a1a1a] rounded w-3/4" /></div>
        </div>
        <div v-else class="grid grid-cols-2 lg:grid-cols-3 gap-5">
          <NuxtLink v-for="post in posts" :key="post.id" :to="`/blog/${post.slug}`" class="group">
            <div class="overflow-hidden mb-3" style="height: 160px">
              <img :src="postImg(post as PostModel)" :alt="post.title" loading="lazy" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
            </div>
            <span class="cat-label text-[9px] font-black uppercase tracking-[2px] text-gray-500 dark:text-gray-400 border-b border-gray-400 dark:border-gray-600 pb-px inline-block mb-2">{{ post.categories[0]?.name ?? 'AI' }}</span>
            <h2 class="text-[14px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" v-html="post.title" />
            <span class="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 block">{{ timeAgo(post.date) }}</span>
          </NuxtLink>
        </div>
      </template>

      <Pagination :current-page="page" :total-pages="totalPages" />
    </div>
  </div>
</template>
