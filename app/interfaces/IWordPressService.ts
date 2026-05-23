import type { IPost } from './IPost'
import type { ICategory } from './ICategory'
import type { ITag } from './ITag'
import type { IAuthor } from './IAuthor'
import type { IComment } from './IComment'
import type { IPaginatedResult } from './IPaginatedResult'

export interface IWordPressService {
  // Existing (unchanged)
  getPosts(page?: number, perPage?: number): Promise<IPost[]>
  getPostBySlug(slug: string): Promise<IPost | null>
  getCategories(): Promise<ICategory[]>
  getPostsByCategory(categoryId: number, page?: number): Promise<IPost[]>

  // New paginated variants
  getPostsPaginated(page?: number, perPage?: number): Promise<IPaginatedResult<IPost>>
  getPostsByCategoryPaginated(categoryId: number, page?: number): Promise<IPaginatedResult<IPost>>
  getPostsByTag(tagId: number, page?: number): Promise<IPaginatedResult<IPost>>
  searchPosts(query: string, page?: number): Promise<IPaginatedResult<IPost>>
  getPostsByAuthor(authorId: number, page?: number): Promise<IPaginatedResult<IPost>>

  // Taxonomy helpers
  getTags(): Promise<ITag[]>
  getAuthorBySlug(slug: string): Promise<IAuthor | null>

  // Comments
  getComments(postId: number): Promise<IComment[]>
  postComment(postId: number, data: { author: string; email: string; content: string }): Promise<IComment>
}
