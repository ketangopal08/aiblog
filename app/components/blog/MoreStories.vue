<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'

const { $wp } = useNuxtApp()
const { data: posts } = await useAsyncData('more-stories', () => $wp.getPosts(1, 8))

type ViewMode = 'list' | 'grid'
const view = ref<ViewMode>('list')

function postImg(post: PostModel, w = 480, h = 320) {
  return post.featuredImage || `https://picsum.photos/seed/${post.id}/${w}/${h}`
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
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
  <section class="bg-white dark:bg-[#0D0D0D] py-12">
    <div class="max-w-[1238px] mx-auto px-5">

      <!-- Header row -->
      <div class="flex items-end justify-between mb-8 gap-4">
        <div class="flex items-end gap-5">
          <!-- AI logo mark -->
          <div class="relative flex-shrink-0 leading-none">
            <span
              class="text-[52px] sm:text-[64px] font-black tracking-tighter text-gray-900 dark:text-white"
              style="font-family: 'Inter', sans-serif !important; line-height: 1"
            >AI</span>
            <span class="absolute bottom-0 left-0 h-[10px] w-[36px] bg-[var(--accent)]" />
          </div>
          <p class="text-[9px] sm:text-[10px] font-bold uppercase tracking-[2.5px] text-gray-500 dark:text-gray-400 mb-1 max-w-[220px] leading-relaxed">
            Catch up on trending news on artificial intelligence
          </p>
        </div>
        <NuxtLink
          to="/blog"
          class="hidden sm:flex flex-shrink-0 items-center gap-2 border border-primary
                 text-[11px] font-bold uppercase tracking-[1.5px] px-5 py-2.5
                 text-primary
                 hover:bg-primary hover:text-white hover:border-primary
                 transition-colors duration-200"
        >
          See More AI Stories
          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10"/>
          </svg>
        </NuxtLink>
      </div>

      <!-- Content + Sidebar -->
      <div class="flex gap-[20px] lg:gap-[30px]">

        <!-- Posts area -->
        <div class="flex-1 min-w-0">

          <!-- View toggle -->
          <div class="flex justify-end mb-4">
            <div class="flex gap-1">
              <button
                @click="view = 'list'"
                :class="view === 'list'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-400 hover:text-gray-900 dark:hover:text-white'"
                class="w-9 h-9 flex items-center justify-center transition-colors"
                aria-label="List view"
              >
                <svg class="w-[15px] h-[15px]" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
              <button
                @click="view = 'grid'"
                :class="view === 'grid'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-400 hover:text-gray-900 dark:hover:text-white'"
                class="w-9 h-9 flex items-center justify-center transition-colors"
                aria-label="Grid view"
              >
                <svg class="w-[14px] h-[14px]" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="8" height="8" rx="1"/>
                  <rect x="13" y="3" width="8" height="8" rx="1"/>
                  <rect x="3" y="13" width="8" height="8" rx="1"/>
                  <rect x="13" y="13" width="8" height="8" rx="1"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- ── LIST VIEW ── -->
          <template v-if="view === 'list'">
            <!-- Skeleton -->
            <template v-if="!posts?.length">
              <div
                v-for="n in 5" :key="n"
                class="flex items-start gap-5 py-5 border-b border-gray-100 dark:border-white/[0.06] animate-pulse"
              >
                <div class="w-[220px] flex-shrink-0 bg-gray-200 dark:bg-[#1a1a1a]" style="height:140px" />
                <div class="flex-1 space-y-3 pt-2">
                  <div class="h-2.5 bg-gray-200 dark:bg-[#1a1a1a] rounded w-24" />
                  <div class="h-4 bg-gray-200 dark:bg-[#1a1a1a] rounded w-full" />
                  <div class="h-4 bg-gray-200 dark:bg-[#1a1a1a] rounded w-4/5" />
                </div>
              </div>
            </template>

            <NuxtLink
              v-for="post in posts"
              :key="post.id"
              :to="`/blog/${post.slug}`"
              class="flex items-start gap-4 sm:gap-5 py-5 border-b border-gray-100 dark:border-white/[0.06]
                     group hover:bg-gray-50 dark:hover:bg-white/[0.02] -mx-3 px-3 transition-colors"
            >
              <!-- Thumbnail -->
              <div class="w-[130px] sm:w-[250px] lg:w-[290px] h-[90px] sm:h-[170px] lg:h-[190px] flex-shrink-0 img-card bg-gray-100 dark:bg-[#1a1a1a]">
                <img
                  :src="postImg(post)"
                  :alt="post.title"
                  loading="lazy"
                  class="w-full h-full object-cover"
                />
              </div>
              <!-- Content -->
              <div class="flex-1 min-w-0 py-1">
                <div class="flex items-start justify-between gap-3 mb-2">
                  <span class="cat-label text-[9px] font-black uppercase tracking-[2px] text-gray-500 dark:text-gray-400 leading-none">
                    {{ post.categories[0]?.name ?? 'AI' }}
                  </span>
                  <span class="text-[11px] text-gray-400 dark:text-gray-500 flex-shrink-0 whitespace-nowrap">
                    {{ timeAgo(post.date) }}
                  </span>
                </div>
                <h3 class="text-[15px] sm:text-[18px] lg:text-[20px] font-bold text-gray-900 dark:text-white
                           leading-snug group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                    style="overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-clamp:2;font-size: 1.4rem !important;"
                    v-html="post.title" />
                <p
                  v-if="post.excerpt"
                  class="hidden sm:block text-[13px] text-gray-500 dark:text-gray-400 mt-2"
                  style="overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-clamp:2"
                  v-html="post.excerpt"
                />
              </div>
            </NuxtLink>
          </template>

          <!-- ── GRID VIEW ── -->
          <template v-else>
            <!-- Skeleton -->
            <div v-if="!posts?.length" class="grid grid-cols-2 lg:grid-cols-3 gap-5">
              <div v-for="n in 6" :key="n" class="animate-pulse">
                <div class="bg-gray-200 dark:bg-[#1a1a1a] mb-3" style="height:160px" />
                <div class="h-2.5 bg-gray-200 dark:bg-[#1a1a1a] rounded w-20 mb-2" />
                <div class="h-4 bg-gray-200 dark:bg-[#1a1a1a] rounded w-full mb-1" />
                <div class="h-4 bg-gray-200 dark:bg-[#1a1a1a] rounded w-3/4" />
              </div>
            </div>

            <div v-else class="grid grid-cols-2 lg:grid-cols-3 gap-5">
              <NuxtLink
                v-for="post in posts"
                :key="post.id"
                :to="`/blog/${post.slug}`"
                class="group"
              >
                <div class="overflow-hidden mb-3" style="height: 160px">
                  <img
                    :src="postImg(post)"
                    :alt="post.title"
                    loading="lazy"
                    class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                <span class="cat-label text-[9px] font-black uppercase tracking-[2px] text-gray-500 dark:text-gray-400
                             inline-block mb-2">
                  {{ post.categories[0]?.name ?? 'AI' }}
                </span>
                <h3 class="text-[14px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2
                           group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                    v-html="post.title" />
                <span class="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 block">
                  {{ timeAgo(post.date) }}
                </span>
              </NuxtLink>
            </div>
          </template>

          <!-- Mobile "See More" link -->
          <div class="sm:hidden mt-6">
            <NuxtLink
              to="/blog"
              class="flex items-center justify-center gap-2 border border-primary
                     text-[11px] font-bold uppercase tracking-[1.5px] px-5 py-3 w-full
                     text-primary
                     hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900
                     transition-colors duration-200"
            >
              See More AI Stories
              <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10"/>
              </svg>
            </NuxtLink>
          </div>
        </div>

        <!-- Ad sidebar — desktop only -->
        <div class="hidden lg:block w-[200px] xl:w-[240px] flex-shrink-0">
          <div
            class="w-full border border-dashed border-gray-200 dark:border-white/[0.08]
                   flex items-center justify-center sticky top-14"
            style="min-height: 400px"
          >
            <p class="text-[9px] font-bold uppercase tracking-[3px] text-gray-300 dark:text-white/20 rotate-0">
              Advertisement
            </p>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
