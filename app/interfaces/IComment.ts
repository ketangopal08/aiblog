export interface IComment {
  id: number
  author: string
  avatarUrl: string | null
  content: string
  date: string
  parentId: number | null
}
