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
  return post.featuredImage || `https://picsum.photos/seed/${post.id}/160/120`
}
</script>

<template>
  <div v-if="related && related.length >= 2" class="mt-10 pt-6 border-t border-gray-200 dark:border-[#222]">
    <h3 class="text-[11px] font-black uppercase tracking-[3px] text-gray-900 dark:text-white mb-4">
      More in {{ post.categories[0]?.name ?? 'AI' }}
    </h3>
    <div class="flex flex-col gap-0">
      <NuxtLink
        v-for="item in related"
        :key="item.id"
        :to="`/blog/${item.slug}`"
        class="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-white/[0.06] group
               hover:bg-gray-50 dark:hover:bg-white/[0.02] -mx-2 px-2 transition-colors"
      >
        <div class="w-[80px] h-[60px] flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-[#1a1a1a]">
          <img
            :src="postImg(item)"
            :alt="item.title"
            loading="lazy"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[13px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2
                     group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
            {{ item.title }}
          </p>
          <span class="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 block">
            {{ item.formattedDate }}
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
