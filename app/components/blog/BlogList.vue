<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'

defineProps<{ posts: PostModel[] }>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <BlogCard v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>
