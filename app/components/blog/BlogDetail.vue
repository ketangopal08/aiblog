<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'
const props = defineProps<{ post: PostModel }>()
const img = computed(() => props.post.featuredImage || `https://picsum.photos/seed/${props.post.id}/1200/600`)
</script>

<template>
  <article class="max-w-3xl mx-auto">

    <!-- ── Cinematic hero image ── -->
    <div class="relative rounded-2xl overflow-hidden mb-10 -mx-4 sm:mx-0" style="height: clamp(260px, 45vw, 500px)">
      <img
        :src="img"
        :alt="post.title"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <!-- layered gradients -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div class="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

      <!-- bottom overlay content -->
      <div class="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-3">
        <!-- categories -->
        <div class="flex gap-2 flex-wrap">
          <span
            v-for="cat in post.categories"
            :key="cat.id"
            class="text-[10px] font-black uppercase tracking-widest text-white px-2.5 py-1 rounded-full bg-gray-900/80"
          >
            {{ cat.name }}
          </span>
        </div>
        <!-- title on image -->
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white leading-tight line-clamp-3 drop-shadow-lg">
          {{ post.title }}
        </h1>
        <!-- meta -->
        <div class="flex items-center gap-3 text-white/70 text-xs">
          <span class="font-medium text-white/90">{{ post.author.name }}</span>
          <span class="text-white/40">·</span>
          <span>{{ post.formattedDate }}</span>
          <span class="text-white/40">·</span>
          <span class="flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 6v6l4 2"/>
            </svg>
            {{ post.readingTime }} min read
          </span>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div
      class="text-gray-800 dark:text-gray-200 leading-relaxed space-y-4 text-base"
      v-html="post.content"
    />

    <!-- Tags -->
    <div v-if="post.tags.length" class="mt-10 pt-6 border-t border-gray-200 dark:border-[#222222] flex gap-2 flex-wrap">
      <span
        v-for="tag in post.tags"
        :key="tag.id"
        class="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-[#1f1f1f] border border-gray-200 dark:border-[#2d2d2d] px-3 py-1 rounded-full"
      >
        #{{ tag.name }}
      </span>
    </div>

    <!-- Back link -->
    <div class="mt-10">
      <NuxtLink
        to="/"
        class="text-sm font-bold text-gray-900 dark:text-white hover:underline uppercase tracking-wide"
      >
        ← Back to all posts
      </NuxtLink>
    </div>
  </article>
</template>
