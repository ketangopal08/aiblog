<script setup lang="ts">
const route = useRoute()
const { $wp } = useNuxtApp()
const { categories, fetchCategories } = useCategories()

await fetchCategories()

const category = computed(() =>
  categories.value.find(c => c.slug === route.params.slug)
)

const posts = ref([])
if (category.value) {
  posts.value = await $wp.getPostsByCategory(category.value.id) as any[]
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <template v-if="category">
      <SeoHead :seo="{ title: `${category.name} – AI Blog`, description: `Posts in ${category.name}` }" />
      <h1 class="text-3xl font-black text-gray-900 dark:text-white mb-8 uppercase tracking-widest border-b-2 border-gray-900 dark:border-white pb-3 inline-block">{{ category.name }}</h1>
      <BlogList :posts="posts" />
    </template>
    <p v-else class="text-gray-500 dark:text-gray-400">Category not found.</p>
  </div>
</template>
