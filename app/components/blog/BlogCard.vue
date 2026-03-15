<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'
defineProps<{ post: PostModel }>()
</script>

<template>
  <NuxtLink
    :to="`/blog/${post.slug}`"
    class="group flex flex-col rounded-xl border border-gray-100 dark:border-[#222]
           bg-white dark:bg-[#161616] overflow-hidden
           hover:-translate-y-0.5
           hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]
           dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
           transition-all duration-200"
  >
    <!-- Image -->
    <div class="relative w-full aspect-video overflow-hidden bg-gray-100 dark:bg-[#1f1f1f] flex-shrink-0">
      <img
        :src="post.featuredImage || `https://picsum.photos/seed/${post.id}/800/450`"
        :alt="post.title"
        loading="lazy"
        class="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
      />
      <span class="absolute top-2.5 right-2.5 bg-black/50 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
        {{ post.readingTime }} min read
      </span>
    </div>

    <!-- Body -->
    <div class="flex flex-col flex-1 p-[18px] gap-2">
      <!-- Category -->
      <div class="flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
        <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          {{ post.categories[0]?.name ?? 'AI' }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="text-[15px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2
                 tracking-[-0.2px] group-hover:text-primary transition-colors">
        {{ post.title }}
      </h3>

      <!-- Excerpt: post.excerpt comes from WordPress REST API (server-sanitized HTML) -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div
        class="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 flex-1"
        v-html="post.excerpt"
      />

      <!-- Footer -->
      <div class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-[#222]
                  text-[11px] text-gray-400 dark:text-gray-500 mt-auto">
        <span>{{ post.author.name }}</span>
        <span>{{ post.formattedDate }}</span>
      </div>
    </div>
  </NuxtLink>
</template>
