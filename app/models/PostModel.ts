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
  modifiedDate: string
  authorSlug: string
  featuredImage: string | null
  private _ogImageWidth?: number
  private _ogImageHeight?: number
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
      .replace(/^(\s*<figure\b[^>]*class="[^"]*wp-block-image[^"]*"[^>]*>[\s\S]*?<\/figure>\s*)+/i, '')
      .replace(/^(\s*<img\b[^>]*\/?\s*>\s*)+/i, '')
      .trim()
    this.date = raw.date
    this.modifiedDate = raw.modified ?? raw.date
    const featuredMedia = raw._embedded?.['wp:featuredmedia']?.[0]
    this.featuredImage = featuredMedia?.source_url ?? null
    this._ogImageWidth = featuredMedia?.media_details?.width
    this._ogImageHeight = featuredMedia?.media_details?.height

    const rawAuthor = raw._embedded?.author?.[0]
    this.author = rawAuthor
      ? new AuthorModel(rawAuthor)
      : { id: 0, name: 'Unknown', avatarUrl: null, description: '' }
    this.authorSlug = rawAuthor?.slug ?? ''

    const terms = raw._embedded?.['wp:term'] ?? []
    this.categories = (terms[0] ?? []).map(t => new CategoryModel(t))
    this.tags = (terms[1] ?? []).map(t => new TagModel(t))

    const breadcrumbs: Array<{ name: string; url: string }> = [{ name: 'Home', url: '/' }]
    if (this.categories[0]) {
      breadcrumbs.push({ name: this.categories[0].name, url: `/category/${this.categories[0].slug}` })
    }
    breadcrumbs.push({ name: this.title, url: `/blog/${this.slug}` })

    const plainDesc = this.excerpt.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
    this.seo = {
      title: this.title,
      description: plainDesc.length > 160 ? plainDesc.slice(0, 157) + '…' : plainDesc,
      ogImage: this.featuredImage ?? undefined,
      ogImageWidth: this._ogImageWidth,
      ogImageHeight: this._ogImageHeight,
      ogType: 'article',
      breadcrumbs,
      article: {
        publishedTime: this.date,
        modifiedTime: this.modifiedDate,
        author: this.author.name,
        tags: this.tags.map(t => t.name),
      },
    }
  }

  get formattedDate(): string {
    return new Date(this.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  get readingTime(): number {
    const words = this.content.replace(/<[^>]+>/g, '').split(/\s+/).length
    return Math.ceil(words / 200)
  }
}
