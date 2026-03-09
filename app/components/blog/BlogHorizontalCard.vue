<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'
defineProps<{ post: PostModel }>()
</script>

<template>
  <NuxtLink :to="`/blog/${post.slug}`"
    class="flex-shrink-0 w-52 bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#222222] rounded-xl overflow-hidden hover:shadow-md dark:hover:border-teal-600 transition group">
    <div class="h-28 bg-gray-100 dark:bg-[#1f1f1f] overflow-hidden">
      <img
        v-if="post.featuredImage"
        :src="post.featuredImage"
        :alt="post.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600 text-3xl">✦</div>
    </div>
    <div class="p-3">
      <p class="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wide mb-1">
        {{ post.categories[0]?.name ?? 'AI' }}
      </p>
      <h4 class="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
        {{ post.title }}
      </h4>
    </div>
  </NuxtLink>
</template>
