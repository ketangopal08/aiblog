import type { IAuthor } from '~/interfaces/IAuthor'
import type { WPAuthor } from '~/types/wordpress'

export class AuthorModel implements IAuthor {
  id: number
  name: string
  avatarUrl: string | null
  description: string

  constructor(raw: WPAuthor) {
    this.id = raw.id
    this.name = raw.name
    this.description = raw.description
    const avatarSizes = Object.keys(raw.avatar_urls).sort((a, b) => Number(b) - Number(a))
    this.avatarUrl = avatarSizes.length ? raw.avatar_urls[avatarSizes[0]] : null
  }
}
