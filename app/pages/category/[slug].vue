<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'
const route = useRoute()
const { $wp } = useNuxtApp()

const page = computed(() => Number(route.query.page ?? 1))

const { data, refresh } = await useAsyncData(
  `cat2-${route.params.slug}-${page.value}`,
  async () => {
    const slug = String(route.params.slug)
    const cats = await $wp.getCategories()
    const matched = cats.find((c: { slug: string }) => c.slug === slug)
    if (!matched) return null
    const result = await $wp.getPostsByCategoryPaginated(matched.id, page.value)
    return { category: matched, ...result }
  }
)

watch(page, () => refresh())

const category = computed(() => data.value?.category ?? null)
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
