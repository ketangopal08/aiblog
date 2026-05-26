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

const page = computed(() => Number(route.query.page ?? 1))

const { data, refresh } = await useAsyncData(
  () => `category-${route.params.slug}-${page.value}`,
  async () => {
    if (!category.value) return null
    return $wp.getPostsByCategoryPaginated(category.value.id, page.value)
  }
)

watch(page, () => refresh())

const posts = computed(() => (data.value?.items ?? []) as PostModel[])
const totalPages = computed(() => data.value?.totalPages ?? 1)
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <template v-if="category">
      <SeoHead :seo="{
        title: `${category.name} – NeuralBriefly`,
        description: `Browse all ${category.name} articles on NeuralBriefly.`,
        ogType: 'website',
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: category.name, url: `/category/${category.slug}` },
        ],
      }" />
      <AppBreadcrumb :items="[{ label: 'Home', to: '/' }, { label: category.name }]" />
      <h1 class="text-3xl font-black text-gray-900 dark:text-white mb-8 uppercase tracking-widest border-b-2 border-primary pb-3 inline-block">
        {{ category.name }}
      </h1>
      <BlogList :posts="posts" />
      <Pagination :current-page="page" :total-pages="totalPages" />
    </template>
    <p v-else class="text-gray-500 dark:text-gray-400">Category not found.</p>
  </div>
</template>
