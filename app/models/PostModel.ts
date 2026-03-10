import type { IPost } from '~/interfaces/IPost'
import type { IAuthor } from '~/interfaces/IAuthor'
import type { ICategory } from '~/interfaces/ICategory'
import type { ITag } from '~/interfaces/ITag'
import type { ISeo } from '~/interfaces/ISeo'
import type { WPPost } from '~/types/wordpress'
import { AuthorModel } from './AuthorModel'
import { CategoryModel } from './CategoryModel'
import { TagModel } from './TagModel'

export class PostModel implements IPost {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  featuredImage: string | null
  author: IAuthor
  categories: ICategory[]
  tags: ITag[]
  seo: ISeo

  constructor(raw: WPPost) {
    this.id = raw.id
    this.slug = raw.slug
    this.title = raw.title.rendered
    this.excerpt = raw.excerpt.rendered
    this.content = raw.content.rendered
    this.date = raw.date
    this.featuredImage = raw._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null

    const rawAuthor = raw._embedded?.author?.[0]
    this.author = rawAuthor ? new AuthorModel(rawAuthor) : { id: 0, name: 'Unknown', avatarUrl: null, description: '' }

    const terms = raw._embedded?.['wp:term'] ?? []
    this.categories = (terms[0] ?? []).map(t => new CategoryModel(t))
    this.tags = (terms[1] ?? []).map(t => new TagModel(t))

    this.seo = {
      title: this.title,
      description: this.excerpt.replace(/<[^>]+>/g, '').trim(),
      ogImage: this.featuredImage ?? `https://picsum.photos/seed/${this.id}/1200/630`
    }
  }

  get formattedDate(): string {
    return new Date(this.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  get readingTime(): number {
    const words = this.content.replace(/<[^>]+>/g, '').split(/\s+/).length
    return Math.ceil(words / 200)
  }
}
