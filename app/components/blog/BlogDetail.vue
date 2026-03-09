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
    <div class="flex gap-2 mb-4 flex-wrap">
      <span
        v-for="cat in post.categories"
        :key="cat.id"
        class="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full"
      >
        {{ cat.name }}
      </span>
    </div>
    <h1 class="text-4xl font-bold text-gray-900 mb-3">{{ post.title }}</h1>
    <p class="text-sm text-gray-500 mb-8">
      By {{ post.author.name }} &middot; {{ post.formattedDate }} &middot; {{ post.readingTime }} min read
    </p>
    <div class="prose prose-lg max-w-none" v-html="post.content" />
    <div class="mt-8 flex gap-2 flex-wrap">
      <span
        v-for="tag in post.tags"
        :key="tag.id"
        class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
      >
        #{{ tag.name }}
      </span>
    </div>
  </article>
</template>
