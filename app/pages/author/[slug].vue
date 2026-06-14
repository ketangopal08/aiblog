<script setup lang="ts">
const { $wp } = useNuxtApp()
const route = useRoute()

const page = computed(() => Number(route.query.page ?? 1))

const { data: author } = await useAsyncData(
  `author-${route.params.slug}`,
  () => $wp.getAuthorBySlug(route.params.slug as string)
)

const { data, refresh } = await useAsyncData(
  () => `author-posts-${route.params.slug}-${page.value}`,
  async () => {
    if (!author.value) return null
    return $wp.getPostsByAuthor(author.value.id, page.value)
  }
)

watch(page, () => refresh())

const posts = computed(() => data.value?.items ?? [])
const totalPages = computed(() => data.value?.totalPages ?? 1)
const total = computed(() => data.value?.total ?? 0)
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <template v-if="author">
      <SeoHead :seo="{
        title: `${author.name} – NeuralBriefly`,
        description: author.description || `Articles by ${author.name} on NeuralBriefly.`,
        ogImage: author.avatarUrl ?? undefined,
        ogType: 'website',
        canonicalUrl: `https://www.neuralbriefly.com/author/${route.params.slug}`,
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: author.name, url: `/author/${route.params.slug}` },
        ],
      }" />

      <AppBreadcrumb :items="[{ label: 'Home', to: '/' }, { label: author.name }]" />

      <!-- Author header -->
      <div class="flex items-start gap-5 mb-10 pb-8 border-b border-gray-100 dark:border-white/[0.06]">
        <img
          v-if="author.avatarUrl"
          :src="author.avatarUrl"
          :alt="author.name"
          class="w-16 h-16 rounded-full flex-shrink-0 bg-gray-200 dark:bg-[#1a1a1a]"
        />
        <div v-else class="w-16 h-16 rounded-full flex-shrink-0 bg-primary/10 flex items-center justify-center text-xl font-black text-primary">
          {{ author.name[0]?.toUpperCase() }}
        </div>
        <div>
          <h1 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{{ author.name }}</h1>
          <p v-if="author.description" class="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">{{ author.description }}</p>
          <p class="text-[11px] font-bold uppercase tracking-[2px] text-gray-400 dark:text-gray-500 mt-2">
            {{ total }} article{{ total !== 1 ? 's' : '' }}
          </p>
        </div>
      </div>

      <BlogList :posts="posts" />
      <Pagination :current-page="page" :total-pages="totalPages" />
    </template>
    <p v-else class="text-gray-500 dark:text-gray-400">Author not found.</p>
  </div>
</template>
