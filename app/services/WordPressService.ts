import type { IWordPressService } from '~/interfaces/IWordPressService'
import type { IPost } from '~/interfaces/IPost'
import type { ICategory } from '~/interfaces/ICategory'
import type { ITag } from '~/interfaces/ITag'
import type { IAuthor } from '~/interfaces/IAuthor'
import type { IComment } from '~/interfaces/IComment'
import type { IPaginatedResult } from '~/interfaces/IPaginatedResult'
import type { WPPost, WPTerm, WPComment, WPUser } from '~/types/wordpress'
import { PostModel } from '~/models/PostModel'

export class WordPressService implements IWordPressService {
  private baseUrl: string
  private siteUrl: string

  constructor(baseUrl: string, siteUrl = '') {
    this.baseUrl = baseUrl.replace(/\/$/, '')
    this.siteUrl = siteUrl.replace(/\/$/, '')
  }

  private rewritePost(post: IPost): IPost {
    if (!this.siteUrl || !this.baseUrl) return post
    const wwwBase = this.baseUrl.replace('https://', 'https://www.')
    const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const rewrite = (html: string) =>
      html
        .replace(new RegExp(`href="${esc(wwwBase)}`, 'g'), `href="${this.siteUrl}`)
        .replace(new RegExp(`href="${esc(this.baseUrl)}`, 'g'), `href="${this.siteUrl}`)
    return {
      ...post,
      content: rewrite(post.content),
      excerpt: rewrite(post.excerpt),
    }
  }

  private get apiBase(): string {
    return `${this.baseUrl}/wp-json/wp/v2`
  }

  private parsePaginationHeaders(headers: Headers): { total: number; totalPages: number } {
    return {
      total: parseInt(headers.get('X-WP-Total') ?? '0'),
      totalPages: parseInt(headers.get('X-WP-TotalPages') ?? '1'),
    }
  }

  private async fetchPostsPaginated(
    params: Record<string, unknown>
  ): Promise<IPaginatedResult<IPost>> {
    const response = await $fetch.raw<WPPost[]>(`${this.apiBase}/posts`, {
      params: { _embed: true, per_page: 10, ...params },
    })
    const { total, totalPages } = this.parsePaginationHeaders(response.headers)
    return {
      items: (response._data ?? []).map((raw: WPPost) => this.rewritePost(PostModel.toPlain(raw))),
      total,
      totalPages,
    }
  }

  // ── Existing methods (unchanged) ──────────────────────────

  async getPosts(page = 1, perPage = 10): Promise<IPost[]> {
    const data = await $fetch<WPPost[]>(`${this.apiBase}/posts`, {
      params: { page, per_page: perPage, _embed: true },
    })
    return data.map(raw => this.rewritePost(PostModel.toPlain(raw)))
  }

  async getPostBySlug(slug: string): Promise<IPost | null> {
    const data = await $fetch<WPPost[]>(`${this.apiBase}/posts`, {
      params: { slug, _embed: true },
    })
    return data.length && data[0] ? this.rewritePost(PostModel.toPlain(data[0])) : null
  }

  async getCategories(): Promise<ICategory[]> {
    const data = await $fetch<WPTerm[]>(`${this.apiBase}/categories`, {
      params: { per_page: 100, hide_empty: true },
    })
    return data.map(raw => ({ id: raw.id, name: raw.name, slug: raw.slug, count: raw.count }))
  }

  async getPostsByCategory(categoryId: number, page = 1): Promise<IPost[]> {
    const data = await $fetch<WPPost[]>(`${this.apiBase}/posts`, {
      params: { categories: categoryId, page, per_page: 10, _embed: true },
    })
    return data.map(raw => this.rewritePost(PostModel.toPlain(raw)))
  }

  // ── New paginated methods ─────────────────────────────────

  async getPostsPaginated(page = 1, perPage = 12): Promise<IPaginatedResult<IPost>> {
    return this.fetchPostsPaginated({ page, per_page: perPage })
  }

  async getPostsByCategoryPaginated(categoryId: number, page = 1): Promise<IPaginatedResult<IPost>> {
    return this.fetchPostsPaginated({ categories: categoryId, page })
  }

  async getPostsByTag(tagId: number, page = 1): Promise<IPaginatedResult<IPost>> {
    return this.fetchPostsPaginated({ tags: tagId, page })
  }

  async searchPosts(query: string, page = 1): Promise<IPaginatedResult<IPost>> {
    return this.fetchPostsPaginated({ search: query, page })
  }

  async getPostsByAuthor(authorId: number, page = 1): Promise<IPaginatedResult<IPost>> {
    return this.fetchPostsPaginated({ author: authorId, page })
  }

  // ── Taxonomy helpers ──────────────────────────────────────

  async getTags(): Promise<ITag[]> {
    const data = await $fetch<WPTerm[]>(`${this.apiBase}/tags`, {
      params: { per_page: 100, hide_empty: true },
    })
    return data.map(raw => ({ id: raw.id, name: raw.name, slug: raw.slug }))
  }

  async getAuthorBySlug(slug: string): Promise<IAuthor | null> {
    const data = await $fetch<WPUser[]>(`${this.apiBase}/users`, {
      params: { slug },
    })
    const raw = data[0]
    if (!raw) return null
    const avatarSizes = Object.keys(raw.avatar_urls).sort((a, b) => Number(b) - Number(a))
    const sameAs = raw.yoast_head_json?.schema?.['@graph']
      ?.find(n => n['@type'] === 'Person')
      ?.sameAs ?? []
    return {
      id: raw.id,
      name: raw.name,
      description: raw.description,
      avatarUrl: avatarSizes[0] ? (raw.avatar_urls[avatarSizes[0]] ?? null) : null,
      socialTwitter: sameAs.find(u => u.includes('x.com') || u.includes('twitter.com')),
      socialLinkedIn: sameAs.find(u => u.includes('linkedin.com')),
      socialInstagram: sameAs.find(u => u.includes('instagram.com')),
    }
  }

  // ── Comments ──────────────────────────────────────────────

  async getComments(postId: number): Promise<IComment[]> {
    const data = await $fetch<WPComment[]>(`${this.apiBase}/comments`, {
      params: { post: postId, per_page: 100, status: 'approve', orderby: 'date', order: 'asc' },
    })
    return data.map(raw => ({
      id: raw.id,
      author: raw.author_name,
      avatarUrl: raw.author_avatar_urls?.['48'] ?? raw.author_avatar_urls?.['96'] ?? null,
      content: raw.content.rendered,
      date: raw.date,
      parentId: raw.parent || null,
    }))
  }

  async postComment(
    postId: number,
    data: { author: string; email: string; content: string }
  ): Promise<IComment> {
    const raw = await $fetch<WPComment>(`${this.apiBase}/comments`, {
      method: 'POST',
      body: {
        post: postId,
        author_name: data.author,
        author_email: data.email,
        content: data.content,
      },
    })
    return {
      id: raw.id,
      author: raw.author_name,
      avatarUrl: raw.author_avatar_urls?.['48'] ?? null,
      content: raw.content.rendered,
      date: raw.date,
      parentId: raw.parent || null,
    }
  }
}
