import type { IAuthor } from './IAuthor'
import type { ICategory } from './ICategory'
import type { ITag } from './ITag'
import type { ISeo } from './ISeo'

export interface IPost {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  modifiedDate: string
  authorSlug: string
  featuredImage: string | null
  formattedDate: string
  readingTime: number
  author: IAuthor
  categories: ICategory[]
  tags: ITag[]
  seo: ISeo
}
