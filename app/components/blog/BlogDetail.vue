<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'
defineProps<{ post: PostModel }>()
</script>

<template>
  <article class="max-w-3xl mx-auto">
    <img
      v-if="post.featuredImage"
      :src="post.featuredImage"
      :alt="post.title"
      class="w-full rounded-2xl mb-8 object-cover max-h-96"
    />

    <!-- Categories -->
    <div class="flex gap-2 mb-4 flex-wrap">
      <span
        v-for="cat in post.categories"
        :key="cat.id"
        class="text-xs font-black uppercase tracking-widest text-[#ff5811] px-0 py-1"
      >
        {{ cat.name }}
      </span>
    </div>

    <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-3 leading-tight">
      {{ post.title }}
    </h1>

    <p class="text-sm text-gray-500 dark:text-gray-400 mb-8 border-b border-gray-200 dark:border-[#222222] pb-6">
      By <span class="font-medium text-gray-700 dark:text-gray-300">{{ post.author.name }}</span>
      &middot; {{ post.formattedDate }}
      &middot; {{ post.readingTime }} min read
    </p>

    <!-- Content -->
    <div
      class="text-gray-800 dark:text-gray-200 leading-relaxed space-y-4 text-base prose-headings:text-gray-900 dark:prose-headings:text-white"
      v-html="post.content"
    />

    <!-- Tags -->
    <div v-if="post.tags.length" class="mt-10 pt-6 border-t border-gray-200 dark:border-[#222222] flex gap-2 flex-wrap">
      <span
        v-for="tag in post.tags"
        :key="tag.id"
        class="text-xs bg-gray-100 dark:bg-[#1f1f1f] text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full border border-gray-200 dark:border-[#2d2d2d]"
      >
        #{{ tag.name }}
      </span>
    </div>

    <!-- Back link -->
    <div class="mt-10">
      <NuxtLink
        to="/"
        class="text-sm font-bold text-[#ff5811] hover:underline uppercase tracking-wide"
      >
        ← Back to all posts
      </NuxtLink>
    </div>
  </article>
</template>
