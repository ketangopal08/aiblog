import type { ICategory } from '~/interfaces/ICategory'
import type { WPTerm } from '~/types/wordpress'

export class CategoryModel implements ICategory {
  id: number
  name: string
  slug: string
  count: number

  constructor(raw: WPTerm) {
    this.id = raw.id
    this.name = raw.name
    this.slug = raw.slug
    this.count = raw.count
  }
}
