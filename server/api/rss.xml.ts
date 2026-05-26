interface WPPost {
  slug: string
  date: string
  title: { rendered: string }
  excerpt: { rendered: string }
  _embedded?: {
    author?: Array<{ name: string }>
    'wp:term'?: Array<Array<{ name: string }>>
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim()
}

export default defineCachedEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')

  const config = useRuntimeConfig()
  const baseUrl = config.public.wpBaseUrl
  const siteUrl = 'https://neuralbriefly.com'

  let posts: WPPost[] = []
  try {
    posts = await $fetch<WPPost[]>(`${baseUrl}/wp-json/wp/v2/posts`, {
      params: { per_page: 20, _embed: true, orderby: 'date', order: 'desc' },
    })
  } catch {
    // WP API unreachable — return empty feed
  }

  const items = posts.map(post => {
    const title = escapeXml(post.title.rendered)
    const link = `${siteUrl}/blog/${post.slug}`
    const description = escapeXml(stripHtml(post.excerpt.rendered))
    const pubDate = new Date(post.date).toUTCString()
    const author = escapeXml(post._embedded?.author?.[0]?.name ?? 'NeuralBriefly')
    const category = escapeXml(post._embedded?.['wp:term']?.[0]?.[0]?.name ?? '')

    return `
    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      <author>noreply@neuralbriefly.com (${author})</author>
      ${category ? `<category>${category}</category>` : ''}
    </item>`
  }).join('')

  const lastBuildDate = posts[0] ? new Date(posts[0].date).toUTCString() : new Date().toUTCString()

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NeuralBriefly</title>
    <link>${siteUrl}</link>
    <description>Latest articles on GPT, Gemini, Claude and the AI world.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/api/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`
}, {
  maxAge: 60 * 10,
  name: 'rss-feed',
})
