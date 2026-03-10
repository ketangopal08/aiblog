<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'
const props = defineProps<{ post: PostModel }>()
const img = computed(() => props.post.featuredImage || `https://picsum.photos/seed/${props.post.id}/800/500`)
</script>

<template>
  <article class="bg-white dark:bg-[#161616] group border-b border-gray-200 dark:border-[#222222] pb-5 mb-5 last:border-b-0">
    <NuxtLink :to="`/blog/${post.slug}`" class="block overflow-hidden relative rounded-xl">
      <!-- image -->
      <img
        :src="img"
        :alt="post.title"
        class="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <!-- dark hover gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      <!-- category pill on image -->
      <span
        v-if="post.categories[0]"
        class="absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-white bg-primary"
      >
        {{ post.categories[0].name }}
      </span>
      <!-- reading time badge -->
      <span class="absolute bottom-3 right-3 text-[10px] font-bold text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
        {{ post.readingTime }} min
      </span>
    </NuxtLink>

    <div class="mt-3">
      <h2 class="text-base font-black text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-primary transition">
        <NuxtLink :to="`/blog/${post.slug}`">{{ post.title }}</NuxtLink>
      </h2>
      <p class="text-xs text-gray-400 dark:text-gray-500 mt-1.5 uppercase tracking-widest font-bold">
        {{ post.formattedDate }} &middot; {{ post.readingTime }} min read
      </p>
      <div class="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mt-2 leading-relaxed" v-html="post.excerpt" />
    </div>
  </article>
</template>
