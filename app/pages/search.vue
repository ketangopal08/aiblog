<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'

const { $wp } = useNuxtApp()
const route = useRoute()

const q = computed(() => String(route.query.q ?? '').trim())
const page = computed(() => Number(route.query.page ?? 1))

const { data, refresh } = await useAsyncData(
  () => `search-${q.value}-${page.value}`,
  async () => {
    if (!q.value) return { items: [], total: 0, totalPages: 0 }
    return $wp.searchPosts(q.value, page.value)
  }
)

watch([q, page], () => refresh())

const posts = computed(() => data.value?.items ?? [])
const total = computed(() => data.value?.total ?? 0)
const totalPages = computed(() => data.value?.totalPages ?? 1)

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
      title: q ? `Search: ${q} – NeuralBriefly` : 'Search – NeuralBriefly',
      description: `Search results for '${q}' on NeuralBriefly.`,
      ogType: 'website',
    }" />
    <Head><Meta name="robots" content="noindex, follow" /></Head>

    <div class="max-w-[1238px] mx-auto px-5 py-10">
      <!-- Header -->
      <div class="mb-8 border-b border-gray-100 dark:border-white/[0.06] pb-6">
        <h1 class="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          <template v-if="q">
            {{ total }} result{{ total !== 1 ? 's' : '' }} for
            <span class="border-b-2 border-gray-900 dark:border-white">"{{ q }}"</span>
          </template>
          <template v-else>Search</template>
        </h1>
      </div>

      <!-- No query -->
      <div v-if="!q" class="text-center py-20 text-gray-400 dark:text-gray-600">
        <svg class="w-10 h-10 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/></svg>
        <p class="text-sm">Enter a search term to find articles.</p>
      </div>

      <!-- Empty results -->
      <div v-else-if="!posts.length && data" class="text-center py-20 text-gray-500 dark:text-gray-400">
        <p class="text-base font-semibold text-gray-900 dark:text-white mb-2">No articles found for "{{ q }}"</p>
        <p class="text-sm">Try different keywords or browse by <NuxtLink to="/" class="underline hover:text-gray-900 dark:hover:text-white">category</NuxtLink>.</p>
      </div>

      <!-- Results list -->
      <template v-else>
        <NuxtLink
          v-for="post in posts"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          class="flex items-start gap-4 sm:gap-5 py-5 border-b border-gray-100 dark:border-white/[0.06] group hover:bg-gray-50 dark:hover:bg-white/[0.02] -mx-3 px-3 transition-colors"
        >
          <div class="w-[110px] sm:w-[200px] flex-shrink-0 overflow-hidden" style="height: 120px">
            <img :src="postImg(post as PostModel)" :alt="post.title" loading="lazy" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
          </div>
          <div class="flex-1 min-w-0 py-1">
            <div class="flex items-start justify-between gap-3 mb-2">
              <span class="text-[9px] font-black uppercase tracking-[2px] text-gray-500 dark:text-gray-400 border-b border-gray-400 dark:border-gray-600 pb-px">{{ post.categories[0]?.name ?? 'AI' }}</span>
              <span class="text-[11px] text-gray-400 dark:text-gray-500 flex-shrink-0">{{ timeAgo(post.date) }}</span>
            </div>
            <h2 class="text-[15px] sm:text-[18px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">{{ post.title }}</h2>
            <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2" v-html="post.excerpt" />
          </div>
        </NuxtLink>

        <Pagination :current-page="page" :total-pages="totalPages" />
      </template>
    </div>
  </div>
</template>
