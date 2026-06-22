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
          <div v-if="author.socialTwitter || author.socialLinkedIn || author.socialInstagram" class="flex items-center gap-2 mt-3">
            <a
              v-if="author.socialTwitter"
              :href="author.socialTwitter"
              target="_blank" rel="noopener noreferrer" aria-label="Twitter / X"
              class="w-8 h-8 flex items-center justify-center rounded border border-gray-200 dark:border-white/10
                     text-gray-500 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L2.25 2.25h6.865l4.254 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              v-if="author.socialLinkedIn"
              :href="author.socialLinkedIn"
              target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              class="w-8 h-8 flex items-center justify-center rounded border border-gray-200 dark:border-white/10
                     text-gray-500 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a
              v-if="author.socialInstagram"
              :href="author.socialInstagram"
              target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              class="w-8 h-8 flex items-center justify-center rounded border border-gray-200 dark:border-white/10
                     text-gray-500 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <BlogList :posts="posts" />
      <Pagination :current-page="page" :total-pages="totalPages" />
    </template>
    <p v-else class="text-gray-500 dark:text-gray-400">Author not found.</p>
  </div>
</template>
