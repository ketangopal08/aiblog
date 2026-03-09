// Raw WordPress REST API response shapes

export interface WPPost {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  _embedded?: {
    author?: WPAuthor[]
    'wp:featuredmedia'?: WPMedia[]
    'wp:term'?: WPTerm[][]
  }
}

export interface WPAuthor {
  id: number
  name: string
  description: string
  avatar_urls: Record<string, string>
}

export interface WPMedia {
  source_url: string
  alt_text: string
}

export interface WPTerm {
  id: number
  name: string
  slug: string
  count: number
  taxonomy: 'category' | 'post_tag'
}
