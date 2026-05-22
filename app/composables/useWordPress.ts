export const useWordPress = () => {
  const config = useRuntimeConfig()
  const baseUrl = `${config.public.wpUrl}/wp-json/wp/v2`

  const getPosts = () =>
    useFetch(`${baseUrl}/posts?_embed`)

  const getPost = (slug: string) =>
    useFetch(`${baseUrl}/posts?slug=${slug}&_embed`)

  const getCategories = () =>
    useFetch(`${baseUrl}/categories`)

  return { getPosts, getPost, getCategories }
}
