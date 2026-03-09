import type { IWordPressService } from '~/interfaces/IWordPressService'
import type { IPost } from '~/interfaces/IPost'
import type { ICategory } from '~/interfaces/ICategory'
import type { WPPost, WPTerm } from '~/types/wordpress'
import { PostModel } from '~/models/PostModel'
import { CategoryModel } from '~/models/CategoryModel'

export class WordPressService implements IWordPressService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
  }

  private get apiBase(): string {
    return `${this.baseUrl}/wp-json/wp/v2`
  }

  async getPosts(page = 1, perPage = 10): Promise<IPost[]> {
    const data = await $fetch<WPPost[]>(`${this.apiBase}/posts`, {
      params: { page, per_page: perPage, _embed: true }
    })
    return data.map(raw => new PostModel(raw))
  }

  async getPostBySlug(slug: string): Promise<IPost | null> {
    const data = await $fetch<WPPost[]>(`${this.apiBase}/posts`, {
      params: { slug, _embed: true }
    })
    return data.length ? new PostModel(data[0]) : null
  }

  async getCategories(): Promise<ICategory[]> {
    const data = await $fetch<WPTerm[]>(`${this.apiBase}/categories`, {
      params: { per_page: 100, hide_empty: true }
    })
    return data.map(raw => new CategoryModel(raw))
  }

  async getPostsByCategory(categoryId: number, page = 1): Promise<IPost[]> {
    const data = await $fetch<WPPost[]>(`${this.apiBase}/posts`, {
      params: { categories: categoryId, page, per_page: 10, _embed: true }
    })
    return data.map(raw => new PostModel(raw))
  }
}
