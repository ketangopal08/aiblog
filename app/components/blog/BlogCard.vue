<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'

defineProps<{ post: PostModel }>()
</script>

<template>
  <article class="bg-white rounded-2xl shadow hover:shadow-md transition overflow-hidden">
    <img
      v-if="post.featuredImage"
      :src="post.featuredImage"
      :alt="post.title"
      class="w-full h-48 object-cover"
    />
    <div class="p-5">
      <div class="flex gap-2 mb-2 flex-wrap">
        <span
          v-for="cat in post.categories"
          :key="cat.id"
          class="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full"
        >
          {{ cat.name }}
        </span>
      </div>
      <h2 class="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
        <NuxtLink :to="`/blog/${post.slug}`">{{ post.title }}</NuxtLink>
      </h2>
      <p class="text-sm text-gray-500 mb-3">
        {{ post.formattedDate }} &middot; {{ post.readingTime }} min read
      </p>
      <div class="text-gray-600 text-sm line-clamp-3" v-html="post.excerpt" />
    </div>
  </article>
</template>
