export interface ISeo {
  title: string
  description: string
  ogImage?: string
  ogImageWidth?: number
  ogImageHeight?: number
  ogType?: 'article' | 'website'
  canonicalUrl?: string
  article?: {
    publishedTime: string
    modifiedTime?: string
    author: string
    tags?: string[]
  }
  breadcrumbs?: Array<{ name: string; url: string }>
}
