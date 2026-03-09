<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'
defineProps<{ post: PostModel }>()
</script>

<template>
  <article class="bg-white dark:bg-gray-900 group border-b border-gray-200 dark:border-gray-800 pb-5 mb-5 last:border-b-0">
    <NuxtLink :to="`/blog/${post.slug}`" class="block overflow-hidden">
      <img
        v-if="post.featuredImage"
        :src="post.featuredImage"
        :alt="post.title"
        class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div v-else class="w-full h-48 bg-gray-200 dark:bg-gray-800" />
    </NuxtLink>
    <div class="mt-3">
      <div class="flex gap-2 mb-1.5 flex-wrap">
        <span
          v-for="cat in post.categories"
          :key="cat.id"
          class="text-xs font-black uppercase tracking-widest text-[#ff5811]"
        >
          {{ cat.name }}
        </span>
      </div>
      <h2 class="text-base font-black text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#ff5811] transition">
        <NuxtLink :to="`/blog/${post.slug}`">{{ post.title }}</NuxtLink>
      </h2>
      <p class="text-xs text-gray-400 dark:text-gray-500 mt-1.5 uppercase tracking-widest font-bold">
        {{ post.formattedDate }} &middot; {{ post.readingTime }} min read
      </p>
      <div class="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mt-2 leading-relaxed" v-html="post.excerpt" />
    </div>
  </article>
</template>
