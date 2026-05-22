<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'

const route = useRoute()
const { $wp } = useNuxtApp()
const { categories, fetchCategories } = useCategories()

try {
  await fetchCategories()
} catch {
  // API unavailable — category list will be empty
}

const category = computed(() =>
  categories.value.find(c => c.slug === route.params.slug)
)

const posts = ref<PostModel[]>([])
if (category.value) {
  try {
    posts.value = await $wp.getPostsByCategory(category.value.id) as PostModel[]
  } catch {
    // API unavailable — posts list will be empty
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <template v-if="category">
      <SeoHead :seo="{
        title: `${category.name} – NeuralBriefly`,
        description: `Browse all ${category.name} articles on NeuralBriefly.`,
        ogType: 'website',
        breadcrumb: { name: category.name, url: `/category/${category.slug}` },
      }" />
      <h1 class="text-3xl font-black text-gray-900 dark:text-white mb-8 uppercase tracking-widest border-b-2 border-gray-900 dark:border-white pb-3 inline-block">
        {{ category.name }}
      </h1>
      <BlogList :posts="posts" />
    </template>
    <p v-else class="text-gray-500 dark:text-gray-400">Category not found.</p>
  </div>
</template>
