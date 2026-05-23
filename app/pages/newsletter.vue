<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'

const { $wp } = useNuxtApp()
const { data: posts } = await useAsyncData('newsletter-page', () => $wp.getPosts(1, 20))

function postImg(post: PostModel, w = 600, h = 400) {
  return post.featuredImage || `https://picsum.photos/seed/${post.id}/${w}/${h}`
}

useSeoMeta({
  title: 'Newsletters – NeuralBriefly',
  description: 'Catch up on all our top AI newsletters and stories.',
})
</script>

<template>
  <div class="min-h-screen bg-black">

    <!-- Hero header -->
    <div class="border-b border-white/[0.08] py-16 px-5">
      <div class="max-w-[1158px] mx-auto">
        <p class="text-[11px] uppercase tracking-[3px] text-gray-500 font-display mb-3">
          Catch up on top stories
        </p>
        <h1 class="font-black text-white leading-none tracking-tight"
            style="font-size: clamp(48px, 8vw, 96px); font-family: 'Inter', sans-serif !important">
          NEWSLETTERS
        </h1>
      </div>
    </div>

    <!-- Grid -->
    <div class="max-w-[1158px] mx-auto px-5 py-12">

      <!-- Skeleton -->
      <div v-if="!posts?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div v-for="n in 8" :key="n" class="animate-pulse bg-[#1a1a1a]" style="height: 300px" />
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <NuxtLink
          v-for="post in posts"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          class="relative overflow-hidden group"
          style="height: 300px"
        >
          <img
            :src="postImg(post)"
            :alt="post.title"
            loading="lazy"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 pointer-events-none" />
          <div class="absolute inset-0 p-5 flex flex-col justify-between z-10">
            <span class="text-[9px] font-black uppercase tracking-[2.5px] text-white/70 font-display">
              Newsletter
            </span>
            <div>
              <h2 class="text-[16px] font-black text-white leading-snug line-clamp-3 font-display mb-2">
                {{ post.title }}
              </h2>
              <span class="text-[11px] text-white/50">{{ post.formattedDate }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>

    </div>
  </div>
</template>
