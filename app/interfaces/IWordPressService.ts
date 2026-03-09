import type { IPost } from './IPost'
import type { ICategory } from './ICategory'

export interface IWordPressService {
  getPosts(page?: number, perPage?: number): Promise<IPost[]>
  getPostBySlug(slug: string): Promise<IPost | null>
  getCategories(): Promise<ICategory[]>
  getPostsByCategory(categoryId: number, page?: number): Promise<IPost[]>
}
