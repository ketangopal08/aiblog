<script setup lang="ts">
const route = useRoute()
const { post, loading, error, fetchPost } = usePost()

await fetchPost(route.params.slug as string)

if (post.value) {
  const p = post.value

  const ogImage = p.featuredImage
    ? `https://www.neuralbriefly.com/api/og-image?url=${encodeURIComponent(p.featuredImage)}`
    : 'https://www.neuralbriefly.com/logo-green-transparent.png'

  useSeoMeta({
    title: p.title,
    ogTitle: p.title,
    twitterTitle: p.title,
    description: p.seo.description,
    ogDescription: p.seo.description,
    twitterDescription: p.seo.description,
    ogType: 'article',
    ogImage,
    ogImageSecureUrl: ogImage,
    twitterImage: ogImage,
    twitterCard: 'summary_large_image',
  })

  useHead({
    link: [{ rel: 'canonical', href: `https://www.neuralbriefly.com/blog/${p.slug}` }],
  })
}

const breadcrumbItems = computed(() => {
  if (!post.value) return []
  const items: Array<{ label: string; to?: string }> = [{ label: 'Home', to: '/' }]
  if (post.value.categories[0]) {
    items.push({ label: post.value.categories[0].name, to: `/category/${post.value.categories[0].slug}` })
  }
  items.push({ label: post.value.title })
  return items
})
</script>

<template>
  <div>
    <ClientOnly>
      <ReadingProgress />
    </ClientOnly>
    <div class="max-w-4xl mx-auto px-4 py-10">
      <LoadingSpinner v-if="loading" />
      <p v-else-if="error" class="text-red-500">{{ error }}</p>
      <template v-else-if="post">
        <AppBreadcrumb :items="breadcrumbItems" />
        <BlogDetail :post="post" />
      </template>
      <p v-else class="text-gray-500 dark:text-gray-400">Post not found.</p>
    </div>
  </div>
</template>
