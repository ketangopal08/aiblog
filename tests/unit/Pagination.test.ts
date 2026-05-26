import { describe, it, expect } from 'vitest'
import { getPages } from '~/utils/pagination'

describe('getPages', () => {
  it('returns all pages when total <= 7', () => {
    expect(getPages(1, 5)).toEqual([1, 2, 3, 4, 5])
    expect(getPages(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('shows ellipsis at end when current is near start', () => {
    expect(getPages(1, 10)).toEqual([1, 2, 3, '...', 10])
    expect(getPages(2, 10)).toEqual([1, 2, 3, '...', 10])
  })

  it('shows ellipsis at start when current is near end', () => {
    expect(getPages(10, 10)).toEqual([1, '...', 8, 9, 10])
    expect(getPages(9, 10)).toEqual([1, '...', 8, 9, 10])
  })

  it('shows ellipsis on both sides when current is in middle', () => {
    expect(getPages(5, 10)).toEqual([1, '...', 4, 5, 6, '...', 10])
    expect(getPages(6, 12)).toEqual([1, '...', 5, 6, 7, '...', 12])
  })

  it('returns [1] for total of 1', () => {
    expect(getPages(1, 1)).toEqual([1])
  })
})
