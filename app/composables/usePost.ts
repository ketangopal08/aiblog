import type { PostModel } from '~/models/PostModel'

export const usePost = () => {
  const { $wp } = useNuxtApp()
  const post = ref<PostModel | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchPost = async (slug: string) => {
    loading.value = true
    error.value = null
    try {
      post.value = await $wp.getPostBySlug(slug) as PostModel | null
    } catch (e) {
      error.value = 'Failed to load post.'
    } finally {
      loading.value = false
    }
  }

  return { post, loading, error, fetchPost }
}
