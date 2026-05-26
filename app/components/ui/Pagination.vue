<script setup lang="ts">
import { getPages } from '~/utils/pagination'

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const route = useRoute()
const router = useRouter()

const pages = computed(() => getPages(props.currentPage, props.totalPages))

function goTo(page: number) {
  router.push({ query: { ...route.query, page: page === 1 ? undefined : page } })
}
</script>

<template>
  <nav v-if="totalPages > 1" aria-label="Pagination" class="flex items-center justify-center gap-1 mt-10">
    <!-- Prev -->
    <button
      type="button"
      :disabled="currentPage <= 1"
      @click="goTo(currentPage - 1)"
      class="w-9 h-9 flex items-center justify-center border text-sm font-semibold transition-colors
             disabled:opacity-30 disabled:cursor-not-allowed
             border-gray-200 dark:border-white/10
             text-gray-700 dark:text-gray-300
             hover:border-primary hover:text-primary"
      aria-label="Previous page"
    >
      ←
    </button>

    <template v-for="page in pages" :key="page">
      <span
        v-if="page === '...'"
        class="w-9 h-9 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm select-none"
      >…</span>
      <button
        v-else
        type="button"
        @click="goTo(page as number)"
        :aria-current="page === currentPage ? 'page' : undefined"
        :class="page === currentPage
          ? 'bg-primary text-white border-primary'
          : 'border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary'"
        class="w-9 h-9 flex items-center justify-center border text-sm font-semibold transition-colors"
      >
        {{ page }}
      </button>
    </template>

    <!-- Next -->
    <button
      type="button"
      :disabled="currentPage >= totalPages"
      @click="goTo(currentPage + 1)"
      class="w-9 h-9 flex items-center justify-center border text-sm font-semibold transition-colors
             disabled:opacity-30 disabled:cursor-not-allowed
             border-gray-200 dark:border-white/10
             text-gray-700 dark:text-gray-300
             hover:border-primary hover:text-primary"
      aria-label="Next page"
    >
      →
    </button>
  </nav>
</template>
