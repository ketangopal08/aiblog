import { describe, it, expect } from 'vitest'
import { PostModel } from '~/models/PostModel'
import type { WPPost } from '~/types/wordpress'

function makeWPPost(overrides: Partial<WPPost> = {}): WPPost {
  return {
    id: 1,
    slug: 'test-post',
    date: '2024-01-15T10:00:00',
    modified: '2024-02-20T12:00:00',
    title: { rendered: 'Test Post Title' },
    excerpt: { rendered: '<p>Test excerpt.</p>' },
    content: { rendered: '<p>Word1 word2 word3 word4 word5</p>' },
    _embedded: {
      author: [{
        id: 1,
        name: 'Jane Doe',
        slug: 'jane-doe',
        description: 'Author bio here',
        avatar_urls: { '96': 'https://gravatar.com/avatar/abc' },
      }],
      'wp:featuredmedia': [{ source_url: 'https://example.com/img.jpg', alt_text: '' }],
      'wp:term': [
        [{ id: 5, name: 'Technology', slug: 'technology', count: 10, taxonomy: 'category' as const }],
        [{ id: 20, name: 'ai', slug: 'ai', count: 3, taxonomy: 'post_tag' as const }],
      ],
    },
    ...overrides,
  }
}

describe('PostModel', () => {
  it('sets modifiedDate from raw.modified', () => {
    const post = new PostModel(makeWPPost())
    expect(post.modifiedDate).toBe('2024-02-20T12:00:00')
  })

  it('sets authorSlug from embedded author', () => {
    const post = new PostModel(makeWPPost())
    expect(post.authorSlug).toBe('jane-doe')
  })

  it('authorSlug falls back to empty string when no author embedded', () => {
    const post = new PostModel(makeWPPost({ _embedded: undefined }))
    expect(post.authorSlug).toBe('')
  })

  it('sets seo.article.modifiedTime from modifiedDate', () => {
    const post = new PostModel(makeWPPost())
    expect(post.seo.article?.modifiedTime).toBe('2024-02-20T12:00:00')
  })

  it('builds seo.breadcrumbs with 3 levels when category is present', () => {
    const post = new PostModel(makeWPPost())
    expect(post.seo.breadcrumbs).toEqual([
      { name: 'Home', url: '/' },
      { name: 'Technology', url: '/category/technology' },
      { name: 'Test Post Title', url: '/blog/test-post' },
    ])
  })

  it('builds seo.breadcrumbs with 2 levels when no category', () => {
    const post = new PostModel(makeWPPost({ _embedded: { 'wp:term': [[], []] } }))
    expect(post.seo.breadcrumbs).toEqual([
      { name: 'Home', url: '/' },
      { name: 'Test Post Title', url: '/blog/test-post' },
    ])
  })

  it('formattedDate returns human-readable date', () => {
    const post = new PostModel(makeWPPost())
    expect(post.formattedDate).toBe('January 15, 2024')
  })

  it('readingTime returns at least 1 minute', () => {
    const post = new PostModel(makeWPPost())
    expect(post.readingTime).toBeGreaterThanOrEqual(1)
  })
})
