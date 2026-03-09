import type { ITag } from '~/interfaces/ITag'
import type { WPTerm } from '~/types/wordpress'

export class TagModel implements ITag {
  id: number
  name: string
  slug: string

  constructor(raw: WPTerm) {
    this.id = raw.id
    this.name = raw.name
    this.slug = raw.slug
  }
}
