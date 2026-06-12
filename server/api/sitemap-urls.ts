interface WPSlug {
  slug: string
}

interface WPPostWithMedia {
  slug: string
  modified: string
  title: { rendered: string }
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url?: string
      alt_text?: string
      title?: { rendered: string }
    }>
  }
}

export default defineCachedEventHandler(async () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.wpBaseUrl
  const apiBase = `${baseUrl}/wp-json/wp/v2`
  const urls: { loc: string; changefreq: string; priority: number; images?: { loc: string; title?: string; caption?: string }[] }[] = []

  // Blog posts (paginated) — embed featured media for image sitemap entries
  try {
    let page = 1
    const perPage = 100
    while (true) {
      const posts = await $fetch<WPPostWithMedia[]>(`${apiBase}/posts`, {
        params: { per_page: perPage, page, _embed: true, _fields: 'slug,title,modified,_links,_embedded' },
      })
      for (const p of posts) {
        const media = p._embedded?.['wp:featuredmedia']?.[0]
        const images = media?.source_url
          ? [{ loc: media.source_url, title: media.alt_text || media.title?.rendered || p.title.rendered }]
          : undefined
        urls.push({ loc: `/blog/${p.slug}`, lastmod: p.modified, changefreq: 'weekly', priority: 0.8, ...(images && { images }) })
      }
      if (posts.length < perPage) break
      page++
    }
  } catch { /* WP API unreachable */ }

  // Categories
  try {
    const categories = await $fetch<WPSlug[]>(`${apiBase}/categories`, {
      params: { per_page: 100, hide_empty: true, _fields: 'slug' },
    })
    for (const c of categories) urls.push({ loc: `/category/${c.slug}`, changefreq: 'weekly', priority: 0.6 })
  } catch { /* ignore */ }

  // Tags
  try {
    const tags = await $fetch<WPSlug[]>(`${apiBase}/tags`, {
      params: { per_page: 100, hide_empty: true, _fields: 'slug' },
    })
    for (const t of tags) urls.push({ loc: `/tag/${t.slug}`, changefreq: 'weekly', priority: 0.5 })
  } catch { /* ignore */ }

  // Authors
  try {
    const authors = await $fetch<WPSlug[]>(`${apiBase}/users`, {
      params: { per_page: 100, _fields: 'slug' },
    })
    for (const a of authors) urls.push({ loc: `/author/${a.slug}`, changefreq: 'monthly', priority: 0.5 })
  } catch { /* ignore */ }

  return urls
}, {
  maxAge: 60 * 10,
  name: 'sitemap-wp-urls',
})
