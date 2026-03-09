<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'
defineProps<{ post: PostModel }>()
</script>

<template>
  <NuxtLink :to="`/blog/${post.slug}`"
    class="block border border-gray-200 dark:border-[#222222] rounded-lg p-3 hover:border-teal-500 hover:bg-gray-50 dark:hover:bg-gray-900 transition group">
    <h3 class="font-semibold text-gray-800 dark:text-gray-200 text-sm leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition line-clamp-2 mb-1">
      {{ post.title }}
    </h3>
    <p class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">
      {{ post.author.name }} · {{ post.formattedDate }}
    </p>
  </NuxtLink>
</template>
