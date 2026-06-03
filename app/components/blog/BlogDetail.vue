<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'

const props = defineProps<{ post: PostModel }>()
const img = computed(() => props.post.featuredImage || `https://picsum.photos/seed/${props.post.id}/1200/600`)

const copied = ref(false)
async function copyLink() {
  const url = window.location.href
  try {
    await navigator.clipboard.writeText(url)
  } catch {
    const el = document.createElement('textarea')
    el.value = url
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.focus()
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
  <article class="max-w-4xl mx-auto">

    <!-- Categories -->
    <div class="flex gap-2 flex-wrap mb-4">
      <NuxtLink
        v-for="cat in post.categories"
        :key="cat.id"
        :to="`/category/${cat.slug}`"
        class="text-[13px] text-primary hover:text-primary/70 transition-colors"
        style="font-family: 'Inter', sans-serif; font-weight: 400"
      >
        {{ cat.name }}
      </NuxtLink>
    </div>

    <!-- Title -->
    <h1
      class="post-title font-bold text-gray-900 dark:text-white leading-tight mb-6"
      v-html="post.title"
    />


    <!-- Meta + share bar -->
    <div class="flex items-center justify-between gap-4 mb-4 flex-wrap" style="font-family: 'Inter', sans-serif">
      <div class="flex items-center gap-2 text-[12px] text-gray-500 dark:text-gray-400">
        <span>Published on {{ post.formattedDate }} | by
          <NuxtLink
            v-if="post.authorSlug"
            :to="`/author/${post.authorSlug}`"
            class="font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors"
          >{{ post.author.name }}</NuxtLink>
          <span v-else class="font-semibold text-gray-900 dark:text-white">{{ post.author.name }}</span>
        </span>
      </div>
      <div class="flex items-center gap-1.5">
        <button @click="copyLink"
          class="flex items-center gap-1.5 text-[11px] font-medium text-gray-600 dark:text-gray-300
                 border border-gray-200 dark:border-white/10 px-2.5 py-1 rounded
                 hover:border-primary hover:text-primary transition-colors">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
        <a :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent($route.fullPath)}`"
          target="_blank" rel="noopener" aria-label="Share on Facebook"
          class="w-7 h-7 flex items-center justify-center border border-gray-200 dark:border-white/10 rounded
                 text-gray-500 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
          </svg>
        </a>
        <a :href="`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent($route.fullPath)}`"
          target="_blank" rel="noopener" aria-label="Share on LinkedIn"
          class="w-7 h-7 flex items-center justify-center border border-gray-200 dark:border-white/10 rounded
                 text-gray-500 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
            <circle cx="4" cy="4" r="2"/>
          </svg>
        </a>
        <a :href="`https://twitter.com/intent/tweet?url=${encodeURIComponent($route.fullPath)}&text=${encodeURIComponent(post.title)}`"
          target="_blank" rel="noopener" aria-label="Share on Twitter"
          class="w-7 h-7 flex items-center justify-center border border-gray-200 dark:border-white/10 rounded
                 text-gray-500 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L2.25 2.25h6.865l4.254 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
      </div>
    </div>

    <!-- Featured image -->
    <div class="img-card mb-8" style="height: clamp(300px, 50vw, 560px)">
      <img :src="img" :alt="post.title" class="w-full h-full object-cover" />
    </div>

    <!-- Article content -->
    <WpContent :content="post.content" class="mt-8" />

    <!-- Tags -->
    <div v-if="post.tags.length" class="mt-10 pt-6 border-t border-gray-200 dark:border-[#222] flex gap-2 flex-wrap">
      <NuxtLink
        v-for="tag in post.tags"
        :key="tag.id"
        :to="`/tag/${tag.slug}`"
        class="text-xs text-white bg-primary px-3 py-1 rounded-full hover:bg-primary/80 transition-colors"
      >
        #{{ tag.name }}
      </NuxtLink>
    </div>

    <!-- Related posts -->
    <RelatedPosts :post="post" />

    <!-- Comments -->
    <PostComments :post="post" />

    <!-- Back link -->
    <div class="mt-10">
      <NuxtLink to="/" class="text-sm font-bold text-gray-900 dark:text-white hover:underline uppercase tracking-wide">
        ← Back to all posts
      </NuxtLink>
    </div>

  </article>
</template>

<style scoped>
.post-title { font-size: 2rem !important; }
@media (min-width: 1024px) {
  .post-title { font-size: 2.6rem !important; }
}
</style>
