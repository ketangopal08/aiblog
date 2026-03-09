import type { CategoryModel } from '~/models/CategoryModel'

export const useCategories = () => {
  const { $wp } = useNuxtApp()
  const categories = ref<CategoryModel[]>([])
  const loading = ref(false)

  const fetchCategories = async () => {
    loading.value = true
    try {
      categories.value = await $wp.getCategories() as CategoryModel[]
    } finally {
      loading.value = false
    }
  }

  return { categories, loading, fetchCategories }
}
