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
  media_details?: {
    width?: number
    height?: number
    sizes?: Record<string, { source_url: string; width: number; height: number }>
  }
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
  author_avatar_urls: Record<string, string> | undefined
  content: { rendered: string }
  date: string
}

export interface WPUser {
  id: number
  name: string
  slug: string
  description: string
  avatar_urls: Record<string, string>
  yoast_head_json?: {
    schema?: {
      '@graph'?: Array<{ '@type': string; sameAs?: string[] }>
    }
  }
}
