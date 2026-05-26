<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'

const props = defineProps<{ post: PostModel }>()
const img = computed(() => props.post.featuredImage || `https://picsum.photos/seed/${props.post.id}/1200/600`)

const copied = ref(false)
function copyLink() {
  navigator.clipboard.writeText(window.location.href)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
  <article class="max-w-4xl mx-auto">

    <!-- Categories -->
    <div class="flex gap-3 flex-wrap mb-4">
      <NuxtLink
        v-for="cat in post.categories"
        :key="cat.id"
        :to="`/category/${cat.slug}`"
        class="text-[13px] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        {{ cat.name }}
      </NuxtLink>
    </div>

    <!-- Title -->
    <h1 class="text-[2rem] sm:text-[2.6rem] font-bold text-gray-900 dark:text-white leading-tight mb-4">
      {{ post.title }}
    </h1>

    <!-- Excerpt -->
    <div
      v-if="post.excerpt"
      class="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-2xl"
      v-html="post.excerpt"
    />

    <!-- Featured image -->
    <div class="overflow-hidden mb-8" style="height: clamp(300px, 50vw, 560px)">
      <img
        :src="img"
        :alt="post.title"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Author / meta / share row -->
    <div class="flex items-center justify-between gap-6 pb-8 border-b border-gray-100 dark:border-white/[0.08] flex-wrap">

      <!-- Left: author + date -->
      <div class="flex items-center gap-6">
        <!-- Date -->
        <div class="hidden sm:block">
          <p class="text-[11px] text-gray-400 dark:text-gray-500 leading-none mb-1">Updated on</p>
          <p class="text-[14px] font-semibold text-gray-900 dark:text-white leading-none">{{ post.formattedDate }}</p>
        </div>
        <NuxtLink
          v-if="post.authorSlug"
          :to="`/author/${post.authorSlug}`"
          class="text-[14px] font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors"
        >
          {{ post.author.name }}
        </NuxtLink>
      </div>

      <!-- Right: share buttons -->
      <div class="flex items-center gap-2">
        <!-- Copy link -->
        <button
          @click="copyLink"
          class="flex items-center gap-2 text-[12px] font-medium text-gray-700 dark:text-gray-300
                 border border-gray-200 dark:border-white/10 px-3 py-2 rounded-lg
                 hover:border-primary hover:text-primary
                 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          {{ copied ? 'Copied!' : 'Copy link' }}
        </button>

        <!-- Facebook -->
        <a
          :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent($route.fullPath)}`"
          target="_blank" rel="noopener"
          class="w-9 h-9 flex items-center justify-center border border-gray-200 dark:border-white/10 rounded-lg
                 text-gray-500 dark:text-gray-400 hover:border-gray-900 dark:hover:border-white
                 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Share on Facebook"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
          </svg>
        </a>

        <!-- Instagram -->
        <a
          href="https://instagram.com"
          target="_blank" rel="noopener"
          class="w-9 h-9 flex items-center justify-center border border-gray-200 dark:border-white/10 rounded-lg
                 text-gray-500 dark:text-gray-400 hover:border-gray-900 dark:hover:border-white
                 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Share on Instagram"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
          </svg>
        </a>

        <!-- LinkedIn -->
        <a
          :href="`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent($route.fullPath)}`"
          target="_blank" rel="noopener"
          class="w-9 h-9 flex items-center justify-center border border-gray-200 dark:border-white/10 rounded-lg
                 text-gray-500 dark:text-gray-400 hover:border-gray-900 dark:hover:border-white
                 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Share on LinkedIn"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
            <circle cx="4" cy="4" r="2"/>
          </svg>
        </a>
      </div>
    </div>

    <!-- Article content -->
    <div
      class="prose prose-gray dark:prose-invert max-w-none mt-8 text-gray-800 dark:text-gray-200 leading-relaxed"
      v-html="post.content"
    />

    <!-- Tags -->
    <div v-if="post.tags.length" class="mt-10 pt-6 border-t border-gray-200 dark:border-[#222] flex gap-2 flex-wrap">
      <NuxtLink
        v-for="tag in post.tags"
        :key="tag.id"
        :to="`/tag/${tag.slug}`"
        class="text-xs text-primary bg-primary/10 border border-primary/30 px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors"
      >
        #{{ tag.name }}
      </NuxtLink>
    </div>

    <!-- Comments -->
    <PostComments :post="post" />

    <!-- Back link -->
    <div class="mt-10">
      <NuxtLink to="/" class="text-sm font-bold text-gray-900 dark:text-white hover:underline uppercase tracking-wide">
        ← Back to all posts
      </NuxtLink>
    </div>

    <!-- Related posts -->
    <RelatedPosts :post="post" />

  </article>
</template>
