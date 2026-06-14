<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'

const route = useRoute()
const { $wp } = useNuxtApp()

const [{ data: post, pending: loading, error: fetchError }, { data: trendingPosts }] = await Promise.all([
  useAsyncData(`post-${route.params.slug}`, () => $wp.getPostBySlug(route.params.slug as string)),
  useAsyncData('trending-posts', () => $wp.getPosts(1, 5) as Promise<PostModel[]>),
])

const error = computed(() => fetchError.value ? 'Failed to load post.' : null)

if (post.value) {
  const p = post.value

  const ogImage = p.featuredImage
    ? `https://www.neuralbriefly.com/api/og-image?url=${encodeURIComponent(p.featuredImage)}`
    : 'https://www.neuralbriefly.com/icon.png'

  useSeo({
    ...p.seo,
    ogImage,
    canonicalUrl: `https://www.neuralbriefly.com/blog/${p.slug}`,
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

function trendImg(p: PostModel) {
  return p.featuredImage || `https://picsum.photos/seed/${p.id}/136/108`
}
</script>

<template>
  <div>
    <ClientOnly>
      <ReadingProgress />
    </ClientOnly>
    <div class="max-w-[1238px] mx-auto px-4 lg:px-0 pb-10 pt-5">
      <LoadingSpinner v-if="loading" />
      <p v-else-if="error" class="text-red-500">{{ error }}</p>
      <template v-else-if="post">
        <div class="flex flex-col lg:flex-row lg:gap-12 xl:gap-16">

          <!-- Article -->
          <div class="flex-1 min-w-0">
            <AppBreadcrumb :items="breadcrumbItems" />
            <BlogDetail :post="post" />
          </div>

          <!-- Trending sidebar -->
          <aside class="w-full lg:w-[300px] xl:w-[330px] flex-shrink-0 mt-10 lg:mt-0 lg:sticky lg:top-[76px] lg:self-start">
            <h3
              class="text-gray-900 dark:text-white pb-[6px] mb-4 border-b-2 border-primary inline-block"
              style="font-family: Inter, sans-serif !important; font-size: 14px !important; letter-spacing: 1px; text-transform: capitalize"
            >
              Trending Now
            </h3>

            <template v-if="trendingPosts?.length">
              <NuxtLink
                v-for="p in trendingPosts"
                :key="p.id"
                :to="`/blog/${p.slug}`"
                class="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-white/[0.06]
                       group hover:bg-gray-50 dark:hover:bg-white/[0.02] -mx-2 px-2 transition-colors"
              >
                <div class="flex-1 min-w-0">
                  <p
                    class="text-[15px] font-medium text-gray-900 dark:text-white leading-snug line-clamp-2
                           group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                    v-html="p.title"
                  />
                  <span class="text-[11px] text-gray-400 dark:text-gray-500 mt-1 block">{{ p.formattedDate }}</span>
                </div>
                <div class="w-[68px] h-[54px] flex-shrink-0 img-card bg-gray-100 dark:bg-[#1f1f1f]">
                  <img
                    :src="trendImg(p)"
                    :alt="p.title"
                    loading="lazy"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </NuxtLink>
            </template>

            <!-- Skeleton -->
            <template v-else>
              <div v-for="n in 5" :key="n" class="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-white/[0.06] animate-pulse">
                <div class="flex-1 space-y-2">
                  <div class="h-3 bg-gray-200 dark:bg-[#222] rounded w-full" />
                  <div class="h-3 bg-gray-200 dark:bg-[#222] rounded w-4/5" />
                  <div class="h-2 bg-gray-200 dark:bg-[#222] rounded w-1/3 mt-1" />
                </div>
                <div class="w-[68px] h-[54px] bg-gray-200 dark:bg-[#222] flex-shrink-0" />
              </div>
            </template>
          </aside>

        </div>
      </template>
      <p v-else class="text-gray-500 dark:text-gray-400">Post not found.</p>
    </div>
  </div>
</template>
