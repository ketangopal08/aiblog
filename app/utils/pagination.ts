export function getPages(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  // Compute the inner window clamped to [2, total-1]
  let start = Math.max(2, current - 1)
  let end = Math.min(total - 1, current + 1)

  // If the window is only 1 page wide, extend it to 2 pages
  // Prefer extending away from the edge we're clamped against
  if (end - start < 1) {
    if (start === 2) {
      // Near start: extend end forward
      end = Math.min(total - 1, end + 1)
    } else {
      // Near end: extend start backward
      start = Math.max(2, start - 1)
    }
  }

  const pages: (number | '...')[] = [1]

  if (start > 2) pages.push('...')

  for (let i = start; i <= end; i++) pages.push(i)

  if (end < total - 1) pages.push('...')

  pages.push(total)
  return pages
}
