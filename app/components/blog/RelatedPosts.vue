<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'

const props = defineProps<{ post: PostModel }>()
const { $wp } = useNuxtApp()

const { data: related } = await useAsyncData(
  `related-${props.post.id}`,
  async () => {
    if (!props.post.categories[0]) return []
    const res = await $wp.getPostsByCategory(props.post.categories[0].id, 1)
    return (res as PostModel[]).filter(p => p.slug !== props.post.slug).slice(0, 3)
  }
)

function postImg(post: PostModel) {
  return post.featuredImage || `https://picsum.photos/seed/${post.id}/600/400`
}
</script>

<template>
  <div v-if="related && related.length >= 2" class="mt-10 pt-6 border-t border-gray-200 dark:border-[#222]">
    <h3 class="text-[11px] font-black uppercase tracking-[3px] text-gray-900 dark:text-white mb-4">
      More in {{ post.categories[0]?.name ?? 'AI' }}
    </h3>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <NuxtLink
        v-for="item in related"
        :key="item.id"
        :to="`/blog/${item.slug}`"
        class="group flex flex-col overflow-hidden"
      >
        <div class="img-card bg-gray-100 dark:bg-[#1a1a1a] mb-3" style="height: 160px">
          <img
            :src="postImg(item)"
            :alt="item.title"
            loading="lazy"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <p class="text-[13px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2
                   group-hover:text-primary transition-colors mb-1.5"
           v-html="item.title" />
        <span class="text-[11px] text-gray-400 dark:text-gray-500">{{ item.formattedDate }}</span>
      </NuxtLink>
    </div>
  </div>
</template>
