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
  robots: 'noindex, follow',
})
</script>

<template>
  <div class="min-h-screen bg-black">

    <!-- Hero header -->
    <div class="border-b border-white/[0.08] py-16 px-5">
      <div class="max-w-[1238px] mx-auto">
        <p class="text-[11px] uppercase tracking-[3px] text-gray-500 font-display mb-3">
          Catch up on top stories
        </p>
        <h1 class="font-black text-white leading-none tracking-tight"
            style="font-size: clamp(48px, 8vw, 96px); font-family: 'Inter', sans-serif !important">
          NEWSLETTERS
        </h1>
      </div>
    </div>

    <!-- Coming Soon -->
    <div class="max-w-[1238px] mx-auto px-5 py-24 flex flex-col items-center justify-center text-center">
      <div class="inline-flex items-center gap-2 border border-primary/40 text-primary text-[10px] font-black uppercase tracking-[3px] px-4 py-2 mb-8">
        <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        Coming Soon
      </div>
      <h2 class="text-white font-black leading-none tracking-tight mb-4"
          style="font-size: clamp(32px, 5vw, 64px)">
        Something big is brewing.
      </h2>
      <p class="text-gray-500 text-[15px] leading-relaxed max-w-md mb-10">
        Our newsletter is on the way — curated AI news, model updates, and practical guides delivered straight to your inbox.
      </p>
      <NuxtLink to="/" class="bg-primary text-white text-[11px] font-black uppercase tracking-[2px] px-6 py-3 hover:bg-primary/80 transition-colors">
        Back to Home
      </NuxtLink>
    </div>

  </div>
</template>
