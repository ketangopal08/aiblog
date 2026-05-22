export interface ISeo {
  title: string
  description: string
  ogImage?: string
  ogType?: 'article' | 'website'
  canonicalUrl?: string
  article?: {
    publishedTime: string
    modifiedTime?: string
    author: string
    tags?: string[]
  }
  breadcrumb?: {
    name: string
    url: string
  }
}
