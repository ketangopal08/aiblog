<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'
const { $wp } = useNuxtApp()
const route = useRoute()

const page = computed(() => Number(route.query.page ?? 1))

const { data: tags } = await useAsyncData('all-tags', () => $wp.getTags())

const tag = computed(() => (tags.value ?? []).find(t => t.slug === route.params.slug))

const { data, refresh } = await useAsyncData(
  () => `tag-${route.params.slug}-${page.value}`,
  async () => {
    if (!tag.value) return null
    return $wp.getPostsByTag(tag.value.id, page.value)
  }
)

watch(page, () => refresh())

const posts = computed(() => (data.value?.items ?? []) as PostModel[])
const totalPages = computed(() => data.value?.totalPages ?? 1)
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <template v-if="tag">
      <SeoHead :seo="{
        title: `#${tag.name} – NeuralBriefly`,
        description: `Browse all articles tagged '${tag.name}' on NeuralBriefly.`,
        ogType: 'website',
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: `#${tag.name}`, url: `/tag/${tag.slug}` },
        ],
      }" />
      <AppBreadcrumb :items="[{ label: 'Home', to: '/' }, { label: `#${tag.name}` }]" />
      <h1 class="text-3xl font-black text-gray-900 dark:text-white mb-8 uppercase tracking-widest border-b-2 border-primary pb-3 inline-block">
        #{{ tag.name }}
      </h1>
      <BlogList :posts="posts" />
      <Pagination :current-page="page" :total-pages="totalPages" />
    </template>
    <p v-else class="text-gray-500 dark:text-gray-400">Tag not found.</p>
  </div>
</template>
