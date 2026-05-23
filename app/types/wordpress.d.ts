// Raw WordPress REST API response shapes

export interface WPPost {
  id: number
  slug: string
  date: string
  modified: string
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
  slug: string
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

export interface WPComment {
  id: number
  post: number
  parent: number
  author_name: string
  author_avatar_urls: Record<string, string>
  content: { rendered: string }
  date: string
}

export interface WPUser {
  id: number
  name: string
  slug: string
  description: string
  avatar_urls: Record<string, string>
}
