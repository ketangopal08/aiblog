# Production Blog – Foundation & Wave 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the data layer with pagination/search/tags/comments support, then build all Wave 1 user-facing features: breadcrumbs, `/blog` listing page, pagination, tag pages, and search (modal + results page).

**Architecture:** New service methods use `$fetch.raw()` to read WordPress pagination headers. All listing pages are query-param driven (`?page=N`) so URLs are bookmarkable and Vercel caches each page separately. The search modal is a global singleton (module-level ref) mounted once in `app.vue` and triggered from the header.

**Tech Stack:** Nuxt 4, TypeScript, Tailwind CSS, WordPress REST API, Vitest + happy-dom (unit tests only — models and pure functions)

**Spec:** `docs/superpowers/specs/2026-05-23-production-ready-blog-design.md`

---

## Task 1: Test Infrastructure

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`
- Create: `tests/unit/.gitkeep`

- [ ] **Step 1: Install vitest and happy-dom**

```bash
npm install -D vitest happy-dom
```

Expected: `package.json` devDependencies gains `vitest` and `happy-dom`.

- [ ] **Step 2: Create `vitest.config.ts` at project root**

```typescript
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './app'),
    },
  },
})
```

- [ ] **Step 3: Add test scripts to `package.json`**

In the `"scripts"` block, add after `"postinstall"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Create test directory**

```bash
mkdir -p tests/unit && touch tests/unit/.gitkeep
```

- [ ] **Step 5: Verify vitest runs**

```bash
npm test
```

Expected output: `No test files found` (zero tests pass, no errors).

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts package.json package-lock.json tests/
git commit -m "chore: add vitest test infrastructure"
```

---

## Task 2: Extend Raw WordPress Types

**Files:**
- Modify: `app/types/wordpress.d.ts`

`WPPost` is missing `modified`. `WPAuthor` is missing `slug`. New `WPComment` and `WPUser` types needed for Task 8.

- [ ] **Step 1: Update `app/types/wordpress.d.ts`**

Replace the entire file with:

```typescript
// Raw WordPress REST API response shapes

export interface WPPost {
  id: number
  slug: string
  date: string
  modified: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  _embedded?: {
    author?: WPAuthor[]
    'wp:featuredmedia'?: WPMedia[]
    'wp:term'?: WPTerm[][]
  }
}

export interface WPAuthor {
  id: number
  name: string
  slug: string
  description: string
  avatar_urls: Record<string, string>
}

export interface WPMedia {
  source_url: string
  alt_text: string
}

export interface WPTerm {
  id: number
  name: string
  slug: string
  count: number
  taxonomy: 'category' | 'post_tag'
}

export interface WPComment {
  id: number
  post: number
  parent: number
  author_name: string
  author_avatar_urls: Record<string, string>
  content: { rendered: string }
  date: string
}

export interface WPUser {
  id: number
  name: string
  slug: string
  description: string
  avatar_urls: Record<string, string>
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx nuxt prepare
```

Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add app/types/wordpress.d.ts
git commit -m "feat: extend WP raw types with modified, slug, WPComment, WPUser"
```

---

## Task 3: New Interfaces — IPaginatedResult and IComment

**Files:**
- Create: `app/interfaces/IPaginatedResult.ts`
- Create: `app/interfaces/IComment.ts`

- [ ] **Step 1: Create `app/interfaces/IPaginatedResult.ts`**

```typescript
export interface IPaginatedResult<T> {
  items: T[]
  total: number
  totalPages: number
}
```

- [ ] **Step 2: Create `app/interfaces/IComment.ts`**

```typescript
export interface IComment {
  id: number
  author: string
  avatarUrl: string | null
  content: string
  date: string
  parentId: number | null
}
```

- [ ] **Step 3: Commit**

```bash
git add app/interfaces/IPaginatedResult.ts app/interfaces/IComment.ts
git commit -m "feat: add IPaginatedResult and IComment interfaces"
```

---

## Task 4: Migrate ISeo.breadcrumb → breadcrumbs[] and update useSeo

**Files:**
- Modify: `app/interfaces/ISeo.ts`
- Modify: `app/composables/useSeo.ts`
- Modify: `app/pages/category/[slug].vue`

The single `breadcrumb` field becomes a `breadcrumbs` array. `useSeo` emits a second JSON-LD block when breadcrumbs are present.

- [ ] **Step 1: Update `app/interfaces/ISeo.ts`**

```typescript
export interface ISeo {
  title: string
  description: string
  ogImage?: string
  ogType?: 'article' | 'website'
  canonicalUrl?: string
  article?: {
    publishedTime: string
    modifiedTime?: string
    author: string
    tags?: string[]
  }
  breadcrumbs?: Array<{ name: string; url: string }>
}
```

- [ ] **Step 2: Update `app/composables/useSeo.ts`**

Replace the entire file:

```typescript
import type { ISeo } from '~/interfaces/ISeo'

export const useSeo = (seo: ISeo) => {
  const url = useRequestURL()
  const canonicalUrl = seo.canonicalUrl ?? url.href
  const siteOrigin = url.origin
  const ogType = seo.ogType ?? 'website'
  const ogImage = seo.ogImage

  useSeoMeta({
    title: seo.title,
    ogTitle: seo.title,
    twitterTitle: seo.title,
    description: seo.description,
    ogDescription: seo.description,
    twitterDescription: seo.description,
    ogType,
    ogUrl: canonicalUrl,
    ...(ogImage
      ? { ogImage, twitterImage: ogImage, twitterCard: 'summary_large_image' as const }
      : { twitterCard: 'summary' as const }
    ),
  })

  const scripts: { type: string; innerHTML: string }[] = [
    { type: 'application/ld+json', innerHTML: JSON.stringify(buildMainJsonLd(seo, canonicalUrl, siteOrigin)) },
  ]

  if (seo.breadcrumbs && seo.breadcrumbs.length > 1) {
    scripts.push({
      type: 'application/ld+json',
      innerHTML: JSON.stringify(buildBreadcrumbJsonLd(seo.breadcrumbs, siteOrigin)),
    })
  }

  useHead({
    link: [{ rel: 'canonical', href: canonicalUrl }],
    script: scripts,
  })
}

function buildMainJsonLd(seo: ISeo, canonicalUrl: string, siteOrigin: string): Record<string, unknown> {
  if (seo.article) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: seo.title,
      description: seo.description,
      ...(seo.ogImage && { image: seo.ogImage }),
      datePublished: seo.article.publishedTime,
      ...(seo.article.modifiedTime && { dateModified: seo.article.modifiedTime }),
      author: { '@type': 'Person', name: seo.article.author },
      publisher: {
        '@type': 'Organization',
        name: 'NeuralBriefly',
        url: siteOrigin,
      },
      url: canonicalUrl,
      ...(seo.article.tags?.length && { keywords: seo.article.tags.join(', ') }),
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NeuralBriefly',
    url: siteOrigin,
    description: seo.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteOrigin}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

function buildBreadcrumbJsonLd(
  breadcrumbs: Array<{ name: string; url: string }>,
  siteOrigin: string
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${siteOrigin}${crumb.url}`,
    })),
  }
}
```

- [ ] **Step 3: Update `app/pages/category/[slug].vue` to use `breadcrumbs` array**

In the `<SeoHead>` call, replace `breadcrumb: { name: category.name, url: ... }` with `breadcrumbs`:

```vue
<SeoHead :seo="{
  title: `${category.name} – NeuralBriefly`,
  description: `Browse all ${category.name} articles on NeuralBriefly.`,
  ogType: 'website',
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: category.name, url: `/category/${category.slug}` },
  ],
}" />
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx nuxt prepare
```

Expected: No type errors.

- [ ] **Step 5: Commit**

```bash
git add app/interfaces/ISeo.ts app/composables/useSeo.ts app/pages/category/[slug].vue
git commit -m "feat: migrate ISeo.breadcrumb to breadcrumbs array, emit second JSON-LD block"
```

---

## Task 5: PostModel Additions

**Files:**
- Modify: `app/models/PostModel.ts`
- Create: `tests/unit/PostModel.test.ts`

Add `modifiedDate`, `authorSlug`, wire `seo.article.modifiedTime`, build `seo.breadcrumbs`.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/PostModel.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test
```

Expected: Failures on `modifiedDate`, `authorSlug`, `seo.article.modifiedTime`, `seo.breadcrumbs` — these fields don't exist yet.

- [ ] **Step 3: Update `app/models/PostModel.ts`**

Replace the entire file:

```typescript
import type { IPost } from '~/interfaces/IPost'
import type { IAuthor } from '~/interfaces/IAuthor'
import type { ICategory } from '~/interfaces/ICategory'
import type { ITag } from '~/interfaces/ITag'
import type { ISeo } from '~/interfaces/ISeo'
import type { WPPost } from '~/types/wordpress'
import { AuthorModel } from './AuthorModel'
import { CategoryModel } from './CategoryModel'
import { TagModel } from './TagModel'

export class PostModel implements IPost {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  modifiedDate: string
  authorSlug: string
  featuredImage: string | null
  author: IAuthor
  categories: ICategory[]
  tags: ITag[]
  seo: ISeo

  constructor(raw: WPPost) {
    this.id = raw.id
    this.slug = raw.slug
    this.title = raw.title.rendered
    this.excerpt = raw.excerpt.rendered
    this.content = raw.content.rendered
    this.date = raw.date
    this.modifiedDate = raw.modified ?? raw.date
    this.featuredImage = raw._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null

    const rawAuthor = raw._embedded?.author?.[0]
    this.author = rawAuthor
      ? new AuthorModel(rawAuthor)
      : { id: 0, name: 'Unknown', avatarUrl: null, description: '' }
    this.authorSlug = rawAuthor?.slug ?? ''

    const terms = raw._embedded?.['wp:term'] ?? []
    this.categories = (terms[0] ?? []).map(t => new CategoryModel(t))
    this.tags = (terms[1] ?? []).map(t => new TagModel(t))

    const breadcrumbs: Array<{ name: string; url: string }> = [{ name: 'Home', url: '/' }]
    if (this.categories[0]) {
      breadcrumbs.push({ name: this.categories[0].name, url: `/category/${this.categories[0].slug}` })
    }
    breadcrumbs.push({ name: this.title, url: `/blog/${this.slug}` })

    this.seo = {
      title: this.title,
      description: this.excerpt.replace(/<[^>]+>/g, '').trim(),
      ogImage: this.featuredImage ?? undefined,
      ogType: 'article',
      breadcrumbs,
      article: {
        publishedTime: this.date,
        modifiedTime: this.modifiedDate,
        author: this.author.name,
        tags: this.tags.map(t => t.name),
      },
    }
  }

  get formattedDate(): string {
    return new Date(this.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  get readingTime(): number {
    const words = this.content.replace(/<[^>]+>/g, '').split(/\s+/).length
    return Math.ceil(words / 200)
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: All 8 PostModel tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/models/PostModel.ts tests/unit/PostModel.test.ts
git commit -m "feat: add modifiedDate, authorSlug, seo.breadcrumbs to PostModel"
```

---

## Task 6: IWordPressService — Add New Method Signatures

**Files:**
- Modify: `app/interfaces/IWordPressService.ts`

- [ ] **Step 1: Replace `app/interfaces/IWordPressService.ts`**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx nuxt prepare
```

Expected: TypeScript errors on `WordPressService` and `MockWordPressService` because they don't implement the new methods yet. This is expected — we fix them in Tasks 7–9.

- [ ] **Step 3: Commit**

```bash
git add app/interfaces/IWordPressService.ts app/interfaces/IComment.ts app/interfaces/IPaginatedResult.ts
git commit -m "feat: extend IWordPressService with paginated, search, tags, comments signatures"
```

---

## Task 7: WordPressService — Implement New Methods

**Files:**
- Modify: `app/services/WordPressService.ts`

- [ ] **Step 1: Replace `app/services/WordPressService.ts`**

```typescript
import type { IWordPressService } from '~/interfaces/IWordPressService'
import type { IPost } from '~/interfaces/IPost'
import type { ICategory } from '~/interfaces/ICategory'
import type { ITag } from '~/interfaces/ITag'
import type { IAuthor } from '~/interfaces/IAuthor'
import type { IComment } from '~/interfaces/IComment'
import type { IPaginatedResult } from '~/interfaces/IPaginatedResult'
import type { WPPost, WPTerm, WPComment, WPUser } from '~/types/wordpress'
import { PostModel } from '~/models/PostModel'
import { CategoryModel } from '~/models/CategoryModel'
import { TagModel } from '~/models/TagModel'
import { AuthorModel } from '~/models/AuthorModel'

export class WordPressService implements IWordPressService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
  }

  private get apiBase(): string {
    return `${this.baseUrl}/wp-json/wp/v2`
  }

  private parsePaginationHeaders(headers: Headers): { total: number; totalPages: number } {
    return {
      total: parseInt(headers.get('X-WP-Total') ?? '0'),
      totalPages: parseInt(headers.get('X-WP-TotalPages') ?? '1'),
    }
  }

  // ── Existing methods (unchanged) ──────────────────────────

  async getPosts(page = 1, perPage = 10): Promise<IPost[]> {
    const data = await $fetch<WPPost[]>(`${this.apiBase}/posts`, {
      params: { page, per_page: perPage, _embed: true },
    })
    return data.map(raw => new PostModel(raw))
  }

  async getPostBySlug(slug: string): Promise<IPost | null> {
    const data = await $fetch<WPPost[]>(`${this.apiBase}/posts`, {
      params: { slug, _embed: true },
    })
    return data.length ? new PostModel(data[0]) : null
  }

  async getCategories(): Promise<ICategory[]> {
    const data = await $fetch<WPTerm[]>(`${this.apiBase}/categories`, {
      params: { per_page: 100, hide_empty: true },
    })
    return data.map(raw => new CategoryModel(raw))
  }

  async getPostsByCategory(categoryId: number, page = 1): Promise<IPost[]> {
    const data = await $fetch<WPPost[]>(`${this.apiBase}/posts`, {
      params: { categories: categoryId, page, per_page: 10, _embed: true },
    })
    return data.map(raw => new PostModel(raw))
  }

  // ── New paginated methods ─────────────────────────────────

  async getPostsPaginated(page = 1, perPage = 12): Promise<IPaginatedResult<IPost>> {
    const response = await ($fetch as any).raw(`${this.apiBase}/posts`, {
      params: { page, per_page: perPage, _embed: true },
    })
    const { total, totalPages } = this.parsePaginationHeaders(response.headers)
    return { items: (response._data as WPPost[]).map(raw => new PostModel(raw)), total, totalPages }
  }

  async getPostsByCategoryPaginated(categoryId: number, page = 1): Promise<IPaginatedResult<IPost>> {
    const response = await ($fetch as any).raw(`${this.apiBase}/posts`, {
      params: { categories: categoryId, page, per_page: 10, _embed: true },
    })
    const { total, totalPages } = this.parsePaginationHeaders(response.headers)
    return { items: (response._data as WPPost[]).map(raw => new PostModel(raw)), total, totalPages }
  }

  async getPostsByTag(tagId: number, page = 1): Promise<IPaginatedResult<IPost>> {
    const response = await ($fetch as any).raw(`${this.apiBase}/posts`, {
      params: { tags: tagId, page, per_page: 10, _embed: true },
    })
    const { total, totalPages } = this.parsePaginationHeaders(response.headers)
    return { items: (response._data as WPPost[]).map(raw => new PostModel(raw)), total, totalPages }
  }

  async searchPosts(query: string, page = 1): Promise<IPaginatedResult<IPost>> {
    const response = await ($fetch as any).raw(`${this.apiBase}/posts`, {
      params: { search: query, page, per_page: 10, _embed: true },
    })
    const { total, totalPages } = this.parsePaginationHeaders(response.headers)
    return { items: (response._data as WPPost[]).map(raw => new PostModel(raw)), total, totalPages }
  }

  async getPostsByAuthor(authorId: number, page = 1): Promise<IPaginatedResult<IPost>> {
    const response = await ($fetch as any).raw(`${this.apiBase}/posts`, {
      params: { author: authorId, page, per_page: 10, _embed: true },
    })
    const { total, totalPages } = this.parsePaginationHeaders(response.headers)
    return { items: (response._data as WPPost[]).map(raw => new PostModel(raw)), total, totalPages }
  }

  // ── Taxonomy helpers ──────────────────────────────────────

  async getTags(): Promise<ITag[]> {
    const data = await $fetch<WPTerm[]>(`${this.apiBase}/tags`, {
      params: { per_page: 100, hide_empty: true },
    })
    return data.map(raw => new TagModel(raw))
  }

  async getAuthorBySlug(slug: string): Promise<IAuthor | null> {
    const data = await $fetch<WPUser[]>(`${this.apiBase}/users`, {
      params: { slug },
    })
    return data.length ? new AuthorModel(data[0]) : null
  }

  // ── Comments ──────────────────────────────────────────────

  async getComments(postId: number): Promise<IComment[]> {
    const data = await $fetch<WPComment[]>(`${this.apiBase}/comments`, {
      params: { post: postId, per_page: 100, status: 'approve', orderby: 'date', order: 'asc' },
    })
    return data.map(raw => ({
      id: raw.id,
      author: raw.author_name,
      avatarUrl: raw.author_avatar_urls?.['48'] ?? raw.author_avatar_urls?.['96'] ?? null,
      content: raw.content.rendered,
      date: raw.date,
      parentId: raw.parent || null,
    }))
  }

  async postComment(
    postId: number,
    data: { author: string; email: string; content: string }
  ): Promise<IComment> {
    const raw = await $fetch<WPComment>(`${this.apiBase}/comments`, {
      method: 'POST',
      body: {
        post: postId,
        author_name: data.author,
        author_email: data.email,
        content: data.content,
      },
    })
    return {
      id: raw.id,
      author: raw.author_name,
      avatarUrl: raw.author_avatar_urls?.['48'] ?? null,
      content: raw.content.rendered,
      date: raw.date,
      parentId: raw.parent || null,
    }
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx nuxt prepare
```

Expected: `WordPressService` errors clear. Only `MockWordPressService` still has errors.

- [ ] **Step 3: Commit**

```bash
git add app/services/WordPressService.ts
git commit -m "feat: implement paginated, search, tags, author, comments in WordPressService"
```

---

## Task 8: MockWordPressService — Implement Stubs

**Files:**
- Modify: `app/services/MockWordPressService.ts`

- [ ] **Step 1: Replace `app/services/MockWordPressService.ts`**

Replace the entire file (keep the existing MOCK_CATEGORIES and MOCK_POSTS constants, only replace the class):

```typescript
import type { IWordPressService } from '~/interfaces/IWordPressService'
import type { IPost } from '~/interfaces/IPost'
import type { ICategory } from '~/interfaces/ICategory'
import type { ITag } from '~/interfaces/ITag'
import type { IAuthor } from '~/interfaces/IAuthor'
import type { IComment } from '~/interfaces/IComment'
import type { IPaginatedResult } from '~/interfaces/IPaginatedResult'
import { PostModel } from '~/models/PostModel'
import { CategoryModel } from '~/models/CategoryModel'
import { TagModel } from '~/models/TagModel'

const MOCK_CATEGORIES = [
  { id: 1, name: 'GPT', slug: 'gpt', count: 4, taxonomy: 'category' as const },
  { id: 2, name: 'Gemini', slug: 'gemini', count: 3, taxonomy: 'category' as const },
  { id: 3, name: 'Claude', slug: 'claude', count: 3, taxonomy: 'category' as const },
]

const MOCK_TAGS = [
  { id: 10, name: 'openai', slug: 'openai', count: 5, taxonomy: 'post_tag' as const },
  { id: 11, name: 'google', slug: 'google', count: 3, taxonomy: 'post_tag' as const },
  { id: 12, name: 'anthropic', slug: 'anthropic', count: 3, taxonomy: 'post_tag' as const },
]

const MOCK_POSTS = [
  {
    id: 1, slug: 'gpt-4o-everything-you-need-to-know',
    date: '2025-02-10T10:00:00', modified: '2025-02-10T10:00:00',
    title: { rendered: 'GPT-4o: Everything You Need to Know' },
    excerpt: { rendered: `<p>OpenAI's latest model brings multimodal capabilities to the masses.</p>` },
    content: { rendered: `<p>GPT-4o (pronounced "omni") is OpenAI's flagship model combining text, audio, and vision in a single unified system.</p>` },
    _embedded: {
      author: [{ id: 1, name: 'Alex Kim', slug: 'alex-kim', description: 'AI researcher and writer.', avatar_urls: { '96': 'https://i.pravatar.cc/96?img=11' } }],
      'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/gpt4o/800/450', alt_text: 'GPT-4o' }],
      'wp:term': [
        [{ id: 1, name: 'GPT', slug: 'gpt', count: 4, taxonomy: 'category' }],
        [{ id: 10, name: 'openai', slug: 'openai', count: 5, taxonomy: 'post_tag' }],
      ],
    },
  },
  {
    id: 2, slug: 'google-gemini-ultra-vs-gpt4',
    date: '2025-02-18T09:30:00', modified: '2025-02-18T09:30:00',
    title: { rendered: 'Google Gemini Ultra vs GPT-4: The Real Comparison' },
    excerpt: { rendered: `<p>We ran both models through 200 benchmarks across coding, reasoning, and creativity.</p>` },
    content: { rendered: `<p>Gemini Ultra and GPT-4 are both frontier models, but they have very different strengths.</p>` },
    _embedded: {
      author: [{ id: 2, name: 'Sara Patel', slug: 'sara-patel', description: 'ML engineer.', avatar_urls: { '96': 'https://i.pravatar.cc/96?img=5' } }],
      'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/gemini/800/450', alt_text: 'Gemini vs GPT' }],
      'wp:term': [
        [{ id: 2, name: 'Gemini', slug: 'gemini', count: 3, taxonomy: 'category' }],
        [{ id: 11, name: 'google', slug: 'google', count: 3, taxonomy: 'post_tag' }],
      ],
    },
  },
  {
    id: 3, slug: 'claude-3-opus-coding-assistant',
    date: '2025-03-01T08:00:00', modified: '2025-03-01T08:00:00',
    title: { rendered: 'Claude 3 Opus: The Best Coding Assistant?' },
    excerpt: { rendered: `<p>Anthropic's Claude 3 Opus has been quietly dominating coding benchmarks.</p>` },
    content: { rendered: `<p>Claude 3 Opus scored 84.9% on HumanEval, beating GPT-4 Turbo in several head-to-head tests.</p>` },
    _embedded: {
      author: [{ id: 3, name: 'James Liu', slug: 'james-liu', description: 'Full-stack developer.', avatar_urls: { '96': 'https://i.pravatar.cc/96?img=33' } }],
      'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/claude3/800/450', alt_text: 'Claude 3' }],
      'wp:term': [
        [{ id: 3, name: 'Claude', slug: 'claude', count: 3, taxonomy: 'category' }],
        [{ id: 12, name: 'anthropic', slug: 'anthropic', count: 3, taxonomy: 'post_tag' }],
      ],
    },
  },
  {
    id: 4, slug: 'prompt-engineering-best-practices-2025',
    date: '2025-03-05T11:00:00', modified: '2025-03-05T11:00:00',
    title: { rendered: 'Prompt Engineering Best Practices in 2025' },
    excerpt: { rendered: `<p>Prompt engineering has matured. Here are the techniques that actually work.</p>` },
    content: { rendered: `<p>Chain-of-thought, few-shot examples, and role prompting remain the core toolkit.</p>` },
    _embedded: {
      author: [{ id: 1, name: 'Alex Kim', slug: 'alex-kim', description: 'AI researcher and writer.', avatar_urls: { '96': 'https://i.pravatar.cc/96?img=11' } }],
      'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/prompt/800/450', alt_text: 'Prompt Engineering' }],
      'wp:term': [
        [{ id: 1, name: 'GPT', slug: 'gpt', count: 4, taxonomy: 'category' }],
        [{ id: 13, name: 'prompting', slug: 'prompting', count: 6, taxonomy: 'post_tag' }],
      ],
    },
  },
  {
    id: 5, slug: 'gemini-flash-speed-benchmark',
    date: '2025-03-08T07:00:00', modified: '2025-03-08T07:00:00',
    title: { rendered: 'Gemini Flash: Speed Without Sacrifice' },
    excerpt: { rendered: `<p>Google's lighter Gemini Flash model hits an incredible speed-to-quality ratio.</p>` },
    content: { rendered: `<p>Gemini Flash generates 1,000 tokens in under 0.8 seconds on average.</p>` },
    _embedded: {
      author: [{ id: 2, name: 'Sara Patel', slug: 'sara-patel', description: 'ML engineer.', avatar_urls: { '96': 'https://i.pravatar.cc/96?img=5' } }],
      'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/flash/800/450', alt_text: 'Gemini Flash' }],
      'wp:term': [
        [{ id: 2, name: 'Gemini', slug: 'gemini', count: 3, taxonomy: 'category' }],
        [{ id: 14, name: 'speed', slug: 'speed', count: 2, taxonomy: 'post_tag' }],
      ],
    },
  },
  {
    id: 6, slug: 'claude-haiku-for-production-apps',
    date: '2025-03-09T06:00:00', modified: '2025-03-09T06:00:00',
    title: { rendered: 'Claude Haiku: Production-Ready AI on a Budget' },
    excerpt: { rendered: `<p>Anthropic's smallest model packs a punch for structured tasks.</p>` },
    content: { rendered: `<p>Claude Haiku is Anthropic's fastest and most cost-effective model.</p>` },
    _embedded: {
      author: [{ id: 3, name: 'James Liu', slug: 'james-liu', description: 'Full-stack developer.', avatar_urls: { '96': 'https://i.pravatar.cc/96?img=33' } }],
      'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/haiku/800/450', alt_text: 'Claude Haiku' }],
      'wp:term': [
        [{ id: 3, name: 'Claude', slug: 'claude', count: 3, taxonomy: 'category' }],
        [{ id: 15, name: 'production', slug: 'production', count: 4, taxonomy: 'post_tag' }],
      ],
    },
  },
  {
    id: 7, slug: 'gpt-4-vision-use-cases',
    date: '2025-01-20T10:00:00', modified: '2025-01-20T10:00:00',
    title: { rendered: 'GPT-4 Vision: 10 Real Use Cases Developers Love' },
    excerpt: { rendered: `<p>From receipt scanning to diagram-to-code, GPT-4V is unlocking new product categories.</p>` },
    content: { rendered: `<p>GPT-4 Vision accepts image inputs alongside text, enabling a new class of applications.</p>` },
    _embedded: {
      author: [{ id: 1, name: 'Alex Kim', slug: 'alex-kim', description: 'AI researcher and writer.', avatar_urls: { '96': 'https://i.pravatar.cc/96?img=11' } }],
      'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/vision/800/450', alt_text: 'GPT Vision' }],
      'wp:term': [
        [{ id: 1, name: 'GPT', slug: 'gpt', count: 4, taxonomy: 'category' }],
        [{ id: 16, name: 'vision', slug: 'vision', count: 3, taxonomy: 'post_tag' }],
      ],
    },
  },
  {
    id: 8, slug: 'gemini-code-assist-review',
    date: '2025-01-28T09:00:00', modified: '2025-01-28T09:00:00',
    title: { rendered: 'Gemini Code Assist: A Deep Dive Review' },
    excerpt: { rendered: `<p>Google's Gemini Code Assist is now available in VS Code and JetBrains.</p>` },
    content: { rendered: `<p>Gemini Code Assist integrates into your IDE and offers inline completions, chat, and code generation.</p>` },
    _embedded: {
      author: [{ id: 2, name: 'Sara Patel', slug: 'sara-patel', description: 'ML engineer.', avatar_urls: { '96': 'https://i.pravatar.cc/96?img=5' } }],
      'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/codeassist/800/450', alt_text: 'Gemini Code Assist' }],
      'wp:term': [
        [{ id: 2, name: 'Gemini', slug: 'gemini', count: 3, taxonomy: 'category' }],
        [{ id: 17, name: 'coding', slug: 'coding', count: 5, taxonomy: 'post_tag' }],
      ],
    },
  },
  {
    id: 9, slug: 'claude-constitutional-ai-explained',
    date: '2025-02-05T08:00:00', modified: '2025-02-05T08:00:00',
    title: { rendered: 'Constitutional AI: How Anthropic Builds Safe Models' },
    excerpt: { rendered: `<p>Anthropic's Constitutional AI framework is the foundation of Claude's safety.</p>` },
    content: { rendered: `<p>Constitutional AI (CAI) is a training technique where the model critiques and revises its own outputs against a set of principles.</p>` },
    _embedded: {
      author: [{ id: 3, name: 'James Liu', slug: 'james-liu', description: 'Full-stack developer.', avatar_urls: { '96': 'https://i.pravatar.cc/96?img=33' } }],
      'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/cai/800/450', alt_text: 'Constitutional AI' }],
      'wp:term': [
        [{ id: 3, name: 'Claude', slug: 'claude', count: 3, taxonomy: 'category' }],
        [{ id: 18, name: 'safety', slug: 'safety', count: 4, taxonomy: 'post_tag' }],
      ],
    },
  },
  {
    id: 10, slug: 'ai-agents-2025-landscape',
    date: '2025-03-07T12:00:00', modified: '2025-03-07T12:00:00',
    title: { rendered: 'AI Agents in 2025: The Full Landscape' },
    excerpt: { rendered: `<p>From LangChain to AutoGPT to Claude's tool use — autonomous AI agents are maturing fast.</p>` },
    content: { rendered: `<p>AI agents combine LLMs with tools, memory, and planning to autonomously complete multi-step tasks.</p>` },
    _embedded: {
      author: [{ id: 1, name: 'Alex Kim', slug: 'alex-kim', description: 'AI researcher and writer.', avatar_urls: { '96': 'https://i.pravatar.cc/96?img=11' } }],
      'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/agents/800/450', alt_text: 'AI Agents' }],
      'wp:term': [
        [{ id: 1, name: 'GPT', slug: 'gpt', count: 4, taxonomy: 'category' }],
        [{ id: 19, name: 'agents', slug: 'agents', count: 6, taxonomy: 'post_tag' }],
      ],
    },
  },
]

const MOCK_COMMENTS: IComment[] = [
  { id: 1, author: 'Alice', avatarUrl: 'https://i.pravatar.cc/48?img=1', content: '<p>Great post, very insightful!</p>', date: '2025-03-10T09:00:00', parentId: null },
  { id: 2, author: 'Bob', avatarUrl: 'https://i.pravatar.cc/48?img=2', content: '<p>Thanks for the clear explanation.</p>', date: '2025-03-11T14:30:00', parentId: null },
]

export class MockWordPressService implements IWordPressService {
  async getPosts(page = 1, perPage = 10): Promise<IPost[]> {
    const start = (page - 1) * perPage
    return MOCK_POSTS.slice(start, start + perPage).map(raw => new PostModel(raw as any))
  }

  async getPostBySlug(slug: string): Promise<IPost | null> {
    const raw = MOCK_POSTS.find(p => p.slug === slug)
    return raw ? new PostModel(raw as any) : null
  }

  async getCategories(): Promise<ICategory[]> {
    return MOCK_CATEGORIES.map(raw => new CategoryModel(raw as any))
  }

  async getPostsByCategory(categoryId: number, page = 1): Promise<IPost[]> {
    return MOCK_POSTS
      .filter(p => (p._embedded['wp:term'][0] as any[]).some((t: any) => t.id === categoryId))
      .map(raw => new PostModel(raw as any))
  }

  async getPostsPaginated(page = 1, perPage = 12): Promise<IPaginatedResult<IPost>> {
    const start = (page - 1) * perPage
    const items = MOCK_POSTS.slice(start, start + perPage).map(raw => new PostModel(raw as any))
    return { items, total: MOCK_POSTS.length, totalPages: Math.ceil(MOCK_POSTS.length / perPage) }
  }

  async getPostsByCategoryPaginated(categoryId: number, page = 1): Promise<IPaginatedResult<IPost>> {
    const filtered = MOCK_POSTS.filter(p =>
      (p._embedded['wp:term'][0] as any[]).some((t: any) => t.id === categoryId)
    )
    const items = filtered.slice((page - 1) * 10, page * 10).map(raw => new PostModel(raw as any))
    return { items, total: filtered.length, totalPages: Math.ceil(filtered.length / 10) }
  }

  async getPostsByTag(tagId: number, page = 1): Promise<IPaginatedResult<IPost>> {
    const filtered = MOCK_POSTS.filter(p =>
      (p._embedded['wp:term'][1] as any[]).some((t: any) => t.id === tagId)
    )
    const items = filtered.slice((page - 1) * 10, page * 10).map(raw => new PostModel(raw as any))
    return { items, total: filtered.length, totalPages: Math.ceil(filtered.length / 10) }
  }

  async searchPosts(query: string, page = 1): Promise<IPaginatedResult<IPost>> {
    const q = query.toLowerCase()
    const filtered = MOCK_POSTS.filter(p =>
      p.title.rendered.toLowerCase().includes(q) || p.content.rendered.toLowerCase().includes(q)
    )
    const items = filtered.slice((page - 1) * 10, page * 10).map(raw => new PostModel(raw as any))
    return { items, total: filtered.length, totalPages: Math.ceil(filtered.length / 10) }
  }

  async getPostsByAuthor(authorId: number, page = 1): Promise<IPaginatedResult<IPost>> {
    const filtered = MOCK_POSTS.filter(p => p._embedded.author[0]?.id === authorId)
    const items = filtered.slice((page - 1) * 10, page * 10).map(raw => new PostModel(raw as any))
    return { items, total: filtered.length, totalPages: Math.ceil(filtered.length / 10) }
  }

  async getTags(): Promise<ITag[]> {
    return MOCK_TAGS.map(raw => new TagModel(raw as any))
  }

  async getAuthorBySlug(slug: string): Promise<IAuthor | null> {
    const authorMap: Record<string, IAuthor> = {
      'alex-kim': { id: 1, name: 'Alex Kim', avatarUrl: 'https://i.pravatar.cc/96?img=11', description: 'AI researcher and writer.' },
      'sara-patel': { id: 2, name: 'Sara Patel', avatarUrl: 'https://i.pravatar.cc/96?img=5', description: 'ML engineer and benchmarking enthusiast.' },
      'james-liu': { id: 3, name: 'James Liu', avatarUrl: 'https://i.pravatar.cc/96?img=33', description: 'Full-stack developer and AI tooling reviewer.' },
    }
    return authorMap[slug] ?? null
  }

  async getComments(_postId: number): Promise<IComment[]> {
    return MOCK_COMMENTS
  }

  async postComment(_postId: number, data: { author: string; email: string; content: string }): Promise<IComment> {
    return {
      id: Date.now(),
      author: data.author,
      avatarUrl: null,
      content: `<p>${data.content}</p>`,
      date: new Date().toISOString(),
      parentId: null,
    }
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles with no errors**

```bash
npx nuxt prepare
```

Expected: No TypeScript errors.

- [ ] **Step 3: Run tests**

```bash
npm test
```

Expected: All 8 PostModel tests still pass.

- [ ] **Step 4: Commit**

```bash
git add app/services/MockWordPressService.ts
git commit -m "feat: implement all new methods in MockWordPressService"
```

---

## Task 9: AppBreadcrumb Component

**Files:**
- Create: `app/components/ui/AppBreadcrumb.vue`

- [ ] **Step 1: Create `app/components/ui/AppBreadcrumb.vue`**

```vue
<script setup lang="ts">
defineProps<{
  items: Array<{ label: string; to?: string }>
}>()
</script>

<template>
  <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-[12px] mb-6 flex-wrap">
    <template v-for="(item, index) in items" :key="index">
      <span v-if="index > 0" class="text-gray-300 dark:text-gray-600 select-none">/</span>
      <NuxtLink
        v-if="item.to"
        :to="item.to"
        class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        {{ item.label }}
      </NuxtLink>
      <span
        v-else
        class="text-gray-900 dark:text-white font-medium truncate max-w-[240px]"
        aria-current="page"
      >
        {{ item.label }}
      </span>
    </template>
  </nav>
</template>
```

- [ ] **Step 2: Verify it compiles by starting dev server**

```bash
npm run dev
```

Open `http://localhost:3000`. No console errors. The component isn't wired up yet — that happens in Task 17.

- [ ] **Step 3: Commit**

```bash
git add app/components/ui/AppBreadcrumb.vue
git commit -m "feat: add AppBreadcrumb component"
```

---

## Task 10: Pagination Component

**Files:**
- Create: `app/components/ui/Pagination.vue`
- Create: `tests/unit/Pagination.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/Pagination.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'

// We'll export getPages from the component file and test it here.
// Import after the component file is created in Step 3.
let getPages: (current: number, total: number) => (number | '...')[]

describe('getPages', () => {
  beforeEach(async () => {
    const mod = await import('~/components/ui/Pagination.vue?getPages') as any
    // We'll use a different export approach in Step 3 — a separate util file
    getPages = mod.getPages
  })

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
```

- [ ] **Step 2: Create `app/utils/pagination.ts` (pure helper, no Vue)**

```typescript
export function getPages(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | '...')[] = [1]

  if (current > 3) pages.push('...')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push('...')

  pages.push(total)
  return pages
}
```

- [ ] **Step 3: Update `tests/unit/Pagination.test.ts` to import from util**

Replace the `beforeEach` with a direct import:

```typescript
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: All 13 tests pass (8 PostModel + 5 Pagination).

- [ ] **Step 5: Create `app/components/ui/Pagination.vue`**

```vue
<script setup lang="ts">
import { getPages } from '~/utils/pagination'

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const route = useRoute()
const router = useRouter()

const pages = computed(() => getPages(props.currentPage, props.totalPages))

function goTo(page: number) {
  router.push({ query: { ...route.query, page: page === 1 ? undefined : page } })
}
</script>

<template>
  <nav v-if="totalPages > 1" aria-label="Pagination" class="flex items-center justify-center gap-1 mt-10">
    <!-- Prev -->
    <button
      type="button"
      :disabled="currentPage <= 1"
      @click="goTo(currentPage - 1)"
      class="w-9 h-9 flex items-center justify-center border text-sm font-semibold transition-colors
             disabled:opacity-30 disabled:cursor-not-allowed
             border-gray-200 dark:border-white/10
             text-gray-700 dark:text-gray-300
             hover:border-gray-900 dark:hover:border-white
             hover:text-gray-900 dark:hover:text-white"
      aria-label="Previous page"
    >
      ←
    </button>

    <template v-for="page in pages" :key="page">
      <span
        v-if="page === '...'"
        class="w-9 h-9 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm select-none"
      >…</span>
      <button
        v-else
        type="button"
        @click="goTo(page as number)"
        :aria-current="page === currentPage ? 'page' : undefined"
        :class="page === currentPage
          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
          : 'border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white'"
        class="w-9 h-9 flex items-center justify-center border text-sm font-semibold transition-colors"
      >
        {{ page }}
      </button>
    </template>

    <!-- Next -->
    <button
      type="button"
      :disabled="currentPage >= totalPages"
      @click="goTo(currentPage + 1)"
      class="w-9 h-9 flex items-center justify-center border text-sm font-semibold transition-colors
             disabled:opacity-30 disabled:cursor-not-allowed
             border-gray-200 dark:border-white/10
             text-gray-700 dark:text-gray-300
             hover:border-gray-900 dark:hover:border-white
             hover:text-gray-900 dark:hover:text-white"
      aria-label="Next page"
    >
      →
    </button>
  </nav>
</template>
```

- [ ] **Step 6: Commit**

```bash
git add app/utils/pagination.ts app/components/ui/Pagination.vue tests/unit/Pagination.test.ts
git commit -m "feat: add Pagination component and getPages utility"
```

---

## Task 11: /blog Index Page

**Files:**
- Create: `app/pages/blog/index.vue`
- Modify: `nuxt.config.ts`

- [ ] **Step 1: Create `app/pages/blog/index.vue`**

```vue
<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'

const { $wp } = useNuxtApp()
const route = useRoute()

const page = computed(() => Number(route.query.page ?? 1))

const { data, refresh } = await useAsyncData(
  () => `blog-index-${page.value}`,
  () => $wp.getPostsPaginated(page.value, 12)
)

watch(page, () => refresh())

const posts = computed(() => data.value?.items ?? [])
const totalPages = computed(() => data.value?.totalPages ?? 1)
const total = computed(() => data.value?.total ?? 0)

type ViewMode = 'list' | 'grid'
const view = ref<ViewMode>('list')

function postImg(post: PostModel, w = 480, h = 320) {
  return post.featuredImage || `https://picsum.photos/seed/${post.id}/${w}/${h}`
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3_600_000)
  if (hours < 24) return `${hours} hrs ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <div class="bg-white dark:bg-[#0D0D0D] min-h-screen">
    <SeoHead :seo="{
      title: 'All Posts – NeuralBriefly',
      description: 'Browse all AI articles on NeuralBriefly — GPT, Gemini, Claude and more.',
      ogType: 'website',
    }" />

    <div class="max-w-[1238px] mx-auto px-5 py-10">
      <!-- Header -->
      <div class="flex items-end justify-between mb-8 gap-4 border-b border-gray-100 dark:border-white/[0.06] pb-6">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            All Posts
          </h1>
          <p v-if="total > 0" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ total }} articles
          </p>
        </div>
        <!-- View toggle -->
        <div class="flex gap-1 flex-shrink-0">
          <button @click="view = 'list'" :class="view === 'list' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-400 hover:text-gray-900 dark:hover:text-white'" class="w-9 h-9 flex items-center justify-center transition-colors" aria-label="List view">
            <svg class="w-[15px] h-[15px]" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <button @click="view = 'grid'" :class="view === 'grid' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-400 hover:text-gray-900 dark:hover:text-white'" class="w-9 h-9 flex items-center justify-center transition-colors" aria-label="Grid view">
            <svg class="w-[14px] h-[14px]" fill="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>
          </button>
        </div>
      </div>

      <!-- LIST VIEW -->
      <template v-if="view === 'list'">
        <template v-if="!posts.length">
          <div v-for="n in 6" :key="n" class="flex items-start gap-5 py-5 border-b border-gray-100 dark:border-white/[0.06] animate-pulse">
            <div class="w-[220px] flex-shrink-0 bg-gray-200 dark:bg-[#1a1a1a]" style="height:140px" />
            <div class="flex-1 space-y-3 pt-2"><div class="h-2.5 bg-gray-200 dark:bg-[#1a1a1a] rounded w-24" /><div class="h-4 bg-gray-200 dark:bg-[#1a1a1a] rounded w-full" /><div class="h-4 bg-gray-200 dark:bg-[#1a1a1a] rounded w-4/5" /></div>
          </div>
        </template>
        <NuxtLink v-for="post in posts" :key="post.id" :to="`/blog/${post.slug}`" class="flex items-start gap-4 sm:gap-5 py-5 border-b border-gray-100 dark:border-white/[0.06] group hover:bg-gray-50 dark:hover:bg-white/[0.02] -mx-3 px-3 transition-colors">
          <div class="w-[110px] sm:w-[200px] lg:w-[240px] flex-shrink-0 overflow-hidden" style="height: 130px">
            <img :src="postImg(post)" :alt="post.title" loading="lazy" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
          </div>
          <div class="flex-1 min-w-0 py-1">
            <div class="flex items-start justify-between gap-3 mb-2">
              <span class="text-[9px] font-black uppercase tracking-[2px] text-gray-500 dark:text-gray-400 border-b border-gray-400 dark:border-gray-600 pb-px leading-none">{{ post.categories[0]?.name ?? 'AI' }}</span>
              <span class="text-[11px] text-gray-400 dark:text-gray-500 flex-shrink-0 whitespace-nowrap">{{ timeAgo(post.date) }}</span>
            </div>
            <h2 class="text-[15px] sm:text-[18px] lg:text-[20px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-3 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">{{ post.title }}</h2>
          </div>
        </NuxtLink>
      </template>

      <!-- GRID VIEW -->
      <template v-else>
        <div v-if="!posts.length" class="grid grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="n in 6" :key="n" class="animate-pulse"><div class="bg-gray-200 dark:bg-[#1a1a1a] mb-3" style="height:160px" /><div class="h-2.5 bg-gray-200 dark:bg-[#1a1a1a] rounded w-20 mb-2" /><div class="h-4 bg-gray-200 dark:bg-[#1a1a1a] rounded w-full mb-1" /><div class="h-4 bg-gray-200 dark:bg-[#1a1a1a] rounded w-3/4" /></div>
        </div>
        <div v-else class="grid grid-cols-2 lg:grid-cols-3 gap-5">
          <NuxtLink v-for="post in posts" :key="post.id" :to="`/blog/${post.slug}`" class="group">
            <div class="overflow-hidden mb-3" style="height: 160px">
              <img :src="postImg(post)" :alt="post.title" loading="lazy" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
            </div>
            <span class="text-[9px] font-black uppercase tracking-[2px] text-gray-500 dark:text-gray-400 border-b border-gray-400 dark:border-gray-600 pb-px inline-block mb-2">{{ post.categories[0]?.name ?? 'AI' }}</span>
            <h2 class="text-[14px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">{{ post.title }}</h2>
            <span class="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 block">{{ timeAgo(post.date) }}</span>
          </NuxtLink>
        </div>
      </template>

      <Pagination :current-page="page" :total-pages="totalPages" />
    </div>
  </div>
</template>
```

- [ ] **Step 2: Add ISR rule for `/blog` in `nuxt.config.ts`**

In the `routeRules` object, add:
```typescript
'/blog': { isr: 120 },
```

- [ ] **Step 3: Verify by navigating to `http://localhost:3000/blog`**

```bash
npm run dev
```

Open `http://localhost:3000/blog`. Posts should load with list/grid toggle. Pagination appears if more than 12 posts exist.

- [ ] **Step 4: Commit**

```bash
git add app/pages/blog/index.vue nuxt.config.ts
git commit -m "feat: add /blog listing page with pagination and view toggle"
```

---

## Task 12: Tag Page + Tag Links in BlogDetail

**Files:**
- Create: `app/pages/tag/[slug].vue`
- Modify: `app/components/blog/BlogDetail.vue`

- [ ] **Step 1: Create `app/pages/tag/[slug].vue`**

```vue
<script setup lang="ts">
const { $wp } = useNuxtApp()
const route = useRoute()

const page = computed(() => Number(route.query.page ?? 1))

const { data: tags } = await useAsyncData('all-tags', () => $wp.getTags())

const tag = computed(() => (tags.value ?? []).find(t => t.slug === route.params.slug))

const { data, refresh } = await useAsyncData(
  () => `tag-${route.params.slug}-${page.value}`,
  async () => {
    if (!tag.value) return null
    return $wp.getPostsByTag(tag.value.id, page.value)
  }
)

watch(page, () => refresh())

const posts = computed(() => data.value?.items ?? [])
const totalPages = computed(() => data.value?.totalPages ?? 1)
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <template v-if="tag">
      <SeoHead :seo="{
        title: `#${tag.name} – NeuralBriefly`,
        description: `Browse all articles tagged '${tag.name}' on NeuralBriefly.`,
        ogType: 'website',
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: `#${tag.name}`, url: `/tag/${tag.slug}` },
        ],
      }" />
      <AppBreadcrumb :items="[{ label: 'Home', to: '/' }, { label: `#${tag.name}` }]" />
      <h1 class="text-3xl font-black text-gray-900 dark:text-white mb-8 uppercase tracking-widest border-b-2 border-gray-900 dark:border-white pb-3 inline-block">
        #{{ tag.name }}
      </h1>
      <BlogList :posts="posts" />
      <Pagination :current-page="page" :total-pages="totalPages" />
    </template>
    <p v-else class="text-gray-500 dark:text-gray-400">Tag not found.</p>
  </div>
</template>
```

- [ ] **Step 2: Update tags in `app/components/blog/BlogDetail.vue` to be links**

Find the tags section (lines 60–68 in the original file) and replace the `<span>` with `<NuxtLink>`:

```vue
<!-- Tags -->
<div v-if="post.tags.length" class="mt-10 pt-6 border-t border-gray-200 dark:border-[#222222] flex gap-2 flex-wrap">
  <NuxtLink
    v-for="tag in post.tags"
    :key="tag.id"
    :to="`/tag/${tag.slug}`"
    class="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-[#1f1f1f] border border-gray-200 dark:border-[#2d2d2d] px-3 py-1 rounded-full hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white transition-colors"
  >
    #{{ tag.name }}
  </NuxtLink>
</div>
```

- [ ] **Step 3: Verify by visiting a post and clicking a tag**

```bash
npm run dev
```

Navigate to any blog post. Tags should be clickable links. Clicking one navigates to `/tag/[slug]`.

- [ ] **Step 4: Commit**

```bash
git add app/pages/tag/[slug].vue app/components/blog/BlogDetail.vue
git commit -m "feat: add tag pages and make post tags clickable links"
```

---

## Task 13: useSearch and useSearchModal Composables

**Files:**
- Create: `app/composables/useSearch.ts`
- Create: `app/composables/useSearchModal.ts`

- [ ] **Step 1: Create `app/composables/useSearchModal.ts`**

Module-level ref so the same state is shared across all components that call this composable:

```typescript
import { ref, readonly } from 'vue'

const _isOpen = ref(false)

export function useSearchModal() {
  return {
    isOpen: readonly(_isOpen),
    open: () => { _isOpen.value = true },
    close: () => { _isOpen.value = false },
    toggle: () => { _isOpen.value = !_isOpen.value },
  }
}
```

- [ ] **Step 2: Create `app/composables/useSearch.ts`**

```typescript
import type { IPost } from '~/interfaces/IPost'

export function useSearch() {
  const { $wp } = useNuxtApp()
  const query = ref('')
  const results = ref<IPost[]>([])
  const loading = ref(false)
  const totalPages = ref(0)
  const total = ref(0)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  async function search(q: string, page = 1) {
    if (!q.trim()) {
      results.value = []
      total.value = 0
      totalPages.value = 0
      return
    }
    loading.value = true
    try {
      const res = await $wp.searchPosts(q, page)
      results.value = res.items
      total.value = res.total
      totalPages.value = res.totalPages
    } catch {
      results.value = []
    } finally {
      loading.value = false
    }
  }

  watch(query, (q) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    if (!q.trim()) {
      results.value = []
      loading.value = false
      return
    }
    loading.value = true
    debounceTimer = setTimeout(() => search(q), 300)
  })

  function clear() {
    query.value = ''
    results.value = []
    total.value = 0
    totalPages.value = 0
  }

  return { query, results, loading, total, totalPages, search, clear }
}
```

- [ ] **Step 3: Commit**

```bash
git add app/composables/useSearch.ts app/composables/useSearchModal.ts
git commit -m "feat: add useSearch and useSearchModal composables"
```

---

## Task 14: SearchModal Component

**Files:**
- Create: `app/components/ui/SearchModal.vue`

- [ ] **Step 1: Create `app/components/ui/SearchModal.vue`**

```vue
<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'

const { isOpen, close } = useSearchModal()
const { query, results, loading, total, clear } = useSearch()

const inputRef = ref<HTMLInputElement | null>(null)

watch(isOpen, (val) => {
  if (val) {
    nextTick(() => inputRef.value?.focus())
  } else {
    clear()
  }
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

function handleResultClick() {
  close()
}

function postImg(post: PostModel) {
  return post.featuredImage || `https://picsum.photos/seed/${post.id}/80/60`
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
        @keydown="onKeydown"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="close" />

        <!-- Panel -->
        <div class="relative w-full max-w-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.08] shadow-2xl">
          <!-- Input row -->
          <div class="flex items-center gap-3 px-4 h-14 border-b border-gray-100 dark:border-white/[0.08]">
            <svg class="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              ref="inputRef"
              v-model="query"
              type="search"
              placeholder="Search articles…"
              class="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 text-[15px] outline-none"
              autocomplete="off"
            />
            <button @click="close" type="button" class="text-gray-400 hover:text-gray-900 dark:hover:text-white transition text-xs font-bold uppercase tracking-widest flex-shrink-0">
              ESC
            </button>
          </div>

          <!-- Results -->
          <div class="max-h-[60vh] overflow-y-auto">
            <!-- Skeleton -->
            <template v-if="loading">
              <div v-for="n in 3" :key="n" class="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-white/[0.06] animate-pulse">
                <div class="w-[60px] h-[45px] bg-gray-200 dark:bg-[#1a1a1a] flex-shrink-0" />
                <div class="flex-1 space-y-2"><div class="h-3 bg-gray-200 dark:bg-[#1a1a1a] rounded w-3/4" /><div class="h-2.5 bg-gray-200 dark:bg-[#1a1a1a] rounded w-1/3" /></div>
              </div>
            </template>

            <!-- Results list -->
            <template v-else-if="results.length">
              <NuxtLink
                v-for="post in results.slice(0, 8)"
                :key="post.id"
                :to="`/blog/${post.slug}`"
                @click="handleResultClick"
                class="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-white/[0.06] group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
              >
                <div class="w-[60px] h-[45px] flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-[#1a1a1a]">
                  <img :src="postImg(post as any)" :alt="post.title" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-[13px] font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">{{ post.title }}</p>
                  <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{{ post.categories[0]?.name ?? 'AI' }}</p>
                </div>
              </NuxtLink>

              <!-- View all -->
              <NuxtLink
                v-if="total > 8"
                :to="`/search?q=${encodeURIComponent(query)}`"
                @click="handleResultClick"
                class="flex items-center justify-between px-4 py-3 text-[12px] font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
              >
                <span>View all {{ total }} results for "{{ query }}"</span>
                <svg class="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10"/></svg>
              </NuxtLink>
            </template>

            <!-- Empty state -->
            <div v-else-if="query.trim() && !loading" class="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No results for "<span class="font-semibold text-gray-900 dark:text-white">{{ query }}</span>"
            </div>

            <!-- Initial state -->
            <div v-else class="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-600">
              Start typing to search articles…
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.15s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
```

- [ ] **Step 2: Mount `SearchModal` once in `app/app.vue`**

Read the current `app/app.vue` and add `<ClientOnly><SearchModal /></ClientOnly>` before the closing `</div>` or at the end of the template. The file likely looks like:

```vue
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <SearchModal />
    </ClientOnly>
  </div>
</template>
```

Add `<ClientOnly><SearchModal /></ClientOnly>` inside the root element.

- [ ] **Step 3: Wire search icons in `app/components/ui/AppHeader.vue`**

Find both search `<button>` elements (desktop and mobile) and add `@click="useSearchModal().open()"`:

For the **mobile** search button (around line 138):
```vue
<button type="button" aria-label="Search"
  @click="useSearchModal().open()"
  class="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
```

For the **desktop** search button (around line 232):
```vue
<button type="button" aria-label="Search"
  @click="useSearchModal().open()"
  class="w-7 h-7 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
```

Also add `const { open: openSearch } = useSearchModal()` in the `<script setup>` if you prefer named reference, or call `useSearchModal().open()` inline as shown.

- [ ] **Step 4: Verify search modal works**

```bash
npm run dev
```

Click the search icon in the header. Modal should open, typing should show results (from mock data in dev, or live WP in production), clicking a result should close the modal and navigate.

- [ ] **Step 5: Commit**

```bash
git add app/components/ui/SearchModal.vue app/app.vue app/components/ui/AppHeader.vue
git commit -m "feat: add SearchModal component and wire header search icons"
```

---

## Task 15: Search Results Page

**Files:**
- Create: `app/pages/search.vue`

- [ ] **Step 1: Create `app/pages/search.vue`**

```vue
<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'

const { $wp } = useNuxtApp()
const route = useRoute()

const q = computed(() => String(route.query.q ?? '').trim())
const page = computed(() => Number(route.query.page ?? 1))

const { data, refresh } = await useAsyncData(
  () => `search-${q.value}-${page.value}`,
  async () => {
    if (!q.value) return { items: [], total: 0, totalPages: 0 }
    return $wp.searchPosts(q.value, page.value)
  }
)

watch([q, page], () => refresh())

const posts = computed(() => data.value?.items ?? [])
const total = computed(() => data.value?.total ?? 0)
const totalPages = computed(() => data.value?.totalPages ?? 1)

function postImg(post: PostModel, w = 480, h = 320) {
  return post.featuredImage || `https://picsum.photos/seed/${post.id}/${w}/${h}`
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3_600_000)
  if (hours < 24) return `${hours} hrs ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <div class="bg-white dark:bg-[#0D0D0D] min-h-screen">
    <SeoHead :seo="{
      title: q ? `Search: ${q} – NeuralBriefly` : 'Search – NeuralBriefly',
      description: `Search results for '${q}' on NeuralBriefly.`,
      ogType: 'website',
    }" />
    <!-- Search result pages must not be indexed -->
    <Head><Meta name="robots" content="noindex, follow" /></Head>

    <div class="max-w-[1238px] mx-auto px-5 py-10">
      <!-- Header -->
      <div class="mb-8 border-b border-gray-100 dark:border-white/[0.06] pb-6">
        <h1 class="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          <template v-if="q">
            {{ total }} result{{ total !== 1 ? 's' : '' }} for
            <span class="border-b-2 border-gray-900 dark:border-white">"{{ q }}"</span>
          </template>
          <template v-else>Search</template>
        </h1>
      </div>

      <!-- No query -->
      <div v-if="!q" class="text-center py-20 text-gray-400 dark:text-gray-600">
        <svg class="w-10 h-10 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/></svg>
        <p class="text-sm">Enter a search term to find articles.</p>
      </div>

      <!-- Empty results -->
      <div v-else-if="!posts.length && data" class="text-center py-20 text-gray-500 dark:text-gray-400">
        <p class="text-base font-semibold text-gray-900 dark:text-white mb-2">No articles found for "{{ q }}"</p>
        <p class="text-sm">Try different keywords or browse by <NuxtLink to="/" class="underline hover:text-gray-900 dark:hover:text-white">category</NuxtLink>.</p>
      </div>

      <!-- Results list -->
      <template v-else>
        <NuxtLink
          v-for="post in posts"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          class="flex items-start gap-4 sm:gap-5 py-5 border-b border-gray-100 dark:border-white/[0.06] group hover:bg-gray-50 dark:hover:bg-white/[0.02] -mx-3 px-3 transition-colors"
        >
          <div class="w-[110px] sm:w-[200px] flex-shrink-0 overflow-hidden" style="height: 120px">
            <img :src="postImg(post as any)" :alt="post.title" loading="lazy" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
          </div>
          <div class="flex-1 min-w-0 py-1">
            <div class="flex items-start justify-between gap-3 mb-2">
              <span class="text-[9px] font-black uppercase tracking-[2px] text-gray-500 dark:text-gray-400 border-b border-gray-400 dark:border-gray-600 pb-px">{{ post.categories[0]?.name ?? 'AI' }}</span>
              <span class="text-[11px] text-gray-400 dark:text-gray-500 flex-shrink-0">{{ timeAgo(post.date) }}</span>
            </div>
            <h2 class="text-[15px] sm:text-[18px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">{{ post.title }}</h2>
            <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2" v-html="post.excerpt" />
          </div>
        </NuxtLink>

        <Pagination :current-page="page" :total-pages="totalPages" />
      </template>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Verify by navigating to `http://localhost:3000/search?q=gpt`**

```bash
npm run dev
```

Should show matching results. Empty state for `/search?q=xyz-no-match`. No-query state for `/search`.

- [ ] **Step 3: Commit**

```bash
git add app/pages/search.vue
git commit -m "feat: add /search results page with pagination"
```

---

## Task 16: Wire Breadcrumbs + Update Category Page Pagination

**Files:**
- Modify: `app/pages/blog/[slug].vue`
- Modify: `app/pages/category/[slug].vue`

- [ ] **Step 1: Update `app/pages/blog/[slug].vue` to show breadcrumb**

Replace the entire file:

```vue
<script setup lang="ts">
const route = useRoute()
const { post, loading, error, fetchPost } = usePost()

await fetchPost(route.params.slug as string)

const breadcrumbItems = computed(() => {
  if (!post.value) return []
  const items: Array<{ label: string; to?: string }> = [{ label: 'Home', to: '/' }]
  if (post.value.categories[0]) {
    items.push({ label: post.value.categories[0].name, to: `/category/${post.value.categories[0].slug}` })
  }
  items.push({ label: post.value.title })
  return items
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <LoadingSpinner v-if="loading" />
    <p v-else-if="error" class="text-red-500">{{ error }}</p>
    <template v-else-if="post">
      <SeoHead :seo="post.seo" />
      <AppBreadcrumb :items="breadcrumbItems" />
      <BlogDetail :post="post" />
    </template>
    <p v-else class="text-gray-500 dark:text-gray-400">Post not found.</p>
  </div>
</template>
```

- [ ] **Step 2: Update `app/pages/category/[slug].vue` to use paginated method + pagination UI + breadcrumb**

Replace the entire file:

```vue
<script setup lang="ts">
const route = useRoute()
const { $wp } = useNuxtApp()
const { categories, fetchCategories } = useCategories()

try {
  await fetchCategories()
} catch {
  // API unavailable — category list will be empty
}

const category = computed(() =>
  categories.value.find(c => c.slug === route.params.slug)
)

const page = computed(() => Number(route.query.page ?? 1))

const { data, refresh } = await useAsyncData(
  () => `category-${route.params.slug}-${page.value}`,
  async () => {
    if (!category.value) return null
    return $wp.getPostsByCategoryPaginated(category.value.id, page.value)
  }
)

watch(page, () => refresh())

const posts = computed(() => data.value?.items ?? [])
const totalPages = computed(() => data.value?.totalPages ?? 1)
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <template v-if="category">
      <SeoHead :seo="{
        title: `${category.name} – NeuralBriefly`,
        description: `Browse all ${category.name} articles on NeuralBriefly.`,
        ogType: 'website',
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: category.name, url: `/category/${category.slug}` },
        ],
      }" />
      <AppBreadcrumb :items="[{ label: 'Home', to: '/' }, { label: category.name }]" />
      <h1 class="text-3xl font-black text-gray-900 dark:text-white mb-8 uppercase tracking-widest border-b-2 border-gray-900 dark:border-white pb-3 inline-block">
        {{ category.name }}
      </h1>
      <BlogList :posts="posts" />
      <Pagination :current-page="page" :total-pages="totalPages" />
    </template>
    <p v-else class="text-gray-500 dark:text-gray-400">Category not found.</p>
  </div>
</template>
```

- [ ] **Step 3: Run all tests to confirm nothing broken**

```bash
npm test
```

Expected: All 13 tests pass.

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

- Open any blog post → breadcrumb should show `Home / [Category] / [Post Title]`
- Click the category in breadcrumb → goes to category page with breadcrumb `Home / [Category]`
- Category page shows pagination if more than 10 posts

- [ ] **Step 5: Commit**

```bash
git add app/pages/blog/[slug].vue app/pages/category/[slug].vue
git commit -m "feat: add breadcrumbs to blog post and category pages, paginate category listing"
```

---

## Wave 1 Complete

All 13 tests should pass. Verify the full set:

```bash
npm test
```

Verify the app:
```bash
npm run dev
```

Checklist:
- [ ] `/blog` — paginated post listing with list/grid toggle
- [ ] `/blog/[slug]` — breadcrumb visible above article
- [ ] `/category/[slug]` — breadcrumb + pagination
- [ ] `/tag/[slug]` — tag posts with pagination; post tags are clickable
- [ ] `/search?q=gpt` — search results with pagination
- [ ] Header search icon opens modal; typing shows results; result click navigates
- [ ] Sitemap still generates at `/sitemap.xml`
