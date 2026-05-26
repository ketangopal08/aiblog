import type { IPost } from '~/interfaces/IPost'

export function useSearch() {
  const { $wp } = useNuxtApp()
  const query = ref('')
  const results = ref<IPost[]>([])
  const loading = ref(false)
  const totalPages = ref(0)
  const total = ref(0)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  async function search(q: string, page = 1) {
    if (!q.trim()) {
      results.value = []
      total.value = 0
      totalPages.value = 0
      loading.value = false
      return
    }
    loading.value = true
    try {
      const res = await $wp.searchPosts(q, page)
      results.value = res.items
      total.value = res.total
      totalPages.value = res.totalPages
    } catch {
      results.value = []
      total.value = 0
      totalPages.value = 0
    } finally {
      loading.value = false
    }
  }

  watch(query, (q) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    if (!q.trim()) {
      results.value = []
      loading.value = false
      return
    }
    loading.value = true
    debounceTimer = setTimeout(() => search(q), 300)
  })

  function clear() {
    query.value = ''
    results.value = []
    total.value = 0
    totalPages.value = 0
  }

  return { query, results, loading, total, totalPages, search, clear }
}
