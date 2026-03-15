<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'
const props = defineProps<{ post: PostModel }>()
const img = computed(() => props.post.featuredImage || `https://picsum.photos/seed/${props.post.id}/400/300`)
</script>

<template>
  <NuxtLink
    :to="`/blog/${post.slug}`"
    class="flex-shrink-0 w-52 bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#222222] rounded-xl overflow-hidden hover:shadow-lg dark:hover:border-gray-600 transition-all duration-300 group"
  >
    <!-- image with overlay -->
    <div class="h-28 relative overflow-hidden">
      <img
        :src="img"
        :alt="post.title"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <!-- category on image -->
      <span
        class="absolute bottom-2 left-2 text-[9px] font-black uppercase tracking-wider text-white px-2 py-0.5 rounded-full bg-gray-900/70"
      >
        {{ post.categories[0]?.name ?? 'AI' }}
      </span>
    </div>

    <div class="p-3">
      <h4 class="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-gray-600 dark:group-hover:text-gray-300 transition">
        {{ post.title }}
      </h4>
      <p class="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 uppercase tracking-wide">
        {{ post.formattedDate }}
      </p>
    </div>
  </NuxtLink>
</template>
