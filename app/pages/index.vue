<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'

const { $wp } = useNuxtApp()

const allPosts = ref<PostModel[]>([])
const { fetchCategories } = useCategories()

await Promise.all([
  fetchCategories(),
  (async () => { allPosts.value = await $wp.getPosts(1, 20) as PostModel[] })()
])

const featuredPost  = computed(() => allPosts.value[0] ?? null)
const latestPosts   = computed(() => allPosts.value.slice(1, 5))
const carouselPosts = computed(() => allPosts.value.slice(1))

const carouselIndex = ref(0)
const visibleCards  = computed(() => carouselPosts.value.slice(carouselIndex.value, carouselIndex.value + 3))

function prevSlide() {
  if (carouselIndex.value >= 3) carouselIndex.value -= 3
}
function nextSlide() {
  if (carouselIndex.value + 3 < carouselPosts.value.length) carouselIndex.value += 3
}
</script>

<template>
  <div class="bg-white dark:bg-[#0D0D0D] min-h-screen">
    <SeoHead :seo="{ title: 'AI Blog – Home', description: 'Latest articles on GPT, Gemini, Claude and the AI world.' }" />

    <!-- ══════════════════════════════════
         HERO — Featured card + Latest post
    ══════════════════════════════════ -->
    <section class="max-w-6xl mx-auto px-5 pt-8 pb-10">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

        <!-- ── Left: featured card ── -->
        <!-- skeleton -->
        <div v-if="!featuredPost" class="rounded-2xl overflow-hidden animate-pulse bg-gray-200 dark:bg-gray-800 h-[440px]" />

        <!-- card -->
        <NuxtLink
          v-else
          :to="`/blog/${featuredPost.slug}`"
          class="relative block rounded-2xl overflow-hidden group h-[440px] bg-gray-200 dark:bg-gray-800"
        >
          <img
            v-if="featuredPost.featuredImage"
            :src="featuredPost.featuredImage"
            :alt="featuredPost.title"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          />

          <!-- strong bottom gradient -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <!-- text content -->
          <div class="absolute bottom-0 left-0 right-0 p-7 flex flex-col gap-3">
            <!-- category pill -->
            <span class="inline-flex items-center gap-2 self-start bg-white dark:bg-white/95 rounded-full px-3 py-1 shadow-sm">
              <span class="w-2 h-2 rounded-full flex-shrink-0" style="background:#ff5811"></span>
              <span class="text-xs font-semibold text-gray-700 leading-none">
                {{ featuredPost.categories[0]?.name ?? 'AI' }}
              </span>
            </span>

            <!-- title -->
            <h1 class="text-2xl lg:text-[1.7rem] font-bold text-white leading-snug line-clamp-3">
              {{ featuredPost.title }}
            </h1>

            <!-- meta -->
            <p class="text-sm text-white/65 flex items-center gap-2">
              <span>{{ featuredPost.formattedDate }}</span>
              <span class="text-white/40">•</span>
              <span>{{ featuredPost.readingTime }} min read</span>
            </p>
          </div>
        </NuxtLink>

        <!-- ── Right: Latest post sidebar ── -->
        <div class="flex flex-col">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">Latest post</h2>

          <!-- skeleton -->
          <div v-if="!latestPosts.length" class="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
            <div v-for="n in 4" :key="n" class="flex gap-3 py-4 first:pt-0 animate-pulse">
              <div class="w-[72px] h-[72px] flex-shrink-0 rounded-xl bg-gray-200 dark:bg-gray-800" />
              <div class="flex-1 space-y-2 pt-1">
                <div class="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                <div class="h-3 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
                <div class="h-3 bg-gray-200 dark:bg-gray-800 rounded w-4/6" />
                <div class="h-2.5 bg-gray-200 dark:bg-gray-800 rounded w-2/5 mt-2" />
              </div>
            </div>
          </div>

          <!-- list -->
          <div v-else class="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
            <NuxtLink
              v-for="post in latestPosts"
              :key="post.id"
              :to="`/blog/${post.slug}`"
              class="flex items-start gap-3 py-4 first:pt-0 group"
            >
              <!-- square thumbnail -->
              <div class="w-[72px] h-[72px] flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  v-if="post.featuredImage"
                  :src="post.featuredImage"
                  :alt="post.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <!-- text -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-3 group-hover:text-[#ff5811] transition-colors">
                  {{ post.title }}
                </p>
                <p class="mt-1.5 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                  <span>{{ post.formattedDate }}</span>
                  <span>•</span>
                  <span>{{ post.readingTime }} min read</span>
                </p>
              </div>
            </NuxtLink>
          </div>
        </div>

      </div>
    </section>

    <!-- divider -->
    <div class="max-w-6xl mx-auto px-5">
      <hr class="border-gray-100 dark:border-gray-800" />
    </div>

    <!-- ══════════════════════════════════
         FOUNDERS CORNER — 3-card carousel
    ══════════════════════════════════ -->
    <section class="max-w-6xl mx-auto px-5 py-10">

      <!-- header -->
      <div class="flex items-center justify-between mb-7">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Founders corner</h2>
        <div class="flex items-center gap-2">
          <button
            @click="prevSlide"
            :disabled="carouselIndex === 0"
            class="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-[#ff5811] hover:border-[#ff5811] disabled:opacity-25 disabled:pointer-events-none transition"
            aria-label="Previous"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button
            @click="nextSlide"
            :disabled="carouselIndex + 3 >= carouselPosts.length"
            class="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-[#ff5811] hover:border-[#ff5811] disabled:opacity-25 disabled:pointer-events-none transition"
            aria-label="Next"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- skeleton -->
      <div v-if="!carouselPosts.length" class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div v-for="n in 3" :key="n" class="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-pulse">
          <div class="h-52 bg-gray-200 dark:bg-gray-800" />
          <div class="p-5 space-y-3">
            <div class="h-3 bg-gray-200 dark:bg-gray-800 rounded w-20" />
            <div class="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
            <div class="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
            <div class="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full" />
            <div class="h-3 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
          </div>
        </div>
      </div>

      <!-- cards -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <NuxtLink
          v-for="post in visibleCards"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          class="group flex flex-col rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow duration-300"
        >
          <!-- image -->
          <div class="h-52 overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
            <img
              v-if="post.featuredImage"
              :src="post.featuredImage"
              :alt="post.title"
              class="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
            />
          </div>

          <!-- content -->
          <div class="flex flex-col flex-1 p-5 gap-2.5">
            <!-- category -->
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full flex-shrink-0" style="background:#ff5811"></span>
              <span class="text-xs text-gray-400 dark:text-gray-500">
                {{ post.categories[0]?.name ?? 'AI' }}
              </span>
            </div>

            <!-- title -->
            <h3 class="text-[1.05rem] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#ff5811] transition-colors">
              {{ post.title }}
            </h3>

            <!-- excerpt -->
            <div class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 flex-1" v-html="post.excerpt" />

            <!-- meta -->
            <p class="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5 pt-1 mt-auto">
              <span>{{ post.formattedDate }}</span>
              <span>•</span>
              <span>{{ post.readingTime }} min read</span>
            </p>
          </div>
        </NuxtLink>
      </div>

    </section>
  </div>
</template>
