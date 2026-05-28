<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'

const { isOpen, close } = useSearchModal()
const { query, results, loading, total, clear } = useSearch()

const inputRef = ref<HTMLInputElement | null>(null)

watch(isOpen, (val) => {
  if (val) {
    nextTick(() => inputRef.value?.focus())
  } else {
    clear()
  }
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

function handleResultClick() {
  close()
}

function postImg(post: PostModel) {
  return post.featuredImage || `https://picsum.photos/seed/${post.id}/80/60`
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
        @keydown="onKeydown"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="close" />

        <!-- Panel -->
        <div class="relative w-full max-w-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.08] shadow-2xl">
          <!-- Input row -->
          <div class="flex items-center gap-3 px-4 h-14 border-b border-gray-100 dark:border-white/[0.08]">
            <svg class="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              ref="inputRef"
              v-model="query"
              type="search"
              placeholder="Search articles…"
              class="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 text-[15px] outline-none"
              autocomplete="off"
            />
            <button @click="close" type="button" class="text-gray-400 hover:text-gray-900 dark:hover:text-white transition text-xs font-bold uppercase tracking-widest flex-shrink-0">
              ESC
            </button>
          </div>

          <!-- Results -->
          <div class="max-h-[60vh] overflow-y-auto">
            <!-- Skeleton -->
            <template v-if="loading">
              <div v-for="n in 3" :key="n" class="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-white/[0.06] animate-pulse">
                <div class="w-[60px] h-[45px] bg-gray-200 dark:bg-[#1a1a1a] flex-shrink-0" />
                <div class="flex-1 space-y-2"><div class="h-3 bg-gray-200 dark:bg-[#1a1a1a] rounded w-3/4" /><div class="h-2.5 bg-gray-200 dark:bg-[#1a1a1a] rounded w-1/3" /></div>
              </div>
            </template>

            <!-- Results list -->
            <template v-else-if="results.length">
              <NuxtLink
                v-for="post in results.slice(0, 8)"
                :key="post.id"
                :to="`/blog/${post.slug}`"
                @click="handleResultClick"
                class="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-white/[0.06] group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
              >
                <div class="w-[60px] h-[45px] flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-[#1a1a1a]">
                  <img :src="postImg(post as PostModel)" :alt="post.title" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-[13px] font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" v-html="post.title" />
                  <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{{ post.categories[0]?.name ?? 'AI' }}</p>
                </div>
              </NuxtLink>

              <!-- View all -->
              <NuxtLink
                v-if="total > 8"
                :to="`/search?q=${encodeURIComponent(query)}`"
                @click="handleResultClick"
                class="flex items-center justify-between px-4 py-3 text-[12px] font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
              >
                <span>View all {{ total }} results for "{{ query }}"</span>
                <svg class="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10"/></svg>
              </NuxtLink>
            </template>

            <!-- Empty state -->
            <div v-else-if="query.trim() && !loading" class="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No results for "<span class="font-semibold text-gray-900 dark:text-white">{{ query }}</span>"
            </div>

            <!-- Initial state -->
            <div v-else class="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-600">
              Start typing to search articles…
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.15s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
