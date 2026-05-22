interface WPPostSlug {
  slug: string
}

export default defineCachedEventHandler(async () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.wpBaseUrl
  const allSlugs: string[] = []
  let page = 1
  const perPage = 100

  try {
    while (true) {
      const posts = await $fetch<WPPostSlug[]>(`${baseUrl}/wp-json/wp/v2/posts`, {
        params: { per_page: perPage, page, _fields: 'slug' },
      })

      for (const post of posts) allSlugs.push(post.slug)

      if (posts.length < perPage) break
      page++
    }
  } catch {
    // WP API unreachable — return whatever we collected so far (may be empty)
  }

  return allSlugs.map(slug => ({
    loc: `/blog/${slug}`,
    changefreq: 'weekly',
    priority: 0.8,
  }))
}, {
  maxAge: 60 * 10,
  name: 'sitemap-wp-urls',
})
