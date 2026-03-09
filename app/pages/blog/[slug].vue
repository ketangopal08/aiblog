<script setup lang="ts">
const route = useRoute()
const { post, loading, error, fetchPost } = usePost()

await fetchPost(route.params.slug as string)
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <LoadingSpinner v-if="loading" />
    <p v-else-if="error" class="text-red-500">{{ error }}</p>
    <template v-else-if="post">
      <SeoHead :seo="post.seo" />
      <BlogDetail :post="post" />
    </template>
    <p v-else class="text-gray-500">Post not found.</p>
  </div>
</template>
