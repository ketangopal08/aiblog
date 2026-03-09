import type { PostModel } from '~/models/PostModel'

export const usePosts = () => {
  const { $wp } = useNuxtApp()
  const posts = ref<PostModel[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)

  const fetchPosts = async (page = 1) => {
    loading.value = true
    error.value = null
    try {
      posts.value = await $wp.getPosts(page) as PostModel[]
      currentPage.value = page
    } catch (e) {
      error.value = 'Failed to load posts.'
    } finally {
      loading.value = false
    }
  }

  return { posts, loading, error, currentPage, fetchPosts }
}
